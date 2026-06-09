import { prisma } from "./config.js";

export const createLike = async (req,res) => {
    const { postId } = req.body;4
    const authorId = req.params.id;

    try {
        if(!postId || !authorId){
            return res.status(400).json({
                message: "All fields are required"
            })
        }
        const like = await prisma.like.create({
            data: {
                userId: authorId,
                postId: postId
            }
        })
        if(!like){
            return res.status(400).json({
                message: "Like not created successfully"
            })
        }
        res.status(201).json({
            message: "Like created successfully",
            like: like
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server error",
            error: error.message
        })
    }
}

export const deleteLike = async (req,res) => {
    const id = parseInt(req.params.id);

    try {
        if(!id){
            return res.status(400).json({
                message: "Like id is required"
            })
        }
        const like = await prisma.like.delete({
            where: {
                id: id
            }
        })
        if(!like){
            return res.status(404).json({
                message: "Like not found"
            })
        }
        res.status(200).json({
            message: "Like deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server error",
            error: error.message
        })
    }
}