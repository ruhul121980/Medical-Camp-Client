import React, { useContext, useState } from "react";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../providers/AuthProvider";
import { Link } from "react-router-dom";

const fetchCamps = async (email) => {
  const { data } = await axios.get(
    `https://medicamp-eight.vercel.app/registeredCampInfo/${email}`
  );
  return data;
};

const fetchParticipantCount = async (email) => {
  const { data } = await axios.get(`https://medicamp-eight.vercel.app/registeredCampInfo/${email}`);
  return data.length; 
};

const RegisteredCamps = () => {
  const { user, loading } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  
  const itemsPerPage = 10;
  const {
    data: totalCount = 0, // default value to avoid undefined issues
    error: countError,
    isLoading: countLoading,
  } = useQuery({
    queryKey: ["totalCount", user?.email],
    queryFn: () => fetchParticipantCount(user.email),
    enabled: !!user?.email,
  });

  const count = totalCount || 0;
  const numberOfPages = Math.ceil(count / itemsPerPage);
  const pages = Array.from({ length: numberOfPages }, (_, i) => i);

  if (loading) {
    return <div>Loading user information...</div>;
  }

  if (!user || !user.email) {
    return <div>Please log in to view registered camps.</div>;
  }

  const {
    data: camps = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["camps", user.email],
    queryFn: () => fetchCamps(user.email),
    enabled: !!user.email,
  });

  if (isLoading) return <div>Loading camps...</div>;
  if (error) return <div>Error loading camps: {error.message}</div>;

  const handleCancel = (campId) => {
    axios
      .delete(`https://medicamp-eight.vercel.app/cancelRegistration/${campId}`)
      .then((response) => {
        console.log("Item deleted:", response.data);
        // Invalidate the query cache to trigger a refetch
        queryClient.invalidateQueries(["camps", user.email]);
        queryClient.invalidateQueries(["totalCount", user.email]);
      })
      .catch((error) => {
        console.error("There was an error deleting the item!", error);
      });
  };

  const handleFeedbackClick = (camp) => {
    setSelectedCamp(camp);
    setIsFeedbackModalOpen(true);
  };

  const closeModal = () => {
    setIsFeedbackModalOpen(false);
    setSelectedCamp(null);
    setFeedback("");
    setRating(0);
  };

  const handleFeedbackSubmit = () => {
    // Example POST request to submit feedback and rating
    axios
      .post(`https://medicamp-eight.vercel.app/submitFeedback`, {
        campName: selectedCamp.campName,
        feedback,
        rating,
      })
      .then((response) => {
        console.log("Feedback submitted:", response.data);
        closeModal();
        // Optionally refetch the camps to update UI
        queryClient.invalidateQueries(["camps", user.email]);
      })
      .catch((error) => {
        console.error("There was an error submitting feedback!", error);
      });
  };

  // Filter camps based on search term
  const filteredCamps = camps.filter(
    (camp) =>
      camp.campName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camp.date?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camp.healthcareProfessionalName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const paginatedCamps = filteredCamps.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNext = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, numberOfPages - 1));
  };

  return (
    <div>
      <h1 className="text-center text-purple-600 font-bold text-4xl my-10">
        Registered Camps
      </h1>
      {/* Search input */}
      <div className="w-3/4 mx-auto mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      {/* Table */}
      <div className="w-3/4 mx-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Camp Name</th>
              <th className="py-2 px-4 border-b">Camp Fees</th>
              <th className="py-2 px-4 border-b">Participant Name</th>
              <th className="py-2 px-4 border-b">Payment</th>
              <th className="py-2 px-4 border-b">
                Confirmation Status
              </th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCamps.map((camp) => (
              <tr key={camp._id}>
                <td className="py-2 px-4 border-b">{camp.campName}</td>
                <td className="py-2 px-4 border-b">{camp.campFees}</td>
                <td className="py-2 px-4 border-b">{camp.participantName}</td>
                <td className="py-2 px-4 border-b">
                  {camp.paymentStatus === "unpaid" ? (
                    <Link to={`/dashboard/payment/${camp._id}`}>
                      <button className="mr-2 bg-blue-500 text-white px-4 py-2 rounded">
                        Pay
                      </button>
                    </Link>
                  ) : (
                    <button className="mr-2 bg-green-500 text-white px-4 py-2 rounded" disabled>
                      Paid
                    </button>
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  {camp.confirmationStatus}
                </td>
                <td className="py-2 px-4 border-b">
                  <div className="flex">
                    {camp.paymentStatus === "paid" && camp.confirmationStatus === "Confirmed" && (
                      <button 
                        className="mr-2 bg-blue-500 text-white px-4 py-2 rounded" 
                        onClick={() => handleFeedbackClick(camp)}
                      >
                        Feedback
                      </button>
                    )}
                    <button
                      className={`bg-red-500 text-white px-4 py-2 rounded ${camp.paymentStatus === "paid" ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() => handleCancel(camp._id)}
                      disabled={camp.paymentStatus === "paid"}
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center my-4">
          <button
            onClick={handlePrevious}
            className="btn btn-sm mx-2"
            disabled={currentPage === 0}
          >
            Previous
          </button>
          {pages.map((page) => (
            <button
              onClick={() => setCurrentPage(page)}
              className="btn btn-sm mx-2"
              key={page}
              disabled={currentPage === page}
            >
              {page + 1}
            </button>
          ))}
          <button
            onClick={handleNext}
            className="btn btn-sm mx-2"
            disabled={currentPage === numberOfPages - 1}
          >
            Next
          </button>
        </div>
      </div>
      {/* Feedback Modal */}

      {isFeedbackModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg">
            <h2 className="text-xl mb-4">Feedback for {selectedCamp.campName}</h2>
            <textarea
              className="w-full p-2 border
              rounded mb-4"
              rows="4"
              placeholder="Your feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            ></textarea>
            <div className="mb-4">
              <label className="block mb-2">Rating</label>
              <select
                className="w-full p-2 border rounded"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                <option value={0}>Select Rating</option>
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button className="bg-gray-500 text-white px-4 py-2 rounded mr-2" onClick={closeModal}>Cancel</button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleFeedbackSubmit}>Submit</button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default RegisteredCamps;
