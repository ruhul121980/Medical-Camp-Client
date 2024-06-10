import React, { useContext } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../providers/AuthProvider";

const fetchCamps = async () => {
  const { data } = await axios.get(`http://localhost:5000/getRegisterInfo`);
  return data;
};

const cancelRegistration = async (campId) => {
  await axios.delete(`http://localhost:5000/deleteRegistration/${campId}`);
};

const updateConfirmationStatus = async (campId) => {
  await axios.put(`http://localhost:5000/updateConfirmationStatus/${campId}`);
};

const ManageRegisteredCamps = () => {
  const { user, loading } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { data: camps, error, isLoading } = useQuery({
    queryKey: ["camps"],
    queryFn: fetchCamps,
  });

  const cancelMutation = useMutation({
    mutationFn: cancelRegistration,
    onSuccess: () => {
      queryClient.invalidateQueries(["camps"]);
    },
  });

  const confirmationMutation = useMutation({
    mutationFn: updateConfirmationStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(["camps"]);
    },
  });

  const handleCancel = (campId, paymentStatus, confirmationStatus) => {
    if (window.confirm("Are you sure you want to cancel this registration?")) {
      if (!(paymentStatus === "Paid" && confirmationStatus === "Confirmed")) {
        cancelMutation.mutate(campId);
      }
    }
  };

  const handleConfirmation = (campId) => {
    confirmationMutation.mutate(campId);
  };

  if (loading) return <div>Loading user information...</div>;
  if (!user || !user.email) return <div>Please log in to view registered camps.</div>;
  if (isLoading) return <div>Loading camps...</div>;
  if (error) return <div>Error loading camps: {error.message}</div>;

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
              <th className="py-2 px-4 border-b">Payment Status</th>
              <th className="py-2 px-4 border-b">Confirmation Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {camps.map((camp) => (
              <tr key={camp._id}>
                <td className="py-2 px-4 border-b">{camp.campName}</td>
                <td className="py-2 px-4 border-b">{camp.campFees}</td>
                <td className="py-2 px-4 border-b">{camp.participantName}</td>
                <td className="py-2 px-4 border-b">{camp.paymentStatus}</td>
                <td className="py-2 px-4 border-b">{camp.confirmationStatus}</td>
                <td className="py-2 px-4 border-b">
                  {camp.paymentStatus === "paid" && camp.confirmationStatus === "pending" && (
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded"
                      onClick={() => handleConfirmation(camp._id)}
                    >
                      Confirm
                    </button>
                  )}
                  {!(camp.paymentStatus === "paid" && camp.confirmationStatus === "Confirmed") && (
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => handleCancel(camp._id, camp.paymentStatus, camp.confirmationStatus)}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageRegisteredCamps;
