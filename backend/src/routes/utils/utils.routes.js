import Router from "express";

const router = Router();


import { callCppAdd } from "../../utils/cpp/func.js";
import { callPythonAdd } from "../../utils/python/func.js";
import { callJavaAdd } from "../../utils/java/func.js";

router.route("/1").post(callCppAdd);
router.route("/2").post(callPythonAdd);
router.route("/3").post(callJavaAdd);



export default router;