import bcrypt from 'bcryptjs';
import { randomBytes, randomUUID } from 'node:crypto';
import request from 'supertest';
import app from '../app.js';
import prisma from '../database.js';

const testPrefix = '__tc4_test__';
let token;

function auth(requestBuilder) {
  return requestBuilder.set('Authorization', `Bearer ${token}`);
}

function newPassword() {
  return randomBytes(18).toString('base64url');
}

async function createProfessorFixture() {
  const password = newPassword();
  const username = `${testPrefix}${randomUUID()}`;

  const professor = await prisma.professor.create({
    data: {
      name: 'Professor de teste',
      username,
      password: await bcrypt.hash(password, 12)
    }
  });

  return { professor, password };
}

beforeEach(async () => {
  const { professor, password } = await createProfessorFixture();
  const response = await request(app).post('/auth/login').send({
    username: professor.username,
    password
  });

  token = response.body.token;
});

afterEach(async () => {
  await prisma.post.deleteMany({ where: { author: { startsWith: testPrefix } } });
  await prisma.student.deleteMany({ where: { username: { startsWith: testPrefix } } });
  await prisma.professor.deleteMany({ where: { username: { startsWith: testPrefix } } });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Autenticação e autorização', () => {
  it('autentica um professor e não retorna a senha', async () => {
    const { professor, password } = await createProfessorFixture();

    const response = await request(app).post('/auth/login').send({
      username: professor.username,
      password
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toEqual(expect.any(String));
    expect(response.body.professor).toMatchObject({ id: professor.id, username: professor.username });
    expect(response.body.professor).not.toHaveProperty('password');
  });

  it('rejeita credenciais inválidas', async () => {
    const response = await request(app).post('/auth/login').send({
      username: 'inexistente',
      password: newPassword()
    });

    expect(response.statusCode).toBe(401);
  });

  it('rejeita escrita de posts sem token e com token inválido', async () => {
    const payload = { title: 'Título', content: 'Conteúdo', author: `${testPrefix}autor` };

    const withoutToken = await request(app).post('/posts').send(payload);
    const invalidToken = await request(app)
      .post('/posts')
      .set('Authorization', 'Bearer inválido')
      .send(payload);

    expect(withoutToken.statusCode).toBe(401);
    expect(invalidToken.statusCode).toBe(401);
  });

  it('mantém a leitura de posts pública', async () => {
    const response = await request(app).get('/posts');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe('Posts protegidos', () => {
  it('permite a professor autenticado criar, editar e excluir um post', async () => {
    const created = await auth(request(app).post('/posts')).send({
      title: 'Título inicial',
      content: 'Conteúdo inicial',
      author: `${testPrefix}autor`
    });

    const updated = await auth(request(app).put(`/posts/${created.body.id}`)).send({
      title: 'Título atualizado',
      content: 'Conteúdo atualizado',
      author: `${testPrefix}autor`
    });

    const deleted = await auth(request(app).delete(`/posts/${created.body.id}`));

    expect(created.statusCode).toBe(201);
    expect(updated.statusCode).toBe(200);
    expect(updated.body.title).toBe('Título atualizado');
    expect(deleted.statusCode).toBe(200);
  });

  it('valida ID e campos obrigatórios de post', async () => {
    const invalidId = await auth(request(app).get('/posts/inválido'));
    const incomplete = await auth(request(app).post('/posts')).send({ title: 'Sem conteúdo' });

    expect(invalidId.statusCode).toBe(400);
    expect(incomplete.statusCode).toBe(400);
  });
});

describe('Professores', () => {
  it('executa CRUD sem expor senha ou hash', async () => {
    const username = `${testPrefix}${randomUUID()}`;
    const created = await auth(request(app).post('/professors')).send({
      name: 'Novo professor',
      username,
      password: newPassword()
    });

    const fetched = await auth(request(app).get(`/professors/${created.body.id}`));
    const updated = await auth(request(app).put(`/professors/${created.body.id}`)).send({ name: 'Professor atualizado' });
    const deleted = await auth(request(app).delete(`/professors/${created.body.id}`));

    expect(created.statusCode).toBe(201);
    expect(created.body).not.toHaveProperty('password');
    expect(fetched.statusCode).toBe(200);
    expect(fetched.body).not.toHaveProperty('password');
    expect(updated.body.name).toBe('Professor atualizado');
    expect(deleted.statusCode).toBe(200);
    expect(deleted.body.professor).not.toHaveProperty('password');
  });

  it('pagina professores e valida acesso, ID, recurso e campos obrigatórios', async () => {
    const unauthorized = await request(app).get('/professors');
    const missingFields = await auth(request(app).post('/professors')).send({ name: 'Sem usuário' });
    const invalidId = await auth(request(app).get('/professors/inválido'));
    const missingProfessor = await auth(request(app).get('/professors/999999999'));
    const page = await auth(request(app).get('/professors?page=1&limit=1'));

    expect(unauthorized.statusCode).toBe(401);
    expect(missingFields.statusCode).toBe(400);
    expect(invalidId.statusCode).toBe(400);
    expect(missingProfessor.statusCode).toBe(404);
    expect(page.statusCode).toBe(200);
    expect(page.body).toEqual(expect.objectContaining({
      data: expect.any(Array),
      pagination: expect.objectContaining({ page: 1, limit: 1, total: expect.any(Number), totalPages: expect.any(Number) })
    }));
  });
});

describe('Estudantes', () => {
  it('executa CRUD de estudantes', async () => {
    const username = `${testPrefix}${randomUUID()}`;
    const created = await auth(request(app).post('/students')).send({ name: 'Novo estudante', username });
    const fetched = await auth(request(app).get(`/students/${created.body.id}`));
    const updated = await auth(request(app).put(`/students/${created.body.id}`)).send({ name: 'Estudante atualizado' });
    const deleted = await auth(request(app).delete(`/students/${created.body.id}`));

    expect(created.statusCode).toBe(201);
    expect(fetched.statusCode).toBe(200);
    expect(updated.body.name).toBe('Estudante atualizado');
    expect(deleted.statusCode).toBe(200);
  });

  it('pagina estudantes e valida erros relevantes', async () => {
    const unauthorized = await request(app).get('/students');
    const missingFields = await auth(request(app).post('/students')).send({ name: 'Sem usuário' });
    const invalidId = await auth(request(app).get('/students/inválido'));
    const missingStudent = await auth(request(app).get('/students/999999999'));
    const invalidPage = await auth(request(app).get('/students?page=0'));
    const page = await auth(request(app).get('/students?page=1&limit=1'));

    expect(unauthorized.statusCode).toBe(401);
    expect(missingFields.statusCode).toBe(400);
    expect(invalidId.statusCode).toBe(400);
    expect(missingStudent.statusCode).toBe(404);
    expect(invalidPage.statusCode).toBe(400);
    expect(page.statusCode).toBe(200);
    expect(page.body.pagination).toMatchObject({ page: 1, limit: 1 });
  });
});
