const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
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






        
        app.post("/addItem", async (req, res) => {
            const newProducts = req.body;
            console.log("newProducts",newProducts);
            const result = await productCollection.insertOne(newProducts);
            res.send(result)
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



app.get("/", (req, res) => {
    res.send(`server is running.....`)
})


app.listen(port, () => {
    console.log(`server is running at: http://localhost:${port} `);
})
