const mongoose = require("mongoose");
const validator = require("validator");
// const bcrypt = require("bycryptjs");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");




const userSchema = new mongoose.Schema({
    fname:
    {
        type:String,
        required:true,
        trim:true
    },
    email:
    {
        type:String,
        required:true,
        unique:true,
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                    throw new Error ("Not a Valid Email");
            }
        }
    },
    mobile:
    {
        type:String,
        required:true,
        unique:true
    },
    password:
    {
        type:String,
        required:true,
        minlength:6
    },
    cpassword:
    {
        type:String,
        required:true,
        minlength:6
    },
    tokens: [
        {
            token:
            {
                type:String,
                required:true,
            }
        }
    ],
    carts: Array

})


userSchema.pre("save",async function(next)
{
    if(this.isModified("password"))
    {
    this.password = await bcrypt.hash(this.password,12);   //  12 round process then the hashed password is generated.
    this.cpassword = await bcrypt.hash(this.cpassword,12);
    }

    next();   //  next argument is called once this is done;
})



// before saving the data you are require to perform the hashing of the data;

// Token Generate Process 

// userSchema.methods.generateAuthToken = async function()
// {
//     try
//     {
//         let token1 = jwt.sign({_id:this._id},secretKey);

//         this.tokens = this.tokens.concat({token:token1});
//         await this.save();
//         return token;
//     }
//     catch(error)
//     {
//         console.log("This is some error");
//     }
// }

userSchema.methods.generateAuthtokenn = async function(){
    try {
        //token generation
        let token = jwt.sign({_id:this._id},"sagardwevedisdkskjdnskdnskdnskdn"); //first payload than the secret key
        //by using the concatination we store the data in tokens of our schema and the function used is concat here 
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (error) {
        console.log("Error");
    }
}

// add to cart method
userSchema.methods.addcartdata = async function(cart)
    {
        try
        {
            this.carts = this.carts.concat(cart);
            await this.save();
            return this.carts
        }
        catch(error)
        {
            console.log(error);
        }
    }


const USER = new mongoose.model("USER",userSchema);
module.exports = USER;