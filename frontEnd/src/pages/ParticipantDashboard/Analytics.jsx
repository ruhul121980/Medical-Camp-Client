import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AuthContext } from "../../providers/AuthProvider";

const Analytics = () => {
  const { user } = useContext(AuthContext);
  const [campData, setCampData] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/participantCampsData/${user.email}`)
      .then(response => {
        if (response.data.error) {
          console.error("Error fetching participant's registered camps data:", response.data.error);
        } else {
          console.log("API Response Data:", response.data); // Log the data received from the API
          setCampData(response.data);
        }
      })
      .catch(error => {
        console.error("Error fetching participant's registered camps data:", error);
      });
  }, [user.email]);

  return (
    <div>
      <h1 className="text-center text-purple-600 font-bold text-4xl my-10">
        Participant's Lifetime Registered Camps
      </h1>
      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <BarChart
            data={campData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="campName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="campFees" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
