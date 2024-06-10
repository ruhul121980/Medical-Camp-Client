import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';



import { AuthContext } from '../../../providers/AuthProvider';
import CheckoutForm from './Checkoutform';

// Hard-coded Stripe public key
const stripePromise = loadStripe('pk_test_51PPO2h04OyLT3GzboqRlfYoEY1d5oDym7jV09EgiT6K16tspLkzeRz9Q93QxSMgXQvRADnIQijakKsJFzaber7eQ00y9TWQ5kV');

const fetchCamps = async (id) => {
  const { data } = await axios.get(`http://localhost:5000/getFees/${id}`);
  return data;
};

export default function Payments() {
  const { id } = useParams();
  console.log(id)
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading user information...</div>;
  }

  if (!user || !user.email) {
    return <div>Please log in to make a payment.</div>;
  }

  const { data: camps, error, isLoading } = useQuery({
    queryKey: ["camps", id],
    queryFn: () => fetchCamps(id),
    enabled: !!id,
  });

  if (isLoading) return <div>Loading camp fees...</div>;
  if (error) return <div>Error loading camp fees: {error.message}</div>;

  return (
    <div>
      <h2>Pay First</h2>
      {console.log(camps)}
      <div>
        <Elements stripe={stripePromise}>
          <CheckoutForm key={camps._id} camps={camps}
 />
        </Elements>
      </div>
    </div>
  );
}
