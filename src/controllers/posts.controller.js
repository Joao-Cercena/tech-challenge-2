import { createPostService } from '../services/create-post.service.js';
import { getPostService } from '../services/get-post.service.js';
import { getPostsService } from '../services/get-posts.service.js';
import { updatePostService } from '../services/update-post.service.js';
import { deletePostService } from '../services/delete-post.service.js';
import { searchPostsService } from '../services/search-post.service.js';


//CREATE
export async function createPost(req, res, next) {
  const { title, content, author } = req.body;

  try {
    if (!title || !content || !author) {
      return res.status(400).json({
        error: 'titulo, descrição e autor são obrigatórios'
      });
    }

    const post = await createPostService({
      title,
      content,
      author
    });

    return res.status(201).json(post);
  } catch (error) {
    next(error);
  }
}

//FIND MANY
export async function getPosts(req, res, next) {
  try {
    const posts = await getPostsService();
    res.json(posts);
  } catch (error) {
    next(error);
  }
}

//FIND ONE
export async function getPost(req, res, next) {
  const { id } = req.params;

  try {
    const post = await getPostService(id);

    if (!post) {
      return res.status(404).json({
        error: 'Post não encontrado'
      });
    }

    return res.json(post);
  } catch (error) {
    next(error);
  }
}


//UPDATE
export async function updatePost(req, res, next) {
  const { id } = req.params;
  const { title, content, author } = req.body;

  try {
    if (isNaN(Number(id))) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const post = await updatePostService(id, {
      title,
      content,
      author
    });

    return res.json(post);
  } catch (error) {
    next(error);
  }
}

//DELETE
export async function deletePost(req, res, next) {
  const { id } = req.params;

  try {
    if (isNaN(Number(id))) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    await deletePostService(id);

    return res.json({
      message: 'Post deletado com sucesso'
    });
  } catch (error) {
    next(error);
  }
}

//SEARCH
export async function searchPosts(req, res, next) {
  const { q } = req.query;

  try {
    if (!q) {
      return res.status(400).json({
        error: 'Query "q" é obrigatória'
      });
    }

    const posts = await searchPostsService(q);

    return res.json(posts);
  } catch (error) {
    next(error);
  }
}