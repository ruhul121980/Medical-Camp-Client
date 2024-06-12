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

  const filteredCamps = camps.filter(camp =>
    camp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading camps</div>;

  return (
    <div>
      <h1 className="text-center text-purple-600 font-bold text-4xl my-10">Available Camps</h1>
      <div className="flex justify-between items-center mb-5">
        <div>
          <input
            type="text"
            placeholder="Search camps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="ml-3 p-2 border border-gray-300 rounded"
          >
            <option value="name">Sort by Name</option>
            <option value="fees">Sort by Fees</option>
            <option value="registrations">Sort by Registrations</option>
          </select>
        </div>
        <button onClick={toggleLayout} className="btn btn-secondary">
          {layout === "grid" ? "Switch to List" : "Switch to Grid"}
        </button>
      </div>
      <div className={`${layout === "grid" ? "grid grid-cols-3 gap-5" : "grid grid-cols-2 gap-5"}`}>
        {sortedCamps.map((camp) => (
          <div key={camp._id} className={`${layout === "grid" ? "card w-96 glass" : "card glass"}`}>
            <figure>
              <img src={camp.image} alt="Camp!" />
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
