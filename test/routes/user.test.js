const request = require('supertest');
const jwt = require('jwt-simple');

const app = require('../../src/app');

const MAIN_ROUTE = '/v1/users';
const mail = `${Date.now()}@mail.com`;
let user;

beforeAll(async () => {
  const res = await app.services.user.save({ name: 'User Account', mail: `${Date.now()}@mail.com`, passwd: '123456' });
  user = { ...res[0] };
  user.token = jwt.encode(user, 'Segredo!');
});

test('Deve listar todos os usuários', async () => {
  const res = await request(app).get(MAIN_ROUTE).set('authorization', `bearer ${user.token}`)
  expect(res.status).toBe(200);
  expect(res.body.length).toBeGreaterThan(0);
});

test('Deve inserir usuário com sucesso', async () => {
  const res = await request(app).post(MAIN_ROUTE)
    .send({ name: 'Tartarini', mail:mail, passwd: '123456' })
    .set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(201);
  expect(res.body.name).toBe('Tartarini');
  expect(res.body).not.toHaveProperty('passwd');
});

test('Deve armazenar a senha criptografada', async () => {
  const res = await request(app).post(MAIN_ROUTE)
    .send({ name: 'Leandro Tartarini', mail: `${Date.now()}@mail.com`, passwd: '123456'})
    .set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(201);

  const { id } = res.body;
  const userDB = await app.services.user.findOne({ id: id });
  expect(userDB.passwd).not.toBeUndefined();
  expect(userDB.passwd).not.toBe('123456');
})

test('Não deve inserir usuário sem nome', async () => {
  const res = await request(app).post(MAIN_ROUTE)
    .send({ mail: 'tartarini@mail.com', passwd: '123456' })
    .set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(400);
  expect(res.body.error).toBe('Nome é um atributo obrigatório');
});

test('Não deve inserir usuário sem email', async () => {
  const res = await request(app).post(MAIN_ROUTE)
    .send({ name: 'Tartarini', passwd: '123456' })
    .set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(400);
  expect(res.body.error).toBe('Email é um atributo obrigatório');
});

test('Não deve inserir usuário sem senha', async () => {
  const res = await request(app).post(MAIN_ROUTE)
    .send({ name: 'Tartarini', mail: 'tartarini@mail.com' })
    .set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(400);
  expect(res.body.error).toBe('Senha é um atributo obrigatório');
});

test('Não deve inserir usuário com email existente', async () => {
  const res = await request(app).post(MAIN_ROUTE)
    .send({ name: 'Tartarini', mail:mail, passwd: '123456' })
    .set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(400);
  expect(res.body.error).toBe('Já existe um usuário com esse email');
});