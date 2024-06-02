import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchCamps = async () => {
  const { data } = await axios.get("http://localhost:5000/addCampData");
  return data;
};

const AvailableCamps = () => {
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

  return (
    <div className="w-2/3 mx-auto  grid grid-cols-2 gap-5">
      <h1>Available Camps</h1>
      {camps.map((camp) => (
        <div key={camp._id}>
          <div className="card w-96 glass">
            <figure>
              <img src="camp.image" alt="Camp!" />
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
                <button className="btn btn-primary">Learn now!</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AvailableCamps;
