const get_repositories = require('./get_repositories');

test('throws invalid number', async () => {
  


  await expect(get_repositories('foo')).rejects.toThrow('milliseconds not a number');
});

