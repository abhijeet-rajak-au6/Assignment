const userModel = require("../models/userModel");

module.exports={


    // ==> Register
    async register(req, res) {
		console.log("Register",req.body)
		try {
			const newUser = new userModel({ ...req.body });
			await newUser.save();
			return res.status(200).send({
				msg: "User registered sucessfully",
			});
		} catch (err) {
			return res.status(404).send({ msg: err.message });
		}
    },
    
     // ==> Login
    async login(req, res) {
		console.log("log in");
		console.log(req.body);
		const { password, userEmail } = req.body;
		if (!password || !userEmail)
			return res.status(404).send({ msg: "Pls give email and password" });
		try {
			const user = await userModel.findByEmailAndPassword(userEmail, password);
			console.log("user",user)
			user[0].generateToken();
		 	await user[0].save({ validateBeforeSave: false });
			return res.status(200).send({
				msg: `Welcome ${user[0].userName}`,
				userId: user[0].id,
				userName: user[0].userName,
				userEmail: user[0].userEmail,
				acessToken: user[0].token,
				role:user[0].role
			});
		} catch (err) {
			return res.status(404).send({ msg: err });
		}
    },
    
     // ==> Logout
    async logout(req, res) {
		try {

			const user = await userModel.findById(req.userId);
			if (user) {
				user.token = null;
				user.refreshToken = null;
				await user.save({ validateBeforeSave: false });
				return res.send({msg:"Thank you visit again"});
			} else {
				throw Error("Please Login first");
			}
		} catch (err) {
			return res.send(err.message);
		}
	},

	async home(req,res){

		const userData = await userModel.findById(req.userId).populate({path:"image",match:{privacy:false}})
        console.log("user Data=", userData)
        return res.send({
            userData:userData.image
        })
		
	}

}
