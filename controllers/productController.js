import productModel from '../models/productModel.js';
import fs from 'fs';
import slugify from 'slugify'

export const createProductController = async(req,res) =>{
    try {
        const {name,slug,description,price,category,quantity,shipping} = req.fields 
        const {photo} = req.files

        switch(true){
            case !name:
                return res.status(500).send({error:'Name is Required'})
            case !description:
                return res.status(500).send({error:'description is Required'})
            case !price:
                return res.status(500).send({error:'Price is Required'})
            case !category:
                return res.status(500).send({error:'Category is Required'})
            case !quantity:
                return res.status(500).send({error:'Quantity is Required'})
            case !photo && photo.size > 1000000:
                return res.status(500).send({error:'photo is Required and should be less than 1 MB'})
        }
        
        const products = new productModel({...req.fields, slug:slugify(name)});
        if(photo){
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save();
        res.status(200).send({
            success:true,
            messgae:'Product creates successfully',
            products,
        })

    }catch(error){
        res.status(500).send({
            success:false,
            error,
            message:"Error in creating product",
        })
    }

};

//get all products
export const getProductController = async(req,res) =>{
    try{
        const products = await productModel.find({}).select("photo").limit(12).sort({createdAt:-1})
        res.status(200).send({
            success:true,
            message:"All Products ",
            products,
            counTotal: products.length,
        });

    }catch(error){
        console.log("Error while getting Products")
        res.status(500).send({
            sucess : false,
            message:"Error in getting products",
            error:error.message,
        })
    }
};

export const getSingleProductController = async(req,res) => {
    try{
        const product = await productModel.findOne({slug:req.params.slug}).select("-photo").populate("category")
        res.status(200).send({
            success: true,
            message:"Single Product fetched",
            products,
        })

    }catch(error){
        console.log(error)

        res.status(500).send({
            success:false,
            message: 'Error while getting single product',
            error,

        })
    }
};

export const productPhotoController = async(req,res) => {
    try{
        const product = await productModel.findById(req.params.pid).select("photo")
        if(product.photo.data){
            res.set('Content-type',product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }   

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error uploading photo to server',
            error,
        })
    }
};

 
export const deleteProductController= async(req,res)=>{
    try{
        await productModel.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
            success:true,
            message:'Products deleted successfully',
        })

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:`Failed deleting ${productId}`,
            error,
        })
    }
};

export const updateProductController= async(req,res) =>{
    try {
        const {name,slug,description,price,category,quantity,shipping} = req.fields 
        const {photo} = req.files

        switch(true){
            case !name:
                return res.status(500).send({error:'Name is Required'})
            case !description:
                return res.status(500).send({error:'description is Required'})
            case !price:
                return res.status(500).send({error:'Price is Required'})
            case !category:
                return res.status(500).send({error:'Category is Required'})
            case !quantity:
                return res.status(500).send({error:'Quantity is Required'})
            case !photo && photo.size > 1000000:
                return res.status(500).send({error:'photo is Required and should be less than 1 MB'})
        }
        
        const products = await productModel.findByIdAndUpdate(req.params.pid,{...req.fields,slug:slugify(name)}, {new:true})
        if(photo){
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save();
        res.status(200).send({
            success:true,
            messgae:'Product updated successfully',
            products,
        })

    }catch(error){
        res.status(500).send({
            success:false,
            error,
            message:"Error in updating product",
        })
    }

};
