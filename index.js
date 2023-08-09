const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());


// MONGODB***********************************START





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.shepece.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const volunteerCollection = client.db('volunteerDB').collection('event');


        app.get('/events', async (req, res) => {
            const result = await volunteerCollection.find().toArray();
            res.send(result);
        })

        app.post('/events', async (req, res) => {
            const addevents = req.body;
            const result = await volunteerCollection.insertOne(addevents);
            res.send(result);
        })
        app.get('/events/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await volunteerCollection.findOne(query);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);









// MONGODB***********************************END















app.get('/', (req, res) => {
    res.send('The World Volunteer app is Running');
})

app.listen(port, (req, res) => {
    console.log('the world server is running on port ', port);
})