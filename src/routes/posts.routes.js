import { Router } from 'express';
import { createPost, getPosts, getPost, updatePost, deletePost, searchPosts } from '../controllers/posts.controller.js';

const router = Router();

router.post('/', createPost);
router.get('/', getPosts);
router.get('/search', searchPosts);
router.get('/:id', getPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);


export default router;