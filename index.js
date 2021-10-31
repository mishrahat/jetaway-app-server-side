const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.31jti.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('jetAway');
        const packagesCollcetion = database.collection('packages');
        const ordersCollection = database.collection('orders');

        //GET API

        app.get('/packages', async (req, res) => {
            const cursor = packagesCollcetion.find({});
            const result = await cursor.toArray();
            res.json(result);
        })

        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const package = await packagesCollcetion.findOne(query);
            res.send(package);
        })


        //POST API

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);
        });

        app.post('/packages', async (req, res) => {
            const package = req.body;
            const result = await packagesCollcetion.insertOne(package);
            res.json(result);
        })

        //DELETE API
        app.delete('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const order = await ordersCollection.deleteOne(query);
            res.json(order);
        });





    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Running Jetaway');
});

app.listen(port, () => {
    console.log('Listening to port', port);
})