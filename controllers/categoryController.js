import categoryModel from "../models/categoryModel.js";
import slugify from 'slugify';

export const createCategoryController = async (req,res) => {
    try{
        const {name} = req.body
        if(!name){
            return res.status(400).send({message: 'Name is required'})
        }
        const existingCastegory = await categoryModel.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success:true,
                message:'category already exists'
            })
        }
        const category = await new categoryModel({name, slug:slugify(name)}).save()
        res.status(201).send({
            success: true,
            message:'new category created',
            category
        })

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error in Category"
        })
    }
};

//update category
export const updateCategoryController = async (req,res) => {
    try{
        const {name}= req.body;
        const {id} = req.params;
        const category = await categoryModel.findByIdAndUpdate(id,{name, slug:slugify(name),new:true});
        res.status(200).send({
            success:true,
            message:"Category Updated Successfully",
            category,
        });

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error while updating category'
        })
    }   
       
};
//getall categories
export const categoryController=async (req,res)=>{
    try{
        const categroy = await categoryModel.find({})
        res.status(200).send({
            success : true ,
            message:"All categories list",
            category,
        })

    }catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message:"Error while getting all categories"
        })
    }

};

//get single category
export const singleCategoryController = async(req,res) => {
    try{
        const {slug}= req.params
        const category = await categoryModel.findOne({slug:req.params.slug})
        res.status(200).send({
            success:true,
            message:"Get Single Category success",
            category,
        })

    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"Error while getting Single Category"
        })
    }

};

//delete category
export const deleteCategoryController = async(req,res) => {
    try{
        const { id } = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message:`category with ID ${id} deleted successfully`,
        })

    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:'error while deleting category',
            error,
        })
    }

};