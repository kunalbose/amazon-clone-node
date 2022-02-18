import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CheckoutProduct from './CheckoutProduct';
import './Payment.css';
import { useStateValue } from "./StateProvider";
import {CardElement, useStripe, useElements} from "@stripe/react-stripe-js";
import CurrencyFormat from 'react-currency-format';
import { getBasketTotal } from './reducer';
import axios from 'axios';
import { db } from './firebase';


function Payment(){
    const navigate = useNavigate();
    const [{basket, user}, dispatch] = useStateValue();
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState("");
    const [clientSecret, setClientSecret] = useState(true);

    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        // Generate the special stripe secret
        const getClientSecret = async () =>{
            try{
                const response = await axios.post(`/payments/create?total=${getBasketTotal(basket)*100}`);
                setClientSecret(response.data.clientSecret);
            }catch(err){
                console.log(err);
            }
        }
        getClientSecret();
    }, [basket]);

    const handleSubmit = async (event) =>{
        // do all stripe setup here
        event.preventDefault();
        setProcessing(true);//when the button is clicked we will disable it so it cannot be clicked while processing
        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        }).then(({ paymentIntent })=>{
            // paymentIntent = payment has been confirmed
            db
                .collection('users')
                .doc(user?.uid)
                .collection('orders')
                .doc(paymentIntent.id)
                .set({
                    basket: basket,
                    amount: paymentIntent.amount,
                    created: paymentIntent.created
                })
                
            setSucceeded(true);
            setError(null);
            setProcessing(false);

            dispatch({
                type: 'EMPTY_BASKET'
            });

            navigate("/orders", { replace: true });

        }).catch((err) => {
            console.log(err);
        })
    }

    const handleChange = (event) => {
        // listen for changes in the card element and 
        // display any error as the customer types in their details
        setDisabled(event.empty);
        setError(event.error? event.error.message : "");
    }

    return (
        <div className='payment'>
            <div className='payment__container'>
                
                <h1>Checkout (<Link to="/checkout">{basket?.length} items</Link>)</h1>

                <div className='payment__section'>
                    <div className='payment__title'>
                        <h3>Delivery Address</h3>
                    </div>
                    <div className='payment__address'>
                        <p>{user?.email}</p>
                        <p>123 React Lane</p>
                        <p>Rourkela, Odisha</p>
                    </div>
                </div>

                <div className='payment__section'>
                    <div className='payment__title'>
                        <h3>Review items and delivery</h3>
                    </div>
                    <div className='payment__items'>
                        {basket.map(item =>(
                            <CheckoutProduct
                                id={item.id}
                                title={item.title}
                                image={item.image}
                                price={item.price}
                                rating={item.rating}
                            />
                        ))}
                    </div>

                </div>

                <div className='payment__section'>
                    <div className='payment__title'>
                        <h3>Payment Method</h3>
                    </div>
                    <div className='payment__details'>
                        <form onSubmit={handleSubmit}>
                            <CardElement onChange={handleChange}/>
                            <div className='payment__priceContainer'>
                                <CurrencyFormat 
                                    renderText={(value)=>(
                                        <h3>Order Total: {value}</h3>
                                    )}
                                    decimalScale={2}
                                    value={getBasketTotal(basket)}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={"$"}
                                />
                                <button disabled={processing || disabled || succeeded}>
                                    <span>{processing?<p>Processing</p>:"Buy Now"}</span>
                                </button>
                            </div>
                            {error && <div>{error}</div>}
                        </form>
                        {/* Stripe set up will be done here */}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Payment;