import React, { useContext, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Link } from 'react-router-dom';
import { AuthContext } from "../../providers/AuthProvider";

const fetchCamps = async (userEmail) => {
  const { data } = await axios.get(`http://localhost:5000/allCamp/${userEmail}`);
  return data;
};

const fetchTotalCount = async (userEmail) => {
  const { data } = await axios.get(`http://localhost:5000/allCamp/${userEmail}`);
  return data.length;
};

const ManageCamps = () => {
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const {
    data: totalCount = 0,
    error: countError,
    isLoading: countLoading,
  } = useQuery({
    queryKey: ["totalCount", user?.email],
    queryFn: () => fetchTotalCount(user.email),
    enabled: !!user?.email,
  });

  const count = totalCount || 0;
  const numberOfPages = Math.ceil(count / itemsPerPage);
  const pages = Array.from({ length: numberOfPages }, (_, i) => i);

  const {
    data: camps = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["camps", user.email],
    queryFn: () => fetchCamps(user.email),
    enabled: !!user?.email,
  });

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0); // Reset to the first page on search
  };

  if (isLoading || countLoading) return <div>Loading...</div>;
  if (error || countError) return <div>Error loading camps: {error?.message || countError?.message}</div>;

  const filteredCamps = camps.filter((camp) => {
    const name = camp.name?.toLowerCase() || "";
    const dateTime = camp.dateTime?.toLowerCase() || "";
    const location = camp.location?.toLowerCase() || "";
    const healthcareProfessional = camp.healthcareProfessional?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return (
      name.includes(search) ||
      dateTime.includes(search) ||
      location.includes(search) ||
      healthcareProfessional.includes(search)
    );
  });

  const paginatedCamps = filteredCamps.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 0 && page < numberOfPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <h1 className="text-center text-purple-600 font-bold text-4xl my-10">Manage Camps</h1>
      <div className="w-2/3 mx-auto">
        <input
          type="text"
          placeholder="Search by Camp Name, Location, or Healthcare Professional"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded"
        />
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Date & Time</th>
              <th className="py-2 px-4 border-b">Location</th>
              <th className="py-2 px-4 border-b">Healthcare Professional</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCamps.map((camp) => (
              <tr key={camp._id}>
                <td className="py-2 px-4 border-b">{camp.name}</td>
                <td className="py-2 px-4 border-b">{camp.dateTime}</td>
                <td className="py-2 px-4 border-b">{camp.location}</td>
                <td className="py-2 px-4 border-b">{camp.healthcareProfessional}</td>
                <td className="py-2 px-4 border-b flex">
                  <Link to={`/editCamp/${camp._id}`}>
                    <button className="btn btn-primary mr-2">Edit</button>
                  </Link>
                  <button className="btn btn-danger" onClick={() => handleDelete(camp._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center my-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="btn btn-sm mx-2"
            disabled={currentPage === 0}
          >
            Previous
          </button>
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`btn btn-sm mx-2 ${currentPage === page ? "bg-blue-500 text-white" : ""}`}
            >
              {page + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
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

const handleDelete = async (campId) => {
  try {
    await axios.delete(`http://localhost:5000/deleteCamp/${campId}`);
    // refetch the camps or update the state to remove the deleted camp
  } catch (error) {
    console.error("Error deleting camp:", error);
  }
};

export default ManageCamps;
