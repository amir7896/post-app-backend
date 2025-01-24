const express = require("express");
const {
  createPost,
  likePost,
  commentOnPost,
  getAllPosts,
} = require("../controllers/post");
const router = express.Router();
const isAuthenticate = require("../middlewares/authentication/auth");
const { validPost } = require("../middlewares/validations/carValidation");

router.post("/create", validPost, isAuthenticate, createPost);
router.post("/like", isAuthenticate, likePost);
router.post("/comment", isAuthenticate, commentOnPost);
router.get("/list", getAllPosts);

module.exports = router;
