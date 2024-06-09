import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../../providers/AuthProvider';

export default function Update() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    participantName: '',
    phoneNumber: '',
    age: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      const response = await fetch(`http://localhost:5000/updateParticipant/${user.email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      const data = await response.json();
      console.log(data);
      if (data.modifiedCount > 0) {
        Swal.fire({
          title: 'Success',
          text: 'Data Updated successfully',
          icon: 'success',
          confirmButtonText: 'Cool'
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error updating participant profile:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update data',
        icon: 'error',
        confirmButtonText: 'Try Again'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="container mx-auto bg-gray-100 p-6">
      <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="mb-4">
          <label htmlFor="participantName" className="block mb-1">Participant Name</label>
          <input
            type="text"
            id="participantName"
            name="participantName"
            value={formData.participantName}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block mb-1">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="age" className="block mb-1">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300">
          Update
        </button>
      </form>
    </div>
  );
}
