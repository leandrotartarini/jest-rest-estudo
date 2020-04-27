test('Devo conhecer as principais assertivas do jest', () => {
  let number = null;
  expect(number).toBeNull();
  number = 10;
  expect(number).not.toBeNull();
  expect(number).toBe(10);
  expect(number).toEqual(10);
  expect(number).toBeGreaterThan(9);
  expect(number).toBeLessThan(11);
});

test('Devo saber trabalhar com objetos', () =>{
  const obj = { name: 'Leandro', mail: 'leandro@mail.com' };
  expect(obj).toHaveProperty('name');
  expect(obj).toHaveProperty('name', 'Leandro');
  expect(obj.name).toBe('Leandro');

  const obj2 = { name: 'Leandro', mail: 'leandro@mail.com' };
  expect(obj).toEqual(obj2);
  expect(obj).toBe(obj);
});