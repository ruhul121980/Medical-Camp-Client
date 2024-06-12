import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const fetchCamps = async () => {
  const { data } = await axios.get("https://medicamp-eight.vercel.app/addCampData");
  return data;
};

const AvailableCamps = () => {
  const [layout, setLayout] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name"); // Default sort by name

  const {
    data: camps,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["camps"],
    queryFn: fetchCamps,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading camps</div>;

  const filteredCamps = camps ? camps.filter(camp =>
    camp.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const sortedCamps = [...filteredCamps].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "fees") {
      return a.fees - b.fees;
    } else if (sortBy === "registrations") {
      return b.participantCount - a.participantCount;
    }
  });

  const toggleLayout = () => {
    setLayout(layout === "grid" ? "list" : "grid");
  };

  return (
    <div className="p-4">
      <h1 className="text-center text-purple-600 font-bold text-2xl sm:text-3xl lg:text-4xl my-10">Available Camps</h1>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-5">
        <div className="flex flex-col sm:flex-row items-center">
          <input
            type="text"
            placeholder="Search camps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded mb-2 sm:mb-0 sm:mr-3"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="name">Sort by Name</option>
            <option value="fees">Sort by Fees</option>
            <option value="registrations">Sort by Registrations</option>
          </select>
        </div>
        <button onClick={toggleLayout} className="btn btn-secondary mt-3 sm:mt-0">
          {layout === "grid" ? "Switch to List" : "Switch to Grid"}
        </button>
      </div>
      <div className={`${layout === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" : "space-y-5"}`}>
        {sortedCamps.map((camp) => (
          <div key={camp._id} className={`${layout === "grid" ? "card w-full sm:w-80 lg:w-96 glass" : "card glass mx-auto lg:max-w-2xl"}`}>
            <figure className="w-full">
              <img src={camp.image} alt="Camp!" className="w-full h-48 object-cover lg:h-32" />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{camp.name}</h2>
              <p>Fees: ${camp.fees}</p>
              <p>Date & Time: {camp.dateTime}</p>
              <p>Location: {camp.location}</p>
              <p>Healthcare Professional: {camp.healthcareProfessional}</p>
              <p>Description: {camp.description}</p>
              <p>Participant Count: {camp.participantCount}</p>
              <div className="card-actions justify-end">
                <Link to={`/popularDetails/${camp._id}`}>
                  <button className="btn btn-primary">Details</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableCamps;
