const mongoose = require('mongoose')
require('dotenv').config();
//function to connect 
const dbConnect = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Db connected sucessfully")
    }
    catch(error){
        console.log(error.message);
        process.exit(1);

    }
}

 dbConnect();
