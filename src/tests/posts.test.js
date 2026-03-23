import request from 'supertest';
import app from '../app.js';

describe('Posts API', () => {

    it('should create a post', async () => {
        const response = await request(app)
            .post('/posts')
            .send({
                title: 'Teste',
                content: 'Conteúdo teste',
                author: 'João'
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
    });

    it('should list posts', async () => {
        const response = await request(app)
            .get('/posts');

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get post by id', async () => {
        const create = await request(app)
            .post('/posts')
            .send({
                title: 'Post teste',
                content: 'Conteúdo teste',
                author: 'João'
            });

        const id = create.body.id;

        const response = await request(app)
            .get(`/posts/${id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(id);
    });

    it('should update a post', async () => {
        const create = await request(app)
            .post('/posts')
            .send({
                title: 'Antigo',
                content: 'Conteúdo',
                author: 'João'
            });

        const id = create.body.id;

        const response = await request(app)
            .put(`/posts/${id}`)
            .send({
                title: 'Atualizado',
                content: 'Novo conteúdo',
                author: 'João'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe('Atualizado');
    });

    it('should delete a post', async () => {
        const create = await request(app)
            .post('/posts')
            .send({
                title: 'Delete',
                content: 'Teste',
                author: 'João'
            });

        const id = create.body.id;

        const response = await request(app)
            .delete(`/posts/${id}`);

        expect(response.statusCode).toBe(200);
    });

    it('should search posts', async () => {
        await request(app).post('/posts').send({
            title: 'Node.js Teste',
            content: 'Conteúdo',
            author: 'João'
        });

        const response = await request(app)
            .get('/posts/search?q=Node');

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 404 for non-existing post', async () => {
        const response = await request(app)
            .get('/posts/999999');

        expect(response.statusCode).toBe(404);
    });

    it('should return 400 when creating invalid post', async () => {
        const response = await request(app)
            .post('/posts')
            .send({});

        expect(response.statusCode).toBe(400);
    });
});