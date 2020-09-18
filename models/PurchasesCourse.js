const {Schema,model} = require("mongoose");

const purchaseSchema = Schema({

    userId:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    courseId:{
        type:Schema.Types.ObjectId,
        ref:"course"
    }
});

const purchaseModel = model("purchase",purchaseSchema);

module.exports = purchaseModel;

