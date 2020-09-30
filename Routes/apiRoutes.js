const {Router} = require("express")
const { testRoute, createOrder,updateOrder, deleteOrder, searchOrder, getOrderList} = require("../controllers/normalController");

const router = Router()

router.get("/",testRoute);

router.post("/order/create",createOrder);

router.patch("/orders/update/:orderId",updateOrder);

router.delete("/orders/delete/:orderId",deleteOrder);
router.get("/orders/search",searchOrder);
router.get("/orders/list",getOrderList);



module.exports = router

