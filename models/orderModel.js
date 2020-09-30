const {Schema,model} = require("mongoose")

const orderSchema = Schema({

    order_id:{
        type:String,
        unique:true,
    },
    item_name:{
        type:String,
    },
    order_date:{
        type:Date,
    },
    delivery_date:{
        type:Date
    }
})




const orderModel = model("order",orderSchema);
module.exports = orderModel;
