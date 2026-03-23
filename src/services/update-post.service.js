import prisma from '../database.js';

export async function updatePostService(id, data) {
  return await prisma.post.update({
    where: { id: Number(id) },
    data
  });
}