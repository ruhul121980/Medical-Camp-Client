import React, { useContext } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../providers/AuthProvider";
import { Link } from "react-router-dom";

const fetchCamps = async (email) => {
  const { data } = await axios.get(`http://localhost:5000/registeredCampInfo/${email}`);
  return data;
};

const RegisteredCamps = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading user information...</div>;
  }

  if (!user || !user.email) {
    return <div>Please log in to view registered camps.</div>;
  }

  const { data: camps, error, isLoading } = useQuery({
    queryKey: ["camps", user.email],
    queryFn: () => fetchCamps(user.email),
    enabled: !!user.email, 
  });

  if (isLoading) return <div>Loading camps...</div>;
  if (error) return <div>Error loading camps: {error.message}</div>;

  return (
    <div>
      <h1 className="text-center text-purple-600 font-bold text-4xl my-10">
        Registered Camps
      </h1>
      <div className="w-3/4 mx-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Camp Name</th>
              <th className="py-2 px-4 border-b">Camp Fees</th>
              <th className="py-2 px-4 border-b">Participant Name</th>
              <th className="py-2 px-4 border-b">Payment</th>
              <th className="py-2 px-4 border-b">Payment Confirmation Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {camps.map((camp) => (
              <tr key={camp._id}>
                <td className="py-2 px-4 border-b">{camp.campName}</td>
                <td className="py-2 px-4 border-b">{camp.campFees}</td>
                <td className="py-2 px-4 border-b">{camp.participantName}</td>
                <td className="py-2 px-4 border-b">
                  <Link to={`/dashboard/payment/${camp._id}`}>
                    <button className="mr-2 bg-blue-500 text-white px-4 py-2 rounded">
                      Pay
                    </button>
                  </Link>
                </td>
                <td className="py-2 px-4 border-b">test</td>
                <td className="py-2 px-4 border-b">
                  <div className="flex">
                    <button className="mr-2 bg-blue-500 text-white px-4 py-2 rounded">
                      Feedback
                    </button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded">
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegisteredCamps;
