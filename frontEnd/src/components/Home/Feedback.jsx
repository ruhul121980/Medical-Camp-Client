import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';

const fetchFeedback = async () => {
  const { data } = await axios.get("http://localhost:5000/feedback");
  return data;
};

const renderStars = (rating) => {
  const stars = [];
  for (let i = 0; i < rating; i++) {
    stars.push(<span key={i}>&#9733;</span>);
  }
  return stars;
};

export default function Feedback() {
  const { data: feedback, error, isLoading } = useQuery({
    queryKey: ["feedback"],
    queryFn: fetchFeedback,
  });

  return (
    <div>
      <h1 className="text-center text-purple-600 font-bold text-4xl my-10">
        Feedback and Ratings
      </h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        <div className="w-3/4 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
          {feedback.map((camp) => (
            <div key={camp._id} className="card bg-base-100 shadow-md p-4">
              <div className="card-body bg-slate-100 rounded-lg">
                <h2 className="card-title text-lg font-semibold">{camp.campName}</h2>
                <p className="text-sm">{camp.feedback}</p>
                <p className="text-sm">Rating: {renderStars(camp.rating)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
