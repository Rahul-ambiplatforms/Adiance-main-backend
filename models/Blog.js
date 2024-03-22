// models/Blog.js
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  sections: [{
    heading: { type: String, required: true },
    para: { type: String, required: true }
  }],
  tags: [{ type: String, required: true }],
  date: { type: Date, default: Date.now() }
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
