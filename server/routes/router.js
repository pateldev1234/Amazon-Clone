const express = require("express");
const router = new express.Router();
const athenticate = require("../middleware/authenticate")
const Products = require("../models/productSchema");
const USER  = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Get the All productdata API
router.get("/getproducts",async(req,res)=>
{
    
    try
    {
        const productsdata = await Products.find();
        // console.log("Weare getting the data from the postman app");
        console.log(productsdata);
        res.status(201).json(productsdata);
    }
    catch(error)
    {
            console.log("There is the error in  the router part");
    }
});


// Get  display the individual item data/details

router.get("/getproductsone/:id",async(req,res)=>
{
    try
    {
        const {id}  = req.params;
        // console.log(id);

        const individualdata = await Products.findOne({id:id});
        // console.log(individualdata);

        res.status(201).json(individualdata);

       
    }

    catch(error)
    {
        res.status(400).json(individualdata);
        console.log("error"+error.message);
    }
});


//Add the sign up data to the database

router.post("/signup",async(req,res)=>
{
    const {fname,email,mobile,password,cpassword} = req.body;

    if(!fname || !email || !mobile || !password || !cpassword)
    {
        res.status(422).json({error:"fill all the data"});
        console.log("You have not entered the data");
    };


    try
    {
        const preuser =  await USER.findOne({email:email});

        if(preuser)
        {
            res.status(422).json({error:"Data already present"});
            console.log("Data already present");
        }
        else if(password !== cpassword)
        {
            res.status(422).json({error:"Password mismatch"});
            console.log("Password mismatch");
        }
        else
        {
            const finaluser = new USER({
                fname,email,mobile,password,cpassword
            })


            // harsh -> Encrption -> hujug (meaning less words)
            // hujug -> Decryption -> harsh (we get the data)
            // bcryptjs hashing algorithm

            // password hashing algorithm
            

            const storedata = await finaluser.save();
            console.log(storedata);
        }
    }
    catch(error)
    {
        
        console.log("There is some Error");
    }
})

// Login User API

router.post("/login",async(req,res)=>
{
    const {email,password} = req.body;

    if(!email || !password) 
    {
        res.status(400).json({error:"Fill the Details"});
    }

    try
    {
        const userlogin = await USER.findOne({email:email});
        console.log(userlogin);

        if(userlogin)
        {
            const ismatch = await bcrypt.compare(password,userlogin.password);
            console.log(ismatch);

            // Token Generation

            const token = await userlogin.generateAuthtokenn();
            console.log(token);
            

            // generate cookies

            res.cookie("Amazonweb",token,{
                expires: new Date(Date.now() + 900000),
                httpOnly:true
            })
            

            if(!ismatch)
            {
                res.status(400).json({error:"invalid Details"});
            }
            else
            {
                res.status(400).json(userlogin);
            }
        }
        else
        {

            res.status(400).json({error:"invalid Details"});
        }
    }
    catch(error)
    {
        res.status(400).json({error:"Invalid Details"});
    }

});


// adding data into cart

router.post("/addcart/:id",athenticate,async(req,res)=>
{

    try
    {
        const {id} = req.params;
        const cart = await Products.findOne({id:id});

        console.log(cart);
        
        const UserContact = await  USER.findOne({_id:req.userID});

        console.log(UserContact);

        if(UserContact)
        {
            const cartData = await UserContact.addcartdata(cart);
            await UserContact.save();
            console.log(cartData);
            res.status(201).json(UserContact);
        }
        else
        {
            res.status(400).json({error:"Invalid Details"});
        }


    }
    catch(error)
    {
        res.status(400).json({error:"Invalid Details"});
    }

});

// Getting the Details of the Cart of the Particular item that is being added to the cart

router.get("/cartdetails",athenticate,async(req,res)=>
{
    try
    {
        const buyuser = await USER.findOne({_id:req.userID});
        res.status(201).json(buyuser);
    }
    catch(error)
    {
            console.log("error",error);
    }
})

// get valid user, it is used at the starting of the website wheather is user is valid or not using useEffect Hook


router.get("/validuser",athenticate,async(req,res)=>
    {
        try
        {
            const validuser = await USER.findOne({_id:req.userID});
            res.status(201).json(validuser);
        }
        catch(error)
        {
                console.log("error",error);
        }
    })



// Remove the Item from the Cart

router.delete("/remove/:id", athenticate, async(req, res)=>{
    try {
        const {id} = req.params;
        req.rootUser.carts = req.rootUser.carts.filter((cruval)=>{
            return cruval.id!=id;
        });
        req.rootUser.save();
        res.status(201).json(req.rootUser);
        console.log("item remove");
    } catch (error) {
        console.log("error: "+ error);
        res.status(400).json(req.rootUser);
    }
})

// Logout API
router.get('/logout',athenticate, (req,res)=>{
    try{
        req.rootUser.tokens = req.rootUser.tokens.filter((curelem)=>{
            return curelem.token!==req.token
        });
        res.clearCookie("Amazonweb",{path:"/"});
        req.rootUser.save()
        res.status(201).json(req.rootUser.tokens);
        console.log("User logout");
    }catch(error){
        console.log("error for user logout")
    }
})


module.exports = router;