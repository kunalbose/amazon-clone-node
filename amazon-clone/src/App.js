import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './Header';
import Home from './Home';
import Checkout from './Checkout';
import Payment from './Payment';
import Orders from './Orders';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './Login';
import { auth } from './firebase';
import { useStateValue } from './StateProvider';
import axios from 'axios';
import {loadStripe} from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const promise = loadStripe("pk_test_51KTeeTSAtdzUQJBF4qTeHHQX6KWQaiMH1aLJQVtSFCYPCTrTlN9ZCJf423JxhjYsmKgbnwFpXWamxCFOIsjimF1N006zTvc2C8");



function App() {
  // const [data, setData] = useState(null);

  const [{}, dispatch] = useStateValue();
  useEffect(() => {
    // will only run once when the app component loads...

    auth.onAuthStateChanged((authUser) => {
      // console.log("THE USER IS >>> ", authUser);

      if (authUser) {
        // the user just logged in / the user was logged in

        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        // the user is logged out
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
  }, []);

  // useEffect(async () => {
  //   try{
  //     const res = await axios.get("/api");
  //     console.log(res);
  //     setData(res.data);

  //   }catch(err){
  //     console.log(err);
  //   }
  // }, []);

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/payment" element={
            <div>
              <Header />
              <Elements stripe={promise}>
                <Payment />
              </Elements>
            </div>
          }/>

          <Route path="/orders" element={
            <div>
              <Header />
              <Orders />
            </div>
          } />

          <Route path="/login" element={<Login />} />

          <Route path="/checkout" element={
            <div>
              <Header />
              <Checkout />
            </div>
          }/>

          <Route path="/" element={
            <div>
              <Header />
              <Home />
              {/* {!data ? <span>loading...</span> : data.message} */}
            </div>
          }/>
          
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;
