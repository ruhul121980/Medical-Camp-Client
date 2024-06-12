import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import Swal from "sweetalert2";
import { AuthContext } from '../../providers/AuthProvider';

const RegistrationModal = ({ camp, isOpen, onRequestClose, participant,profileName }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    age: '',
    phoneNumber: '',
    gender: '',
    emergencyContact: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const participantName = user ? user.displayName : ''; // Check if user exists before accessing its properties
  const participantEmail = user ? user.email : ''; // Check if user exists before accessing its properties

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    const age = formData.age;
    const phoneNumber = formData.phoneNumber;
    const gender = formData.gender;
    const emergencyContact = formData.emergencyContact;
    const campName = camp.name;
    const campFees = camp.fees;
    const campLocation = camp.location;
    const campHealthcareProfessional = camp.healthcareProfessional;
    const paymentStatus = 'unpaid';
    const confirmationStatus = 'pending';
    console.log("now", camp._id)
    const modalValues = { age, phoneNumber, gender, emergencyContact, campName, campFees, campLocation, campHealthcareProfessional, participantName, participantEmail, paymentStatus, confirmationStatus };
    console.log('Form Data:', formData);

    fetch(`https://medicamp-eight.vercel.app/modalData/${camp._id}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(modalValues)
    })
      .then(res => res.json())
      .then(data => {
        // console.log(data);
        if (data.insertedId) {
          Swal.fire({
            icon: 'success',
            title: 'Success...',
            text: 'Added Successfully',
          });
          //   form.reset();
        }
      })

  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} ariaHideApp={false}>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      
        <h2 className="text-2xl font-semibold mb-4">Register for {camp.name}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Camp Name:</label>
            <input
              type="text"
              value={camp.name}
              readOnly
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Camp Fees:</label>
            <input
              type="text"
              value={camp.fees}
              readOnly
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location:</label>
            <input
              type="text"
              value={camp.location}
              readOnly
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Healthcare Professional:</label>
            <input
              type="text"
              value={camp.healthcareProfessional}
              readOnly
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Participant Name:</label>
            <input
              type="text"
              value={profileName} // Use participantName variable
              readOnly
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Participant Email:</label>
            <input
              type="email"
              value={participantEmail} // Use participantEmail variable
              readOnly
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Age:</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number:</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Emergency Contact:</label>
            <input
              type="text"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default RegistrationModal;