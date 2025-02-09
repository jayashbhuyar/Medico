from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ollama
import logging
import traceback
import re  

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
        
        prompt = f"""You are a **medical referral assistant**. Your only task is to analyze the provided symptoms and recommend **the most appropriate medical specialist** for treatment.

### **Strict Rules:**
1. **Process only valid medical symptoms.** If the input contains casual talk, greetings, or non-medical content, respond with:
   - *"Please provide clear medical symptoms for evaluation."*
2. **Do NOT provide explanations, engage in conversations, or offer multiple specialists unless absolutely necessary.**  
3. **If symptoms are vague or could belong to multiple fields, prioritize the most relevant specialist.**  
4. **For each input, respond with only the specialist's title in this format:**  
   - *"Consult a [Specialist Name]."*
   - Example: *"Consult a Dermatologist."*
5. **If the input is not medically relevant, do not guess—just follow Rule 1.**  

### **Input:**
*"User reports: {user_input}"*

### **Expected Response:**
- **If symptoms are valid, return only one specialist.**
- **If symptoms are unclear, follow Rule 1.**
- **Your response must be short, professional, and medically accurate.**
"""


        
        logger.debug(f"Sending prompt to model: {prompt}")
        
        try:
            response = ollama.chat(model="deepseek-r1:1.5b", messages=[{
                "role": "user", 
                "content": prompt
            }])
            
            # Clean response content
            response_content = response["message"]["content"]
            cleaned_content = re.sub(r"<think>.*?</think>", "", response_content, flags=re.DOTALL).strip()
            
            logger.info(f"Model response received: {cleaned_content}")
            return {"referral": cleaned_content}
            
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