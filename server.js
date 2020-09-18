const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors");
const paypal = require('paypal-rest-sdk');
dotenv.config()
const apiRoutes = require("./Routes/apiRoutes")
require("./db")
const app = express()
app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use(express.json())
const PORT = process.env.PORT || 1234
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': `${process.env.CLIENT_ID}`,
    'client_secret':`${process.env.CLIENT_SECRET}`
});

// app.get("/",(req,res)=>{
//     return res.send({
//         msg:"Hello World !!!"
//     })
// })

app.use(apiRoutes)

app.listen(PORT,()=>{
    console.log("server is running sucessfully at port "+PORT)
})