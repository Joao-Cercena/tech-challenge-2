import { createPostService } from '../services/create-post.service.js';
import { getPostService } from '../services/get-post.service.js';
import { getPostsService } from '../services/get-posts.service.js';
import { updatePostService } from '../services/update-post.service.js';
import { deletePostService } from '../services/delete-post.service.js';
import { searchPostsService } from '../services/search-post.service.js';
import { parseId } from '../utils/validation.js';

function validatePostPayload({ title, content, author }) {
  if (
    typeof title !== 'string' || !title.trim() ||
    typeof content !== 'string' || !content.trim() ||
    typeof author !== 'string' || !author.trim()
  ) {
    return null;
  }

  return {
    title: title.trim(),
    content: content.trim(),
    author: author.trim()
  };
}

//CREATE
export async function createPost(req, res, next) {
  const postData = validatePostPayload(req.body);

  try {
    if (!postData) {
      return res.status(400).json({
        error: 'titulo, descrição e autor são obrigatórios'
      });
    }

    const post = await createPostService(postData);

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
  try {
    const post = await getPostService(parseId(req.params.id));

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
  const postData = validatePostPayload(req.body);

  try {
    if (!postData) {
      return res.status(400).json({
        error: 'titulo, descrição e autor são obrigatórios'
      });
    }

    const post = await updatePostService(parseId(req.params.id), postData);

    return res.json(post);
  } catch (error) {
    next(error);
  }
}

//DELETE
export async function deletePost(req, res, next) {
  try {
    await deletePostService(parseId(req.params.id));

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
    if (typeof q !== 'string' || !q.trim()) {
      return res.status(400).json({
        error: 'Query "q" é obrigatória'
      });
    }

    const posts = await searchPostsService(q.trim());

    return res.json(posts);
  } catch (error) {
    next(error);
  }
}
