const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');

const MAIN_ROUTE = '/v1/transactions';
let user;
let user2;
let accUser;
let accUser2;

beforeAll(async () => {
  await app.db('transactions').del();
  await app.db('accounts').del();
  await app.db('users').del();
  const users = await app.db('users').insert([
    { name: 'User #1', mail: 'user@mail.com', passwd: '$2b$10$sQD7ait/D52rUmPn0.fyWudcBWp5W6aY4SZeTzmf5APyr0OA.8FwK' },
    { name: 'User #2', mail: 'user2@mail.com', passwd: '$2b$10$sQD7ait/D52rUmPn0.fyWudcBWp5W6aY4SZeTzmf5APyr0OA.8FwK' },
  ], '*');
  [user, user2] = users;
  delete user.passwd;
  user.token = jwt.encode(user, 'Segredo!')
  const accs = await app.db('accounts').insert([
    { name: 'Acc #1', user_id: user.id },
    { name: 'Acc #2', user_id: user2.id },
  ], '*');
  [accUser, accUser2] = accs;
});

test('Deve listar apenas as transações do usuário', async () => {
  await app.db('transactions').insert([
    { description: 'T1', date: new Date(), ammount: 100, type: 'I', acc_id: accUser.id },
    { description: 'T2', date: new Date(), ammount: 300, type: 'O', acc_id: accUser2.id }
  ]);
  const res = await request(app).get(MAIN_ROUTE).set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
  expect(res.body[0].description).toBe('T1');
});

test('Deve inserir uma transação com sucesso', async () => {
  const res = await request(app).post(MAIN_ROUTE).set('authorization', `bearer ${user.token}`)
    .send({ description: 'New T', date: new Date(), ammount: 100, type: 'I', acc_id: accUser.id })
  expect(res.status).toBe(201);
  expect(res.body.acc_id).toBe(accUser.id);
  expect(res.body.ammount).toBe('100.00');
})