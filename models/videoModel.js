const {Schema,model} = require("mongoose")

const videoSchema = Schema({

    title:{
        type:String,
    },
    description:{
        type:String
    },
    courseId:{
        type:Schema.Types.ObjectId,
        ref:"course"
    },
    videoLink:[{
        type:String
    }],
})


const videoModel = model("video",videoSchema)

module.exports = videoModel