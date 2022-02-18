require("dotenv").config();
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const app = express();
const PORT = process.env.PORT || 3001;
const path = require("path");

app.use(cors({ origin: true }));
app.use(express.json());

app.post("/payments/create", async (req, res) => {
    const total = req.query.total;
    console.log(total);

    if(total > 0){
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "inr",
        payment_method_types: ['card'],
      });
  
      res.status(201).send({
        clientSecret: paymentIntent.client_secret
      });
    }else{
      console.log("total cannot be zero");
    }
});

app.use(express.static("amazon-clone/build"));
//targetting our "index.html" inside build
app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname, "amazon-clone", "build", "index.html"))
);


app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}...`);
});