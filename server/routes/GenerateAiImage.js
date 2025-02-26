import express from "express";
import { createPost, getAllPosts } from "../controllers/Posts.js";
import { generateImage } from "../controllers/GenerateAiImages.js";

const router=express.Router();

router.post("/",generateImage);

export default router;