import React, { useContext, useEffect, useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import { AuthContext } from '../../../providers/AuthProvider';

const CheckoutForm = ({ camps }) => {
    const campFees = camps.campFees;
    const id = camps._id;
    console.log('camps now', camps);
    const { user } = useContext(AuthContext);
    const [error, setError] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        if (typeof campFees !== 'number' || campFees <= 0 || campFees > 999999.99) {
            console.error('Invalid camp fees amount:', campFees);
            setError('Invalid camp fees amount');
            return;
        }

        const createPaymentIntent = async () => {
            try {
                const response = await fetch('https://medicamp-eight.vercel.app/create-payment-intent', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ campFees })
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to create payment intent');
                }
                setClientSecret(data.clientSecret);
            } catch (error) {
                console.error('Error creating payment intent:', error);
                setError('Error creating payment intent');
            }
        };

        createPaymentIntent();
    }, [campFees]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const card = elements.getElement(CardElement);

        if (card === null) {
            return;
        }

        const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (paymentMethodError) {
            console.log('Payment error', paymentMethodError);
            setError(paymentMethodError.message);
        } else {
            console.log('Payment method', paymentMethod);
            setError('');
        }

        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    email: user?.email || 'anonymous',
                    name: user?.displayName || 'anonymous'
                }
            }
        });

        if (confirmError) {
            console.log('Confirm Error', confirmError);
            setError(confirmError.message);
        } else {
            console.log('Payment intent', paymentIntent);
            if (paymentIntent.status === 'succeeded') {
                console.log('transaction id', paymentIntent.id);
                setTransactionId(paymentIntent.id);

                const payment = {
                    email: user.email,
                    campFees: campFees,
                    transactionId: paymentIntent.id,
                    date: new Date(),
                    status: 'paid',
                    id: id
                };
                try {
                    const res = await axios.post('https://medicamp-eight.vercel.app/paymentHistory', payment);
                    console.log('payment saved', res);
                } catch (err) {
                    console.error('Error saving payment:', err);
                    setError('Error saving payment');
                }
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4">
            <div className="mb-4">
                <CardElement
                    className="p-2 border border-gray-300 rounded"
                    options={{
                        style: {
                            base: {
                                fontSize: '18px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
            </div>
            <div className="flex flex-col sm:flex-row sm:space-x-4">
                <button 
                    className='btn btn-sm btn-primary my-2 sm:my-0 sm:mr-2' 
                    type="submit" 
                    disabled={!stripe || !clientSecret}
                >
                    Pay
                </button>
            </div>
            {error && <p className='text-red-600'>{error}</p>}
            {transactionId && <p className='text-green-600'>Your Transaction Id : {transactionId}</p>}
        </form>
    );
};

export default CheckoutForm;
