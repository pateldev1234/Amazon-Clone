const Products = require("./models/productSchema");
const productdata = require("./constant/productdata");

const DefaultData = async()=>
{
    try
    {
        await Products.deleteMany({});
        const storeData = await Products.insertMany(productdata);
        console.log(storeData);
    }
    catch
    {
        console.log("There is the Error we got");
    }

};



module.exports = DefaultData;

// const Products = require("./models/productSchema");
// const productsdata = require("./constant/productdata")

// const DefaultData = async()=>{
//     try{
//         await Products.deleteMany({});
//         const storeData = await Products.insertMany(productsdata);
//         console.log(storeData);
//     }catch (error){
//         console.log("error "+error.message);
//     }
// }

// module.exports = DefaultData;