import React from 'react';
import { Star, MessageSquare } from 'lucide-react';

const ReviewButtons = ({ 
  entity, 
  onAddReview, 
  onShowReviews, 
  userToken 
}) => {
  return (
    <div className="flex gap-3">
      {userToken && (
        <button
          onClick={() => onAddReview(entity)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg 
                   hover:bg-green-700 flex items-center gap-2"
        >
          <Star className="w-5 h-5" />
          Add Review
        </button>
      )}
      <button
        onClick={() => onShowReviews(entity)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg 
                 hover:bg-blue-700 flex items-center gap-2"
      >
        <MessageSquare className="w-5 h-5" />
        Show Reviews
      </button>
    </div>
  );
};

export default ReviewButtons;