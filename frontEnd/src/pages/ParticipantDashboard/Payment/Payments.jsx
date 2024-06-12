import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { AuthContext } from '../../../providers/AuthProvider';


// Hard-coded Stripe public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);
import CheckoutForm from './Checkoutform';

const fetchCamps = async (id) => {
  const { data } = await axios.get(`https://medicamp-eight.vercel.app/getFees/${id}`);
  return data;
};

export default function Payments() {
  const { id } = useParams();
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading user information...</div>;
  }

  if (!user || !user.email) {
    return <div className="flex justify-center items-center h-screen">Please log in to make a payment.</div>;
  }

  const { data: camps, error, isLoading } = useQuery({
    queryKey: ["camps", id],
    queryFn: () => fetchCamps(id),
    enabled: !!id,
  });

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading camp fees...</div>;
  if (error) return <div className="flex justify-center items-center h-screen">Error loading camp fees: {error.message}</div>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-center text-purple-600 font-bold text-2xl sm:text-3xl md:text-4xl my-10">
        Pay First
      </h1>
      <div className="">
        <Elements stripe={stripePromise}>
          <CheckoutForm key={camps._id} camps={camps} />
        </Elements>
      </div>
    </div>
  );
}
