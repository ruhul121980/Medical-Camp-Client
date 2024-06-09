import React, { useContext, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Link } from 'react-router-dom';
import { AuthContext } from "../../providers/AuthProvider";


const fetchCamps = async (userEmail) => {
  const { data } = await axios.get(`http://localhost:5000/allCamp/${userEmail}`);
  return data;
};

const ManageCamps = () => {
  const { user } = useContext(AuthContext);

  const { data: camps, error, isLoading } = useQuery({
    queryKey: ["camps", user.email],
    queryFn: () => fetchCamps(user.email),
  });


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading camps</div>;

  return (
    <div>
      <h1 className="text-center text-purple-600 font-bold text-4xl my-10">
        Manage Camps
      </h1>

      <div className="w-2/3 mx-auto">
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
            {camps.map((camp) => (
              <tr key={camp._id}>
                <td className="py-2 px-4 border-b">{camp.name}</td>
                <td className="py-2 px-4 border-b">{camp.dateTime}</td>
                <td className="py-2 px-4 border-b">{camp.location}</td>
                <td className="py-2 px-4 border-b">{camp.healthcareProfessional}</td>
                <td className="py-2 px-4 border-b">
                <Link to={`/editCamp/${camp._id}`}>
                <button className="btn btn-primary mr-2">Edit</button>
              </Link>
                  {/* <Link to={`/editCamp/${camp._id}`}>
                    <button className="btn btn-primary mr-2">Edit</button>
                  </Link> */}
                  <button className="btn btn-danger" onClick={() => handleDelete(camp._id)}>Delete</button>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
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
