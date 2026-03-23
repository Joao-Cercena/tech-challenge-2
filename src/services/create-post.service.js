import prisma from '../database.js';

export async function createPostService({ title, content, author }) {
  const post = await prisma.post.create({
    data: {
      title,
      content,
      author
    }
  });

  return post;
}