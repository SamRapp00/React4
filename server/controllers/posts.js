const Post = require('../models/Post'); 
const User = require('../models/User'); 


const addPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.user.id; 

        const newPost = new Post({ title, content, user: userId });
        await newPost.save();

        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error });
    }
};

// Get all posts
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('user', 'username'); 
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
};

// Get current user's posts
const getCurrentUserPosts = async (req, res) => {
    try {
        const userId = req.user.id; 
        const posts = await Post.find({ user: userId });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user posts', error });
    }
};

// Edit a post
const editPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { title, content } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'User not authorized to edit this post' });
        }

        post.title = title;
        post.content = content;
        await post.save();

        res.status(200).json({ message: 'Post updated successfully', post });
    } catch (error) {
        res.status(500).json({ message: 'Error updating post', error });
    }
};

// Delete a post
const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'User not authorized to delete this post' });
        }

        await post.remove();

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error });
    }
};

module.exports = {
    addPost,
    getAllPosts,
    getCurrentUserPosts,
    editPost,
    deletePost
};