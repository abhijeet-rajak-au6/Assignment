const {Schema,model} = require("mongoose");

const courseSchema = Schema({

    userId:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    courseName:{
        type:String,
        required:[true,'Please provide course name'],

    },
    courseDescription:{
        type:String,
        required:[true,'Please provide course description'],
    },
    price:{
        type:Number,
        required:[true,'Please provide course price'],
    },
    createdBy:{
        type:String
    },
    category:{
        type:String
    },
    couponCode:{
        type:String
    },
    couponCodeExp:{
        type:Date
    },
    revenueChecking:{
        type:Number,
        default:0
    },
});

const courseModel = model("course",courseSchema);

module.exports = courseModel;

