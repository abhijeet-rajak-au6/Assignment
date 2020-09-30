const orderModel = require("../models/orderModel");

module.exports = {
  async testRoute(req, res) {
    return res.send({
      msg: "Sucessfull Hello",
    });
  },
  async createOrder(req, res) {
    try {
      const newOrder = new orderModel({
        ...req.body,
      });
      const savedOrder = await newOrder.save();
      return res.status(200).send({
        msg: "order saved sucessfully",
        status: "success",
        order: savedOrder,
      });
    } catch (err) {
      if (err.message.includes("order_id_1 dup key")) {
        return res.status(403).send({
          status: "fail",
          msg: "duplicate order id is not permitted",
        });
      }
    }
  },
  async updateOrder(req, res) {
    try {
      const { orderId } = req.params;
      // console.log(orderId);
      const updatedOrder = await orderModel.findOneAndUpdate(
        { order_id: orderId },
        {
          ...req.body,
        },
        { new: true }
      );
      if (!updatedOrder) {
        return res.status(401).send({
          msg: "Cannot find the order",
          status: "fail",
        });
      }
      // console.log(updatedOrder);
      const order = await orderModel.findOne({ order_id: orderId });
      return res.status(201).send({
        status: "success",
        msg: "updated sucessfully",
        order,
      });
    } catch (err) {
      return res.status(500).send({
        status: "fail",
        msg: err.message,
      });
    }
  },
  async deleteOrder(req, res) {
    try {
      const { orderId } = req.params;
      // console.log(orderId);
      const order = await orderModel.findOneAndDelete({ order_id: orderId });
      // console.log(order);
      if (order) {
        return res.status(201).send({
          status: "success",
          msg: "deleted sucessfully",
        });
      }
      return res.status(401).send({
        msg: "Cannot find the order please enter correct order id",
        status: "fail",
      });
    } catch (err) {
      return res.status(500).send({
        status: "fail",
        msg: err.message,
      });
    }
  },
  async searchOrder(req, res) {
    try {
      const { order_id } = req.query;
      // console.log(order_id);
      const order = await orderModel.findOne({ order_id: order_id });
      // console.log(order);
      if (order) {
        return res.status(201).send({
          status: "success",
          order,
        });
      }
      return res.status(401).send({
        msg: "Cannot find the order please enter correct order id",
        status: "fail",
      });
    } catch (err) {
      return res.status(500).send({
        status: "fail",
        msg: err.message,
      });
    }
  },
  async getOrderList(req, res) {
    try {
      const { order_date } = req.query;
      // console.log(order_date);
      // orderModel.find({})
      const validateDate = Date.parse(order_date);
      // console.log(validateDate)
      if(isNaN(validateDate)){
        return res.status(401).send({
          status:"fail",
          msg:"Please give date in YYYY/MM/DD format"
        })
      }
      const allorders = await orderModel.find({ order_date: order_date });
      if(allorders.length){

        return res.status(201).send({
          status: "success",
          order:allorders
        });
      }
      return res.status(401).send({
        status:"fail",
        msg:`no order is aviable on ${order_date}`
      })

    } catch (err) {
      return res.status(500).send({
        status: "fail",
        msg: err.message,
      });
    }
  },
};
