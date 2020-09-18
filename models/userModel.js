const {Schema,model} = require("mongoose")
const {sign} = require("jsonwebtoken")
const {hash,compare} = require("bcryptjs")

const userSchema = Schema({

    token:{
        type:String,
        default:null
    },
    userName:{
        type:String,
        trim:true,
        required:[true,"Please provide your name"]
    },
    userEmail:{
        type:String,
        trim:true,
        lowercase:true,
        unique:true,
        required:[true,"Please provide your email"],
        validate:{
            validator:function(email){
                return /^[A-Za-z._{0-9}*]{3,}@[A-Za-z]{3,}[.]{1}[A-Za-z.]{2,6}$/.test(
					email,
				);
            },
            message:"Please provide a valid email"
        }

    },
    password:{
        type:String,
        required:[true,"Please provide your password"]
    },
    role:{
        type:String,
        default:null
    }
})

userSchema.methods.generateToken = async function(){
    this.token = sign ({id:this._id},process.env.PRIVATE_KEY,{
        expiresIn:60*30
    })
}

userSchema.statics.findByEmailAndPassword = async function(email, password) {
	let userObj = null;
	try {
		return new Promise(async function(resolve, reject) {
			const user = await userModel.find({ userEmail: email });

			if (user.length === 0) return reject("Incorrect credentials");
			userObj = user;
			const isMatched = await compare(password, user[0].password);

			if (!isMatched) return reject("Incorrect credentials");
			resolve(userObj);
		});
	} catch (err) {
		reject(err);
	}
};


userSchema.pre("save", async function(next) {
	try {
		if (this.isModified("password")) {
			const hashPwd = await hash(this.password, 10);
			this.password = hashPwd;
			next();
		}
	} catch (err) {
		console.log(err);
		next(err);
	}
});

const userModel = model("user",userSchema);
module.exports = userModel;
