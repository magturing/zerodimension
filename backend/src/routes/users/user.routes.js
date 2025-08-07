import Router from "express";

const router = Router();

import { 
    signUp, 
    getAllUsers, 
    myProfile,
    login,
    updateUser,
    changePassword,
    deleteUser,
    logout
} from "../../controllers/users/user.controllers.js";
import { 
    isAuthenticated,
    isAuthorizedAdmin,
    isAuthorizedUser,
} from "../../middlewares/authentication/auth.middleware.js";
import { changePasswordRateLimiter } from "../../utils/rateLimiter.js";


router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/admin/users").get(isAuthenticated,isAuthorizedAdmin,getAllUsers);
router.route("/").get(getAllUsers);
router.route("/me").get(isAuthenticated,myProfile).patch(isAuthenticated,updateUser);
router.route("/changePassword").post(isAuthenticated,changePasswordRateLimiter,changePassword);
router.route("/delete/me").delete(isAuthenticated,deleteUser);
router.route("/logout").post(isAuthenticated,logout);



export default router;