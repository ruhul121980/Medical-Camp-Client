import React, { useContext, useState } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../providers/AuthProvider";

const fetchCamps = async () => {
  const { data } = await axios.get(`https://medicamp-eight.vercel.app/getRegisterInfo`);
  return data;
};

const cancelRegistration = async (campId) => {
  await axios.delete(`https://medicamp-eight.vercel.app/deleteRegistration/${campId}`);
};

const updateConfirmationStatus = async (campId) => {
  await axios.put(`https://medicamp-eight.vercel.app/updateConfirmationStatus/${campId}`);
};

const ManageRegisteredCamps = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0); // Reset to the first page on search
  };

  if (authLoading) return <div>Loading user information...</div>;
  if (!user || !user.email) return <div>Please log in to view registered camps.</div>;
  if (isLoading) return <div>Loading camps...</div>;
  if (error) return <div>Error loading camps: {error.message}</div>;

  const filteredCamps = camps.filter((camp) => {
    const campName = camp.campName?.toLowerCase() || "";
    const date = camp.date?.toLowerCase() || "";
    const healthcareProfessionalName = camp.healthcareProfessionalName?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return (
      campName.includes(search) ||
      date.includes(search) ||
      healthcareProfessionalName.includes(search)
    );
  });

  const paginatedCamps = filteredCamps.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  const numberOfPages = Math.ceil(filteredCamps.length / itemsPerPage);

  return (
    <div>
      <h1 className="text-center text-purple-600 font-bold text-4xl my-10">
        Registered Camps
      </h1>
      <div className="w-full lg:w-3/4 mx-auto text-xs lg:text-base">
        <input
          type="text"
          placeholder="Search by Camp Nam px-1elg:"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded"
        />
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-1 lg:px-4 border-b">Camp Name</th>
              <th className="py-2 px-1 lg:px-4 border-b">Camp Fees</th>
              <th className="py-2 px-1 lg:px-4 border-b">Participant Name</th>
              <th className="py-2 px-1 lg:px-4 border-b">Payment Status</th>
              <th className="py-2 px-1 lg:px-4 border-b">Confirmation Status</th>
              <th className="py-2 px-1 lg:px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCamps.map((camp) => (
              <tr key={camp._id} >
                <td className="py-2 px-1 lg:px-4 border-b">{camp.campName}</td>
                <td className="py-2 px-1 lg:px-4 border-b">{camp.campFees}</td>
                <td className="py-2 px-1 lg:px-4 border-b">{camp.participantName}</td>
                <td className="py-2 px-1 lg:px-4 border-b">{camp.paymentStatus}</td>
                <td className="py-2 px-1 lg:px-4 border-b">{camp.confirmationStatus}</td>
                <td className="py-2 px-1 lg:px-4 border-b">
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
        <div className="flex justify-center my-4">
          <button
            onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 0))}
            className="btn btn-sm mx-2"
            disabled={currentPage === 0}
          >
            Previous
          </button>
          {[...Array(numberOfPages).keys()].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`btn btn-sm mx-2 ${currentPage === page ? "bg-blue-500 text-white" : ""}`}
            >
              {page + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, numberOfPages - 1))}
            className="btn btn-sm mx-2"
            disabled={currentPage === numberOfPages - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageRegisteredCamps;
