// {/* <button
// onClick={() => setShowReviewModal(true)}
// className="px-6 py-3 bg-green-600 text-white rounded-xl 
//          hover:bg-green-700 transition-all shadow-sm 
//          hover:shadow-md font-medium flex items-center 
//          justify-center gap-2"
// >
// <Star className="w-5 h-5" />
// Add Review
// </button>
// <button
// onClick={fetchHospitalReviews}
// className="px-6 py-3 bg-blue-600 text-white rounded-xl 
//          hover:bg-blue-700 transition-all shadow-sm 
//          hover:shadow-md font-medium flex items-center 
//          justify-center gap-2"
// >
// <MessageSquare className="w-5 h-5" />
// Show Reviews
// </button>

// {/* Review Modal */}
// {showReviewModal && (
// <div className="fixed inset-0 bg-black bg-opacity-50 z-50 
// flex items-center justify-center">
// <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
// <h2 className="text-2xl font-bold mb-4">Write a Review</h2>
// <div className="space-y-4">
// <div>
// <label className="block mb-2">Rating</label>
// <div className="flex gap-2">
// {[1, 2, 3, 4, 5].map((star) => (
// <button
// key={star}
// onClick={() => setRating(star)}
// className={`text-2xl ${
// rating >= star ? 'text-yellow-400' : 'text-gray-300'
// }`}
// >
// ★
// </button>
// ))}
// </div>
// </div>
// <div>
// <label className="block mb-2">Review</label>
// <textarea
// value={reviewText}
// onChange={(e) => setReviewText(e.target.value)}
// className="w-full p-2 border rounded-lg"
// rows="4"
// placeholder="Write your review here..."
// />
// </div>
// <div className="flex gap-4">
// <button
// onClick={() => {
// setShowReviewModal(false);
// setRating(0);
// setReviewText('');
// }}
// className="flex-1 py-2 bg-gray-100 rounded-lg"
// >
// Cancel
// </button>
// <button
// onClick={handleReviewSubmit}
// disabled={!rating || !reviewText}
// className="flex-1 py-2 bg-blue-600 text-white rounded-lg 
//  disabled:bg-gray-300"
// >
// Submit Review
// </button>
// </div>
// </div>
// </div>
// </div>
// )}

// {/* Reviews Display Modal */}
// {showReviews && (
// <div className="fixed inset-0 bg-black bg-opacity-50 z-50 
// flex items-center justify-center">
// <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
// <div className="flex justify-between items-center mb-4">
// <h2 className="text-2xl font-bold">Hospital Reviews</h2>
// <button
// onClick={() => setShowReviews(false)}
// className="text-gray-500 hover:text-gray-700"
// >
// ✕
// </button>
// </div>
// <div className="space-y-4">
// {hospitalReviews.map((review) => (
// <div key={review._id} className="bg-gray-50 p-4 rounded-lg">
// <div className="flex items-center justify-between mb-2">
// <div className="text-yellow-400">
// {'★'.repeat(review.rating)}
// {'☆'.repeat(5 - review.rating)}
// </div>
// <div className="text-sm text-gray-500">
// {new Date(review.createdAt).toLocaleDateString()}
// </div>
// </div>
// <p className="text-gray-700">{review.text}</p>
// <p className="text-sm text-gray-500 mt-2">
// By: {review.reviewerEmail}
// </p>
// </div>
// ))}
// {hospitalReviews.length === 0 && (
// <p className="text-center text-gray-500">No reviews yet</p>
// )}
// </div>
// {/* <ToastContainer /> */}
// </div>
// </div>
// )}
// </div>
// const fetchHospitalReviews = async (hospital) => {
// try {
// setSelectedHospital(hospital);
// const response = await axios.get(
// `http://localhost:8000/api/v1/reviews/hospital/${hospital.email}`
// );
// setHospitalReviews(response.data.data);
// console.log(response.data.data);
// setShowReviews(true);
// } catch (error) {
// toast.error("Failed to fetch reviews");
// }
// };
// const handleReviewSubmit = async () => {
// const userData = JSON.parse(localStorage.getItem("userData"));

// if (!userData) {
// toast.error("Please login to submit review");
// return;
// }

// try {
// const reviewData = {
// reviewerEmail: userData.email,
// userType: "User",
// entityType: "Hospital",
// entityEmail: selectedHospital.email,
// rating,
// text: reviewText,
// };

// const response = await axios.post(  
// "http://localhost:8000/api/v1/reviews/create",
// reviewData
// );


// if (response.data.success) {
// toast.success("Review submitted successfully!");
// setShowReviewModal(false);
// setRating(0);
// setReviewText("");
// }
// } catch (error) {
// toast.error(error.response?.data?.message || "Failed to submit review");
// }
// };
//  */}
