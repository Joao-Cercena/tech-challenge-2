import { Router } from 'express';
import { createPost, getPosts, getPost, updatePost, deletePost, searchPosts } from '../controllers/posts.controller.js';
import { authenticateProfessor } from '../middlewares/authenticate-professor.js';

const router = Router();

router.get('/', getPosts);
router.get('/search', searchPosts);
router.get('/:id', getPost);
router.post('/', authenticateProfessor, createPost);
router.put('/:id', authenticateProfessor, updatePost);
router.delete('/:id', authenticateProfessor, deletePost);


export default router;
