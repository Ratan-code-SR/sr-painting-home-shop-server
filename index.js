const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config()
const port = process.env.PORT || 5000;
const app = express()

app.use(cors())
app.use(express.json())


console.log(process.env.USER, process.env.PASSWORD);

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.iez1mla.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // await client.connect();
        const productCollection = client.db("insertDB").collection("product");

        // items get functionality
        app.get("/items", async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })

        // email get 

        app.get("/items/email/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const cursor = productCollection.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })

// id get functionality
        app.get("/items/id/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.findOne(query)
            res.send(result)
        })



// post functionality
        app.post("/addItem", async (req, res) => {
            const newProducts = req.body;
            console.log("newProducts", newProducts);
            const result = await productCollection.insertOne(newProducts);
            res.send(result)
        })

// update functionality
        app.put("/items/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const updateItem = req.body;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updateUserDoc = {
                $set: {
                    image: updateItem.image,
                    item_name: updateItem.item_name,
                    subcategory_Name: updateItem.subcategory_Name,
                    price: updateItem.price,
                    rating: updateItem.rating,
                    time: updateItem.time,
                    short_description: updateItem.short_description,
                    stock_status: updateItem.stock_status,
                    customization: updateItem.customization
                }
            }
            const result = await productCollection.updateOne(filter, updateUserDoc, options)
            res.send(result)
        })

        // delete functionality
        app.delete("/items/:id", async (req, res) => {
            const id = req.params.id;
            console.log("please delete from database", id);
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result)
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send(`server is running.....`)
})


app.listen(port, () => {
    console.log(`server is running at: http://localhost:${port} `);
})
