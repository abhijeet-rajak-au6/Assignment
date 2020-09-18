const mongoose = require("mongoose")


const testDB=async ()=>{

    const dbcon = await mongoose.connect(process.env.MONGODB_URL.replace("<password>",process.env.MONGODB_PASSWORD),{
        useUnifiedTopology: true,
        useNewUrlParser: true ,
        useCreateIndex: true,
    })
    if(dbcon)
        console.log("Data Base  is connected Sucessfully !!!")

}

testDB()