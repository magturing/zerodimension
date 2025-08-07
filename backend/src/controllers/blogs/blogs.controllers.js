import { catchAsyncError } from "../../middlewares/errors/error.middleware.js";
import { Blog } from "../../models/blogs/blogs.model.js";
import { Category } from "../../models/blogs/category.model.js";
import ErrorHandler from "../../utils/errorHandler.js";
import { isValidId } from "../../utils/validation.js";



/**
 * Controller function to create new Blog
 */
const createBlog = catchAsyncError(async(req,res,next) => {
    const {title,content,excerpt,category,tags,featuredImage,media,approvedBy} = req.body;
    if(!title,!content,!excerpt,!category,tags,featuredImage,media,!publishedBy){
        return next(new ErrorHandler("Bad Request",400));
    }

    const user = req.user._id;
    // TODO :- publishedBy should be admin-user.
    // TODO :- Data sanitization and validation.

    const categoryId = await Category.findById(category);
    if(!categoryId){
        return next(new ErrorHandler("Category not found",404));
    }

    const blog = await Blog.create({
        title,
        excerpt,
        content,
        category,
        tags,
        featuredImage,
        media,
        approvedBy:user, //TO-DO change to admin user.
        author:user
    });

    res.status(200).json({
        success:true,
        blog
    });
});


/**
 * Controller function to getBlogs
 */
const getBlogs = catchAsyncError(async(req,res,next) => {
    const blogs = await Blog.find({});
    res.status(200).json({
        success:true,
        blogs
    });
});

/**
 * Controller function to get Blog by id.
 */
const getBlogById = catchAsyncError(async(req,res,next) => {

    const id = req.params.id;
    if(!id){
        return next(new ErrorHandler("Bad request",400));
    }

    const blog = await Blog.findById(id);
    if(!blog){
        return next(new ErrorHandler("Not found",404));
    }

    res.status(200).json({
        success:true,
        blog
    });
});


const updateBlog = catchAsyncError(async(req,res,next) => {
    const id = req.params.id;
    if(!id){
        return next(new ErrorHandler("Bad request",400));
    }
    
});

/**
 * Controller function to delete blog.
 */
const deleteBlog = catchAsyncError(async(req,res,next)=>{
    const id = req.params.id;
    if(!isValidId(id)){
        return next(new ErrorHandler("Bad request",400));
    }
    if(!id){
        return next(new ErrorHandler("Bad Request",400));
    }
    const blog = await Blog.findById(id);
    if(!blog){
        return next(new ErrorHandler("Resource not found",404));
    }
    await blog.deleteOne();
    await Blog.save();
    res.status(200).json({
        success:true,
        message:"Deleted successfully"
    });
});

export {
    createBlog,
    getBlogs,
    getBlogById,
    deleteBlog
}