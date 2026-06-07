import { prisma } from "./config.js";

export const createPost = async (req, res) => {
  const { title, postText } = req.body;
  const authorId = req.user.id;
  try {
    if (!title || !postText || !authorId) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }
    const post = await prisma.post.create({
      data: {
        title: title,
        postText: postText,
        authorId: authorId,
      },
    });
    if (!post) {
      return res.status(400).json({
        message: "Post not created successfully.",
      });
    }
    res.status(201).json({
      message: "Post created successfully",
      post: post,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while creating post",
      error: error.message,
    });
  }
};
