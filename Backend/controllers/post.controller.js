import { Post } from "../models/post.model.js";

const createPost = async (req, res) =>{
    try {
        const {name, description, age} = req.body;

        if(!name || !description || !age){
            return res.status(400).json({message: "all fields are required"});
        }
           const post =await Post.create({
            name,
            description,
            age
           });
           res.status(201).json({
            message: "Post created successfully",
            post
           })
        
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

const getPosts = async ( req, res) =>{
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

const updatePost = async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: "No data provided for update."
            });
        }

        const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!post) {
            return res.status(404).json({
                message: "Cannot find post."
            });
        }

        res.status(200).json({
            message: "Post has been updated successfully.",
            post
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error.",
            error: error.message
        });
    }
}

const deletepost = async (req, res) => {
    try {
        const deleted = await Post.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                message: "Post not found."
            });
        }

        res.status(200).json({
            message: "Post successfully deleted.",
            post: deleted
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error.",
            error: error.message
        });
    }
};

export {
    createPost,
    getPosts,
    updatePost,
    deletepost
};