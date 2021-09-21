const mongodb = require("mongodb");
const dotenv = require('dotenv');
dotenv.config();
const mongoClient = mongodb.MongoClient;
const MONGO_URL = process.env.MONGO_URL;

const Groupdata = async (req, res) => {
    try {
        //Create connection
        let client = await mongoClient.connect(MONGO_URL);
        //Select db
        let db = client.db("Urlshortener");
        //Get all urls for a user { userID: mongodb.ObjectId(req.body.userid) }
        let urls = await db.collection('Url').aggregate([
            { $match: { userID: mongodb.ObjectId(req.body.userid) } },
            {
                $group: {
                    _id: {
                        month: { $month: "$date" },
                        day: { $dayOfMonth: "$date" },
                        year: { $year: "$date" }
                    },

                    count: { $sum: 1 }
                }
            }
        ]).toArray();
        console.log(urls);
        //Close the commection
        await client.close();
        // console.log(urls)
        res.send(urls);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong"
        })
    }
}

module.exports = Groupdata;