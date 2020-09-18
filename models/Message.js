const {Schema,model} = require("mongoose");

const messageSchema = Schema({
   comments:{
       type:String
   },
   replies:{
       type:String
   } 
});

const messageModel = model("message",messageSchema);

module.exports = messageModel;

