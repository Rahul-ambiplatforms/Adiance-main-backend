// routes/blogRoutes.js
const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

router.post('/createBlog',blogController.createBlog);
router.get('/getAllBlogs', blogController.getAllBlogs);
router.get('/getBlog/:id', blogController.getBlogById);
router.put('/update/:id', blogController.updateBlogById);
router.delete('/delete/:id', blogController.deleteBlogById);
router.put('/updateImage/:id', blogController.updateBlogImage);

module.exports = router;