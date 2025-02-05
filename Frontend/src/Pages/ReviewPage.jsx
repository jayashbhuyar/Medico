import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ReviewPage = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/reviews/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          text: comment,
          reviewerEmail: 'user@example.com',
          entityType: 'Hospital',
          entityEmail: 'hospital@example.com'
        })
      });
      if (response.ok) {
        toast.success('Thank you for your feedback!');
        setRating(0);
        setComment('');
      }
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent 
                         bg-gradient-to-r from-blue-600 to-blue-800 mb-4">
            Share Your Experience
          </h1>
          <p className="text-lg text-gray-700">
            Your feedback helps us improve and provide better healthcare services.
          </p>
        </motion.div>

        {/* Review Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-10 md:p-12 mb-16 border border-gray-200"
        >
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Rating Section */}
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                How would you rate your experience?
              </h2>
              <div className="flex gap-4 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transform transition-all duration-200 hover:scale-125"
                  >
                    <FaStar 
                      className={`w-10 h-10 ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Section */}
            <div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us about your experience..."
                className="w-full h-48 p-5 text-lg border-2 border-gray-300 rounded-2xl
                         focus:ring-4 focus:ring-blue-200 focus:border-blue-500
                         resize-none transition-all duration-200 shadow-sm"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 
                       text-white text-xl font-semibold rounded-xl
                       transform transition-all duration-200
                       hover:scale-[1.02] hover:shadow-lg
                       focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              Submit Review
            </button>
          </form>
        </motion.div>

        {/* Reviews Display */}
        <div className="space-y-10">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
            Recent Reviews
          </h2>
          <div className="grid md:grid-cols-2 gap-10">
            {reviews.map((review, index) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-200
                         transform transition-all duration-200 hover:shadow-xl"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex 
                                items-center justify-center shadow">
                    <FaUser className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {review.reviewerEmail}
                    </h3>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-5 h-5 ${
                            i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="pl-14">
                  <FaQuoteLeft className="w-6 h-6 text-blue-400 mb-2" />
                  <p className="text-gray-700">{review.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;


