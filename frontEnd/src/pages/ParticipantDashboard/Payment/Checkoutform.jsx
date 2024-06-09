import React, { useContext, useEffect, useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import { AuthContext } from '../../../providers/AuthProvider';

const CheckoutForm = ({ campFees }) => {
    const { user } = useContext(AuthContext);
    const [error, setError] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [transactionId,setTransactionId]=useState('')
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
                const response = await fetch('http://localhost:5000/create-payment-intent', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ campFees })
                });
                const data = await response.json();
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
            if(paymentIntent==='succeeded'){
                console.log('transaction id',paymentIntent.id)
                setTransactionId(paymentIntent.id)
            }
            // You can handle successful payment here (e.g., show a success message, save transaction details, etc.)
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement
                options={{
                    style: {
                        base: {
                            fontSize: '16px',
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
            <button className='btn btn-sm btn-primary my-4' type="submit" disabled={!stripe || !clientSecret}>
                Pay
            </button>
            {error && <p className='text-red-600'>{error}</p>}
            {transactionId && <p className='text-green-600'>Your Transaction Id : {transactionId}</p>}
        </form>
    );
};

export default CheckoutForm;
