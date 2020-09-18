const express = require("express")
const {verify} = require("jsonwebtoken")

module.exports={

    async authentication(req,res,next){

        try{
            const decodedToken = verify(req.headers.authorization,process.env.PRIVATE_KEY)
            console.log(decodedToken.id)
            console.log("one")
            req.userId = decodedToken.id
            console.log("r")
            next()

        }
        catch(err){
	    console.log(err.message);
            return res.status(404).send({
                msg:"Authentication failed !!!"
            })
        }
    }
}
