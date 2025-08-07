import Router from "express";

const router = Router();

import {
    createBlog,
    getBlogById,
    getBlogs,
    deleteBlog
} from "../../controllers/blogs/blogs.controllers.js"
import { isAuthenticated } from "../../middlewares/authentication/auth.middleware.js";

router.route("/blog").post(isAuthenticated,createBlog);
router.route("/blogs").get(isAuthenticated,getBlogs);
router.route("/blog/:id").get(isAuthenticated,getBlogById)
                         .delete(isAuthenticated,deleteBlog);




export default router;