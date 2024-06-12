import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from 'react-router-dom';
import RegistrationModal from './RegistrationModal'; // import the modal component
import { AuthContext } from "../../providers/AuthProvider";

const fetchCampDetails = async (id) => {
  const { data } = await axios.get(`https://medicamp-eight.vercel.app/addCampData/${id}`);
  return data;
};

const fetchProfileData = async (email) => {
  const response = await fetch(`https://medicamp-eight.vercel.app/participantInfo/${email}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data;
};

const DetailsPopularCamp = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const { data: camp, error, isLoading } = useQuery({
    queryKey: ["campDetails", id],
    queryFn: () => fetchCampDetails(id),
  });

  const participant = {
    name: "John Doe",
    email: "john.doe@example.com"
  };

  const [profileData, setProfileData] = useState({
    name: '',
    image: '',
    contactNumber: ''
  });

  const { data } = useQuery({
    queryKey: ['profileData', user?.email], // Add conditional access to user.email
    queryFn: () => fetchProfileData(user?.email), // Add conditional access to user.email
  });

  useEffect(() => {
    if (data) {
      setProfileData(data);
    }
  }, [data]);


  const [modalIsOpen, setModalIsOpen] = useState(false);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading camp details</div>;

  return (
    <div>
      {console.log("now",profileData.name)}
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
            <button className="btn btn-primary" onClick={() => setModalIsOpen(true)}>
              Join Camp
            </button>
          </div>
        </div>
      </div>

      <RegistrationModal
        camp={camp}
        isOpen={modalIsOpen}
        profileName={profileData.name}
        onRequestClose={() => setModalIsOpen(false)}
        participant={participant}
      />
    </div>
  );
};

export default DetailsPopularCamp;
