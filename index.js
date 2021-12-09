const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 8000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ejor6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("jerinParlourDB");
    const servicesCollection = database.collection("servicesData");
    const bookingCollection = database.collection("bookingData");
    const reviewsCollection = database.collection("reviews");

    // get all services
    app.get("/api/all-services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // get single service
    app.get("/api/service", async (req, res) => {
      const id = req.query.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.findOne(query);
      res.send(result);
    });

    //get user indiviual book
    app.get("/api/service/booking", async (req, res) => {
      const email = req.query.email;
      const cursor = bookingCollection.find({ user_email: email });
      const result = await cursor.toArray();
      res.send(result);
    });

    //get user reviews data
    app.get("/api/user/reviews", async (req, res) => {
      const cursor = reviewsCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    //get all user book
    app.get("/api/allbooks", async (req, res) => {
      const cursor = bookingCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    //insert user book service
    app.post("/api/insert/book", async (req, res) => {
      const book = req.body;
      const result = await bookingCollection.insertOne(book);
      res.json(result);
    });

    //insert user or customer feedback
    app.post("/api/insert/review", async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      res.json(result);
    });

    //insert single service form admin panel or dashboard
    app.post("/api/insert/service", async (req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service);
      res.json(result);
    });

    //delete single service
    app.delete("/api/delete/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    });

    //find single service api
    app.get("/api/find/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.findOne(query);
      res.send(result);
    });

    //updated service data
    app.put("/api/udpate/service/:id", async (req, res) => {
      const id = req.params.id;
      const updateService = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const { service_name, description, price, icon } = updateService;
      const updateDoc = {
        $set: {
          service_name: service_name,
          description: description,
          price: price,
          icon: icon,
        },
      };
      const result = await servicesCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("JERINs PARLOUR SERVING IS RUNNING");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
