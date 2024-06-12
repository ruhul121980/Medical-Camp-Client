import React, { useContext, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../providers/AuthProvider";
import { Link } from "react-router-dom";

const fetchCamps = async (email) => {
  const { data } = await axios.get(`https://medicamp-eight.vercel.app/registeredCampInfo/${email}`);
  return data;
};

const fetchParticipantCount = async (email) => {
  const { data } = await axios.get(`https://medicamp-eight.vercel.app/registeredCampInfo/${email}`);
  return data.length; 
};

const PaymentHistory = () => {
  const { user, loading } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
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
    data: camps = [], // default value to avoid undefined issues
    error,
    isLoading,
  } = useQuery({
    queryKey: ["camps", user.email],
    queryFn: () => fetchCamps(user.email),
    enabled: !!user.email,
  });

  if (isLoading || countLoading) return <div>Loading camps...</div>;
  if (error || countError) return <div>Error loading camps: {error?.message || countError?.message}</div>;

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0); // Reset to the first page on search
  };

  const handlePrevious = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNext = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, numberOfPages - 1));
  };

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

  return (
    <div>
      <h1 className="text-center text-purple-600 font-bold text-4xl my-10">
        Payment History
      </h1>
      <div className="w-3/4 mx-auto text-xs lg:text-base">
        <input
          type="text"
          placeholder="Search by Camp Name"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded"
        />
        {/* <p>Total Camps: {filteredCamps.length}</p> */}
        <table className="w-full lg:min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-1 lg:px-4 border-b">Camp Fees</th>
              <th className="py-2 px-1 lg:px-4 border-b">Camp Name</th>
              <th className="py-2 px-1 lg:px-4 border-b">Payment</th>
              <th className="py-2 px-1 lg:px-4 border-b">Confirmation Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredCamps.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).map((camp) => (
              <tr key={camp._id}>
                <td className="py-2 px-1 lg:px-4 border-b">{camp.campName}</td>
                <td className="py-2 px-1 lg:px-4 border-b">{camp.campFees}</td>
                <td className="py-2 px-1 lg:px-4 border-b">
                  {camp.paymentStatus === "unpaid" ? (
                    <button className="mr-2 bg-blue-500 text-white px-4 py-2 rounded">
                      Unpaid
                    </button>
                  ) : (
                    <button className="mr-2 bg-green-500 text-white px-4 py-2 rounded" disabled>
                      Paid
                    </button>
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  {camp.confirmationStatus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
  );
};

export default PaymentHistory;
