import Router from "express";

const router = Router();


import {
    createCategory,
    getAllCategory,
    getOneCategory,
    updateCategory,
    softDeleteCategory,
    toggleCategoryStatus
} from "../../controllers/blogs/category.controllers.js"

import { isAuthenticated } from "../../middlewares/authentication/auth.middleware.js";


router.route("/").post(isAuthenticated,createCategory);
router.route("/").get(isAuthenticated,getAllCategory);
router.route("/:id").get(isAuthenticated,getOneCategory)
                             .patch(isAuthenticated,updateCategory)
                             .delete(isAuthenticated,softDeleteCategory);

router.route("/status/:id").patch(isAuthenticated,toggleCategoryStatus);


export default router;