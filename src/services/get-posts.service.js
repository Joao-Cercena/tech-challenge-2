import prisma from '../database.js';

export async function getPostsService() {
    return await prisma.post.findMany();
}