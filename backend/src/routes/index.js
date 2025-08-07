import userRoutes from "./users/user.routes.js";
import categoryRoutes from "./blogs/category.routes.js";
import blogRoutes from "./blogs/blog.routes.js";
import utilRoutes from "./utils/utils.routes.js";
import express from "express";

const router = express.Router();



router.use("/users",userRoutes);
router.use("/category",categoryRoutes);
router.use("/blog",blogRoutes);
router.use("/util",utilRoutes);





export default router;
