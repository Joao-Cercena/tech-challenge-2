import prisma from '../database.js';

export async function deletePostService(id) {
  return await prisma.post.delete({
    where: { id: Number(id) }
  });
}