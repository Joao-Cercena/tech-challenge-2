import prisma from '../database.js';

export async function getPostService(id) {
  const post = await prisma.post.findUnique({
    where: {
      id: Number(id)
    }
  });

  return post;
}