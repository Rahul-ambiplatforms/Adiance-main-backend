// controllers/blogController.js
const Blog = require('../models/Blog');

// Create a new blog with file upload
exports.createBlog = async (req, res) => {
  
  try {
    // Extract other form fields
    const { title, description, sections, tags,image } = req.body;
    // console.log(req.body);
    // console.log(title,description,sections, tags);
    // // Create a new Blog instance
    const newBlog = new Blog({
      title,
      description,
      image, // Use the filename provided by Multer
      sections: Array.isArray(sections) ? sections : [],
      tags: Array.isArray(tags) ? tags : [],
    });
    // console.log("Blog Object",newBlog);
    // Save the new blog to the database
    const savedBlog = await newBlog.save();

    // Respond with the saved blog
    res.status(201).json(savedBlog);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ error: 'Error creating blog' });
  }
};


// Get all blogs
exports.getAllBlogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10; // Default limit to 10 blogs per page
  const skip = (page - 1) * limit;

  try {
    const totalBlogs = await Blog.countDocuments();
    const totalPages = Math.ceil(totalBlogs / limit);

    const blogs = await Blog.find()
      .skip(skip)
      .limit(limit);

    res.status(200).json({ blogs, totalPages, currentPage: page });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    // console.log("blog ");
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a blog by ID
exports.updateBlogById = async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a blog by ID
const fs = require('fs');
const path = require('path');

exports.deleteBlogById = async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Retrieve the filename of the image from the deleted blog
    const filename = deletedBlog.image;

    // Adjust the path to the uploads folder from the controllers directory
    const uploadsPath = path.join(__dirname, '..', 'uploads');

    // Construct the absolute path to the image file
    const imagePath = path.join(uploadsPath, filename);

    // Delete the image file from the uploads folder
    fs.unlinkSync(imagePath);

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBlogImage = async (req, res) => {
  const { id } = req.params; // Get the blog ID from the request parameters
  const { NEWimage } = JSON.parse(req.body.body); // Get the filename of the new image from the request body
  // console.log(req.body);
  try {
    // Find the blog by ID
    const blog = await Blog.findById(id);

    // If the blog doesn't exist, return a 404 status with an error message
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Retrieve the filename of the existing image from the blog
    const filename = blog.image;

    // console.log('old img: ');
    // console.log(filename);
    // console.log('new image:');
    // console.log(NEWimage);

    // Adjust the path to the uploads folder from the controllers directory
    const uploadsPath = path.join(__dirname, '..', 'uploads');

    // Construct the absolute path to the existing image file
    const imagePath = path.join(uploadsPath, filename);


    // Update the image field of the blog with the new filename
    blog.image = NEWimage;

    // Save the updated blog to the database
    const updatedBlog = await blog.save();

    // Delete the existing image file from the uploads folder
    fs.unlinkSync(imagePath);

    // Respond with the updated blog
    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog image:', error);
    res.status(500).json({ error: 'Error updating blog image' });
  }
};

