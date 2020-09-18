const courseModel = require("../models/courseModel");
const userModel = require("../models/userModel");
const convert = require("../converter");
const cloudinary = require("../cloudinary");
const { image } = require("../cloudinary");
const videoModel = require("../models/videoModel");
const purchaseModel = require("../models/PurchasesCourse");
const paypal = require("paypal-rest-sdk");

module.exports = {
  async uploadVideo(req, res) {
    try {
      console.log(req.files);
      console.log(req.body);
      const { title, description, videoUrl } = req.body;
      let videoFile = [];
      let imageContentProfileImage = [];
      req.files.forEach((file) => {
        imageContentProfileImage.push(convert(file.originalname, file.buffer));
      });
      console.log(Object.keys(imageContentProfileImage));
      videoFile = await Promise.all(
        imageContentProfileImage.map(async (videoUrl) => {
          return await cloudinary.uploader.upload(videoUrl, {
            resource_type: "video",
          });
        })
      );
      console.log("videoFile", videoFile);

      let videoPostFile = await Promise.all(
        videoFile.map((job) => {
          return job.secure_url;
        })
      );
      console.log(videoPostFile);
      const user = await videoModel.find({ courseId: req.params.courseId });
      console.log("hi");
      const newVideo = new videoModel({
        title,
        description,
        courseId: req.params.courseId,
        videoLink: videoPostFile,
      });

      const videoPost = await newVideo.save();
      return res.status(200).send({
        msg: "Your video has been posted successfully !!!",
        videoPost,
      });
    } catch (err) {
      return res.status(400).send({
        msg: err.message,
      });
    }
  },

  async createCourse(req, res) {
    console.log(req.userId);
    try {
      const course = new courseModel({
        ...req.body,
        userId: req.userId,
      });
      const courseCreated = await course.save();

      return res.status(200).send({
        msg: "Course created sucessfully ",
        courseCreated,
      });
    } catch (err) {
      return res.status(500).send({
        msg: err.message,
        status: "fail",
      });
    }
  },
  async getAllCourse(req, res) {
    try {
      const courses = await courseModel.find({ userId: req.userId });
      console.log(courses);
      return res.status(200).send({
        courses: courses,
      });
    } catch (err) {
      return res.status(500).send({
        msg: err.message,
        status: "fail",
      });
    }
  },

  async getUserImage(req, res) {
    const userData = await userModel
      .findById(req.userId)
      .populate({ path: "image", match: { privacy: false } });
    console.log("user Data=", userData);
    return res.send({
      userData: userData.image,
    });
  },
  async getAllCourseById(req, res) {
    try {
      const video = await videoModel.find({ courseId: req.params.courseId });
      return res.status(200).send({
        video,
      });
    } catch (err) {
      return res.status(500).send({
        msg: err.message,
        status: "fail",
      });
    }
  },
  async getAllCoursesToUser(req, res) {
    try {
      const courses = await courseModel.find({});
      return res.status(200).send({
        courses,
      });
    } catch (err) {
      return res.status(500).send({
        msg: err.message,
        status: "fail",
      });
    }
  },
  async purchaseCourse(req, res) {
    try {
    } catch (err) {}
  },

  async sortByCategory(req, res) {
    const { sortBy } = req.query;
    try {
      const course = await courseModel.find({ category: sortBy });
      console.log(course);
      return res.status(200).send({
        course,
      });
    } catch (err) {
      return res.status(500).send({
        msg: err.message,
        status: "fail",
      });
    }
  },

  async payment(req, res) {
    const { courseId } = req.query;
    console.log(courseId);
    const course = await courseModel.findById(courseId);
    console.log("course", course);

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `http://localhost:3000/paymentDone/${courseId}`,
        cancel_url: "http://localhost:3000/paymentDone",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: `${course.courseName}`,
                sku: "001",
                price: `${course.price}`,
                currency: "INR",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "INR",
            total: `${course.price}`,
          },
          description: "Hat for the best team ever",
        },
      ],
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            res.json({ forwardLink: payment.links[i].href });
          }
        }
      }
    });
  },
  async success(req, res) {
    var paymentId = req.query.paymentId;
    var payerId = { payer_id: req.query.PayerID };
    const { courseId } = req.params;

    const course = await courseModel.findById(courseId);
    console.log(course._id);
    console.log(req.params.userId);

    const purchase = new purchaseModel({
      courseId:course._id,
      userId:req.params.userId
    });
    course.revenueChecking++;

    await course.save();

    console.log(await purchase.save());


    paypal.payment.execute(paymentId, payerId, function (error, payment) {
      if (error) {
        console.error(JSON.stringify(error));
      } else {
        if (payment.state == "approved") {
          console.log("payment completed successfully");
        } else {
          console.log("payment not successful");
        }
      }
    });
  },
  async cancel(req, res) {
    return res.send("Cancelled");
  },

  async purchasedItem(req,res){
    try{
      const purchasedItem = await purchaseModel.find({userId:req.userId});
      console.log(purchasedItem);
      return res.status(200).send({
        purchasedItem
      })

    }catch(err){
      return res.status(500).send({
        msg: err.message,
        status: "fail",
      });
    }
  }
};
