const request = require('supertest');
const app = require('../../src/app');

test('Deve criar usuário via signup', async () => {
  const res = await request(app).post('/auth/signup')
    .send({ name: 'Leandro', mail: `${Date.now()}@mail.com`, passwd: '123456' });
  expect(res.status).toBe(201);
  expect(res.body.name).toBe('Leandro');
  expect(res.body).toHaveProperty('mail');
  expect(res.body).not.toHaveProperty('passwd');
});

test('Deve receber um token ao logar', async () => {
  const mail = `${Date.now()}@mail.com`;
  await app.services.user.save({ name: 'Leandro', mail, passwd: '123456' })
  const res = await request(app).post('/auth/signin').send({ mail, passwd: '123456' })
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('token');
});

test('Não deve autenticar usuário com senha errada', async () => {
  const mail = `${Date.now()}@mail.com`;
  await app.services.user.save({ name: 'Leandro', mail, passwd: '123456' })
  const res = await request(app).post('/auth/signin').send({ mail, passwd: '654321' })
  expect(res.status).toBe(400);
  expect(res.body.error).toBe('Usuário ou senha inválido');
});

test('Não deve autenticar usuário que não existe', async () => {
  const res = await request(app).post('/auth/signin').send({ mail: 'nãoexiste@mail.com', passwd: '654321' })
  expect(res.status).toBe(400);
  expect(res.body.error).toBe('Usuário ou senha inválido');
});

test('Não deve acessar uma rota protegida sem token', async () => {
  const res = await request(app).get('/v1/users')
  expect(res.status).toBe(401);
});