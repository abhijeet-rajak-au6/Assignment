const {Router} = require("express")
const {login,logout,register,home} = require("../controllers/userControllers")
const { authentication } = require("../middleware/Authentication")
const { uploadVideo, getUserImage,createCourse,getAllCourse,getAllCourseById,getAllCoursesToUser,sortByCategory,payment,success,cancel,purchasedItem} = require("../controllers/normalController")
const upload = require("../multer")


const router = Router()

router.post("/register",register)
router.post("/login",login)
router.delete("/logout",authentication,logout)
router.post("/checkAuthenticaion",authentication)

router.get("/homePage",authentication,home)
router.post("/uploadVideo/:courseId",upload.array("videoUrl"),uploadVideo)
router.get("/getUserData",authentication,getUserImage);
router.post("/createCourse",authentication,createCourse);
router.get("/getAllCourse",authentication,getAllCourse);
router.get("/getCourseContent/:courseId",authentication,getAllCourseById);
router.get("/getAllCoursesToUser",getAllCoursesToUser);
router.get("/sortByCategory",sortByCategory);
router.post("/purchase",authentication,payment);
router.get("/success/:courseId/:userId",success);
router.get("/dashboard",cancel);
router.get("/purchasedItem",authentication,purchasedItem)


module.exports = router

