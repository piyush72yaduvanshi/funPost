import { prisma } from "./config.js";

export const createComment = async (req, res) => {
  const { commentText, postId } = req.body;
  const authorId = req.user.id;
  try {
    if (!commentText || !postId || !authorId) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const comment = await prisma.comment.create({
      data: {
        commentText: commentText,
        userId: authorId,
        postId: postId,
      },
    });
    if (!comment) {
      return res.status(400).json({
        message: "Comment not created successfully",
      });
    }
    res.status(201).json({
      message: "Comment created successfully",
      comment: comment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const updatedComment = async (req, res) => {
  const { commentText } = req.body;
  const id = parseInt(req.params.id);

  try {
    if (!commentText || !id) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const comment = await prisma.comment.update({
      where: {
        id: id,
      },
      data: {
        commentText: commentText,
      },
    });
    if (!comment) {
      return res.status(400).json({
        message: "Comment not updated successfully",
      });
    }
    res.status(200).json({
      message: "Comment updated successfully",
      comment: comment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const deleteComment = async (req,res) => {
    const id = parseInt(req.params.id);

    try {
        if(!id){
            return res.status(400).json({
                message: "Comment id is required"
            })
        }
        const comment = await prisma.comment.delete({
            where: {
                id: id
            }
        })
        if(!comment){
            return res.status(404).json({
                message: "Comment not found"
            })
        }
        res.status(200).json({
            message: "Comment deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server error",
            error: error.message
        })
    }
}