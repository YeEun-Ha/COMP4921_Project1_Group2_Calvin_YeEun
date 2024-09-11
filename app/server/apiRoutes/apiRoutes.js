import { Router } from "express";
import { postLogin } from "../controllers/authController.js";

export const router = () => {
  const router = Router();

  router.get("/testLogin", postLogin );
  
  return router
}

