const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js')

const MONGO_URL = "mongodb+srv://omhinge3_db_user:89Hingeom17@mymongodb.pktk96e.mongodb.net/wanderlust?appName=MyMongoDB"

main()
    .then((res) => {
        console.log("connected to DB")
    })
    .catch((err)=> {
        console.log(err);
    })
async function main() {
    await mongoose.connect(MONGO_URL)
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj , owner:"6ad8c2584fdd1187ed75e9be"}))
    await Listing.insertMany(initData.data);
    console.log("data was initialized..")
};

initDB();