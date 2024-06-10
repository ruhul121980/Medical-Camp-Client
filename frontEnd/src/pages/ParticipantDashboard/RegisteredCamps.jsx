import React, { useContext, useState } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../providers/AuthProvider";
import { Link } from "react-router-dom";

const fetchCamps = async (email) => {
  const { data } = await axios.get(
    `http://localhost:5000/registeredCampInfo/${email}`
  );
  return data;
};

const cancelRegistration = async (campId) => {
  await axios.delete(`http://localhost:5000/cancelRegistration/${campId}`);
};

const RegisteredCamps = () => {
  const { user, loading } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState(null);

  if (loading) {
    return <div>Loading user information...</div>;
  }

  if (!user || !user.email) {
    return <div>Please log in to view registered camps.</div>;
  }

  const {
    data: camps,
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
    axios.delete(`http://localhost:5000/cancelRegistration/${campId}`)
    .then(response => {
      console.log('Item deleted:', response.data);
      // Invalidate the query cache to trigger a refetch
      queryClient.invalidateQueries(["camps", user.email]);
    })
    .catch(error => {
      console.error('There was an error deleting the item!', error);
    });
  };

  const handleFeedbackClick = (camp) => {
    setSelectedCamp(camp);
    setIsFeedbackModalOpen(true);
  };

  const closeModal = () => {
    setIsFeedbackModalOpen(false);
    setSelectedCamp(null);
  };

  return (
    <div>
      <h1 className="text-center text-purple-600 font-bold text-4xl my-10">
        Registered Camps
      </h1>
      <div className="w-3/4 mx-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Camp Name</th>
              <th className="py-2 px-4 border-b">Camp Fees</th>
              <th className="py-2 px-4 border-b">Participant Name</th>
              <th className="py-2 px-4 border-b">Payment</th>
              <th className="py-2 px-4 border-b">Payment Confirmation Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {camps.map((camp) => (
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
      </div>
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg">
            <h2 className="text-xl mb-4">Feedback for {selectedCamp.campName}</h2>
            <textarea className="w-full p-2 border rounded mb-4" rows="4" placeholder="Your feedback"></textarea>
            <div className="flex justify-end">
              <button className="bg-gray-500 text-white px-4 py-2 rounded mr-2" onClick={closeModal}>Cancel</button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisteredCamps;
