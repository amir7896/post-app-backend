const express = require("express");
const {
  createPost,
  likePost,
  commentOnPost,
  getAllPosts,
  getAllCommentsForPost,
} = require("../controllers/post");
const router = express.Router();
const isAuthenticate = require("../middlewares/authentication/auth");
const { validPost } = require("../middlewares/validations/carValidation");
const { upload } = require("../cloudinary");

router.post(
  "/create",
  upload.array("media", 10),
  isAuthenticate,
  validPost,
  createPost
);
router.post("/like", isAuthenticate, likePost);
router.post("/comment", isAuthenticate, commentOnPost);
router.get("/list", isAuthenticate, getAllPosts);
router.get("/comments/:postId", isAuthenticate, getAllCommentsForPost);

module.exports = router;
