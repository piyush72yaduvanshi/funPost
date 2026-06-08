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

export const getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
      },
    });
    if (!posts) {
      return res.status(404).json({
        message: "Posts not found",
      });
    }
    res.status(200).json({
      message: "Posts fetched successfully",
      posts: posts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while getting posts",
      error: error.message,
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { title, postText } = req.body;
    const id = parseInt(req.params.id);
    const post = await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        title: title,
        postText: postText,
      },
    });
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    res.status(200).json({
      message: "Post updated successfully",
      post: post,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!id) {
      return res.status(400).json({
        message: "Post id is required",
      });
    }
    const post = await prisma.post.delete({
      where: {
        id: id,
      },
    });
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const getById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if(!id){
      return res.status(400).json({
        message: "Post id is required"
      })
    }
    const post = await prisma.post.findUnique({
      where: {
        id: id
      },
      include: {
        author: true
      }
    })
    if(!post){
      return res.status(404).json({
        message: "Post not found"
      })
    }
    res.status(200).json({
      message: "Post fetched successfully",
      post: post
    })
  } catch (error) {
    res.status(500).json({
      message: "Internal Server error",
      error: error.message
    })
  }
}
