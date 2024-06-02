import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from 'react-router-dom';

const fetchCampDetails = async (id) => {
  const { data } = await axios.get(`http://localhost:5000/addCampData/${id}`);
  return data;
};

const DetailsPopularCamp = () => {
  const { id } = useParams(); 

  const { data: camp, error, isLoading } = useQuery({
    queryKey: ["campDetails", id],
    queryFn: () => fetchCampDetails(id),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading camp details</div>;

  return (
    <div>
      <h1 className="text-center text-purple-600 font-bold text-4xl my-10">
        Camp Details
      </h1>
      <div className="w-2/3 mx-auto">
        <div className="card w-96 glass">
          <figure>
            <img src={camp.image} alt={camp.name} />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{camp.name}</h2>
            <p><span className="font-bold">Fees:</span> ${camp.fees}</p>
            <p><span className="font-bold">Date & Time: </span>{camp.dateTime}</p>
            <p><span className="font-bold">Location:</span> {camp.location}</p>
            <p><span className="font-bold">Healthcare Professional:</span> {camp.healthcareProfessional}</p>
            <p><span className="font-bold">Description:</span> {camp.description}</p>
            <p><span className="font-bold">Participant Count:</span> {camp.participantCount}</p>
            <button className="btn btn-primary">Join Camp</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPopularCamp;
