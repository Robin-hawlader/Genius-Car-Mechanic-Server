const express = require('express');
const { MongoClient, Collection } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const query = require('mongodb').ObjectId;
const { ObjectID, ObjectId } = require('bson');

const app = express();
const port = 5000;

// Midleware
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.corkt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('CarMechanic');
        const servicesCollection = database.collection('services');

        // Get api
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        // Get single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.send(service);
        })


        // post api
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the api', service)
            const result = await servicesCollection.insertOne(service);
            console.log(result)
            res.json(result)
        })
        // Delete single api

        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Running on genius car mecanics serve')
})

app.listen(port, () => {
    console.log('Running genius car on port', port)
})