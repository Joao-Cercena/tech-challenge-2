import prisma from '../database.js';

export async function searchPostsService(query) {
    return await prisma.post.findMany({
        where: {
            OR: [
                {
                    title: {
                        contains: query,
                        mode: 'insensitive'
                    }
                },
                {
                    content: {
                        contains: query,
                        mode: 'insensitive'
                    }
                }
            ]
        }
    });
}