import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { AuthContext } from '../../providers/AuthProvider';

const fetchProfileData = async (email) => {
  const response = await fetch(`http://localhost:5000/participantInfo/${email}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data;
};

const updateProfileData = async ({ email, profileData }) => {
  const response = await fetch(`http://localhost:5000/updateOrganizerProfile/${email}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok ' + response.statusText);
  }

  const data = await response.json();
  return data;
};

export default function ParticipantProfile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    image: '',
    contactNumber: ''
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['profileData', user.email],
    queryFn: () => fetchProfileData(user.email),
  });

  useEffect(() => {
    if (data) {
      setProfileData(data);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: updateProfileData,
    onSuccess: () => {
      queryClient.invalidateQueries(['profileData', user.email]);
      Swal.fire({
        title: 'Success',
        text: 'Profile updated successfully',
        icon: 'success',
        confirmButtonText: 'Cool',
      });
      setIsEditing(false);
    },
    onError: () => {
      Swal.fire({
        title: 'Error',
        text: 'Failed to update profile',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    },
  });

  const handleUpdateClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ email: user.email, profileData });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto bg-gray-100 p-6">
      <h2 className="text-2xl font-semibold mb-4">Participant Profile</h2>
      {!isEditing ? (
        <div>
          <p><strong>Name:</strong> {profileData.name}</p>
          <p><strong>Contact:</strong> {profileData.contactNumber}</p>
          <div>
            <img src={profileData.photoURL} alt="Profile" className="w-32 h-32 rounded-full" />
          </div>
          <button 
            onClick={handleUpdateClick} 
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
            Update
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="contact" className="block mb-1">Contact</label>
            <input
              type="text"
              id="contact"
              name="contactNumber"
              value={profileData.contactNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block mb-1">Profile Image URL</label>
            <input
              type="text"
              id="image"
              name="photoURL"
              value={profileData.photoURL}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300">
            Save
          </button>
        </form>
      )}
    </div>
  );
}
