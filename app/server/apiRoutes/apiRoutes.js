import { Router } from "express";
import { postLogin } from "../controllers/authController.js";
import { postAddUser } from "../controllers/userController.js";

export const router = () => {
  const router = Router();

  router.get("/testLogin", postLogin );
  router.post("/login", postLogin)
  router.post("/addUser", postAddUser) 
  
  return router
}

