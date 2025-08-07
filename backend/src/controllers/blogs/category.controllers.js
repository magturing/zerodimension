import { catchAsyncError } from "../../middlewares/errors/error.middleware.js";
import { Category } from "../../models/blogs/category.model.js";
import ErrorHandler from "../../utils/errorHandler.js";


/**
 * Controller function to create category
 */
const createCategory = catchAsyncError(async(req,res,next) => {
    const {name,description,image,createdBy} = req.body;

    // TODO :- Implement Data sanitization and validation.
    // TODO :- Implement Image fields.
    // TODO :- Implement Authorization so that only admin user can create this resource.

    if(!name || !description){
        return next(new ErrorHandler("Enter all fields",400));
    }

    // No Authorized user can create this Category who is not logged in.
    const user = req.user._id;

    const category = await Category.create({
        name,
        description,
        image,
        createdBy:user
    });

    res.status(201).json({
        success:true,
        message:"Category created successfully!!",
        category
    });

});

/**
 * Controller function to get all category
 */
const getAllCategory = catchAsyncError(async(req,res,next) => {

    const category = await Category.find({isDeleted:{$ne:true},status:"active"});
    res.status(200).json({
        success:true,
        category
    });

});

/***
 * Controller function to get single category.
 */
const getOneCategory = catchAsyncError(async(req,res,next) => {
    const id = req.params.id;
    if(!id){
        return next(new ErrorHandler("Bad Request",400));
    }

    const category = await Category.findById(id);
    const isDeleted = category.isDeleted;
    const isActive = category.status;

    if(!category || isDeleted || isActive.inactive){
        return next(new ErrorHandler("Not Found",404));
    }

    res.status(200).json({
        success:true,
        category
    });
});

/**
 * Controller function to updateCategory
 */
const updateCategory = catchAsyncError(async(req,res,next) => {
    const id = req.params.id;
    if(!id){
        return next(new ErrorHandler("Bad Request",400));
    }

    const data = req.body;

    if(Object.keys(data).length === 0){
        return next(new ErrorHandler("Nothing to update",400));
    }
    
    let category = await Category.findById(id);
    const isDeleted = category.isDeleted;

    if(!category || isDeleted || category.status === "inactive"){
        return next(new ErrorHandler("Not Found",404));
    }
    
    const ALLOWED_UPDATES = [
        "name",
        "description",
        "image"
    ];

    const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));

    if(!isUpdateAllowed){
        return next(new ErrorHandler("Update not allowed ",401));
    }

    category = await Category.findByIdAndUpdate(id,data,{
        returnDocument:"after",
        runValidators:true,
    });

    res.status(200).json({
        success:true,
        category
    });
});

/**
 * Controller function to soft delete category
 */
const softDeleteCategory = catchAsyncError(async(req,res,next) => {
    const id = req.params.id;
    if(!id){
        return next(new ErrorHandler("Bad request",400));
    }

    let category = await Category.findById(id);
    if(!category || category.isDeleted || category.status === "inactive"){
        return next(new ErrorHandler("Not Found",404));
    }

    category.isDeleted = true;
    await category.save();

    res.status(200).json({
        success:true,
        message:"Category deleted successfully"
    });

});

/**
 * controller function to toggleCategory status of the category document.
 */
const toggleCategoryStatus = catchAsyncError(async(req,res,next) => {
    const id = req.params.id;
    if(!id){
        return next(new ErrorHandler("Bad Request",400));
    }

    const category = await Category.findById(id);

    if(!category || category.isDeleted){
        return next(new ErrorHandler("Not Found",404));
    }

    if(category.status === "active"){
        category.status = "inactive";
    }else{
        category.status = "active";
    }

    await category.save();

    res.status(200).json({
        success:true,
        message:"Status updated successfully"
    });
});



export {
    createCategory,
    getAllCategory,
    getOneCategory,
    updateCategory,
    softDeleteCategory,
    toggleCategoryStatus
}