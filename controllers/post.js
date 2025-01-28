const { Types } = require("mongoose");
const Post = require("../models/post");
const Comment = require("../models/comment");
const { ERRORS, STATUS_CODE, SUCCESS_MSG } = require("../constants");

// Create a new post
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const { userId } = req.user;

    const post = new Post({
      user: userId,
      title: title,
      content: content,
    });

    await post.save();

    return res.status(STATUS_CODE.OK).json({
      success: true,
      message: SUCCESS_MSG.POST.CREATED,
      user: post,
    });
  } catch (error) {
    console.error("Server error on creating post:", error);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json({ success: false, message: ERRORS.ERRORS.SERVER_ERROR });
  }
};

// Like or unlike a post
const likePost = async (req, res) => {
  try {
    const { postId } = req.body;

    const { userId } = req.user;

    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json({ success: false, message: ERRORS.ERRORS.POST_NOT_FOUND });
    }

    const userIndex = post.likes.indexOf(userId);

    let likeMessage = "";
    if (userIndex === -1) {
      post.likes.push(userId);
      message = SUCCESS_MSG.POST.LIKE;
    } else {
      post.likes.splice(userIndex, 1);
      message = SUCCESS_MSG.POST.UN_LIKE;
    }

    await post.save();

    return res.status(STATUS_CODE.OK).json({
      success: true,
      message: likeMessage,
      likesCount: post.likes.length,
    });
  } catch (error) {
    console.log("Server error on like post:", error);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json({ message: ERRORS.ERRORS.SERVER_ERROR, error: error });
  }
};

// Comment on a post
const commentOnPost = async (req, res) => {
  try {
    const { postId, content } = req.body;
    const { userId, username } = req.user;

    const comment = new Comment({ user: userId, post: postId, content });
    await comment.save();

    const populatedComment = await Comment.findById(comment._id).populate(
      "user",
      "_id userName"
    );

    await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

    return res.status(200).json({
      success: true,
      message: "Comment added successfully",
      comment: populatedComment,
    });
  } catch (error) {
    console.error("Server error comment on post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add comment",
      error: error.message,
    });
  }
};

// Get all posts with likes and comments
const getAllPosts = async (req, res) => {
  try {
    const start = parseInt(req.query.start) || 0; // Default to start at 0 if no start is specified
    const limit = parseInt(req.query.limit) || 5; // Default to limit of 5 if no limit is specified

    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },

      {
        $addFields: {
          likesCount: { $size: "$likes" },
          userName: "$userDetails.userName",
          userId: "$userDetails._id",
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          content: 1,
          user: {
            userId: "$userId",
            userName: "$userName",
          },
          likesCount: 1,
        },
      },
      {
        $skip: start,
      },
      {
        $limit: limit,
      },
    ]);

    res.json({ data: posts });
  } catch (error) {
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json({ message: ERRORS.ERRORS.SERVER_ERROR, error: error });
  }
};

// Get all comments for a single post
const getAllCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate({
      path: "comments",
      populate: {
        path: "user",
        select: "_id userName",
      },
    });

    if (!post) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json({ success: false, message: ERRORS.ERRORS.POST_NOT_FOUND });
    }

    const comments = post.comments.map((comment) => ({
      _id: comment._id,
      content: comment.content,
      user: {
        _id: comment.user._id,
        userName: comment.user.userName,
      },
    }));

    return res.status(STATUS_CODE.OK).json({
      success: true,
      postId: post._id,
      comments: comments,
    });
  } catch (error) {
    console.error("Server error on getting comments for post:", error);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json({ success: false, message: ERRORS.ERRORS.SERVER_ERROR });
  }
};

module.exports = {
  createPost,
  likePost,
  commentOnPost,
  getAllPosts,
  getAllCommentsForPost,
};
