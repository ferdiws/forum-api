const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });
   
  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
  });

  describe('addThread function', () => {
    it('should persist add Thread', async () => {
      const payload = {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      };
      const userId = 'user-123';

      const newThread = new AddThread(payload, userId);
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await threadRepositoryPostgres.addThread(newThread);

      const results = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(results).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      const payload = {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      };
      const userId = 'user-123';
      
      const newThread = new AddThread(payload, userId);
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'sebuah thread',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyAvailableThread function', () => {
    it('should return error if thread is not found', async () => {
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-111')).rejects.toThrow(NotFoundError);
    });

    it('should not throw error if thread is found', async () => {
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-123')).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('should return detail thread correctly', async () => {
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      expect(thread).toStrictEqual({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        username: 'dicoding',
        date: new Date('2021-08-08T00:19:09.775Z'),
      });
    });
  });
});
