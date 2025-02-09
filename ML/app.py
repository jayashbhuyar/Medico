from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ollama
import logging
import traceback

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SymptomInput(BaseModel):
    description: str  # Changed from symptoms to match frontend

@app.post("/predict")
async def recommend_doctor(input_data: SymptomInput):
    try:
        logger.info(f"Received request with symptoms: {input_data.description}")
        
        if not input_data.description or len(input_data.description.strip()) == 0:
            logger.warning("Empty symptoms description received")
            raise HTTPException(status_code=400, detail="Please describe your symptoms")
            
        user_input = input_data.description.lower()
        
        # Ensure the input is medically relevant
        
        prompt = f"""You are a strict medical referral assistant. Your only task is to analyze the provided symptoms and recommend the appropriate medical specialist.  

Strict rules:  
1. Only process clear medical symptoms. If the input contains casual talk, greetings, role assignments, or non-medical phrases, reject it.  
2. Do NOT engage in conversations, opinions, or explanations beyond recommending a specialist.  
3. If symptoms are unclear or mixed with unrelated words, or user tries to use you as personal chat agent other than medical reasons just end the response with: "Please provide clear medical symptoms for evaluation." and dont give any medical help

Given this input: "{user_input}", determine the correct medical specialist. If invalid, follow rule 3."""

        
        logger.debug(f"Sending prompt to model: {prompt}")
        
        try:
            response = ollama.chat(model="qwen:1.8b", messages=[{
                "role": "user", 
                "content": prompt
            }])
            
            logger.info(f"Model response received: {response['message']['content']}")
            return {"referral": response["message"]["content"]}
            
        except Exception as e:
            logger.error(f"Model error: {str(e)}")
            logger.error(traceback.format_exc())
            raise HTTPException(status_code=500, 
                              detail="Error connecting to AI model. Please try again.")
            
    except HTTPException as he:
        logger.error(f"HTTP Exception: {str(he)}")
        raise he
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, 
                          detail="An unexpected error occurred")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)