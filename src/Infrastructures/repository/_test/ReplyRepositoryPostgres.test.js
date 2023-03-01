const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });
   
  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist add reply', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const payload = {
        content: 'sebuah balasan',
      };
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      const newReply = new AddReply(threadId, commentId, payload, userId);
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await replyRepositoryPostgres.addReply(newReply);

      const results = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(results).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const payload = {
        content: 'sebuah balasan',
      };
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      
      const newReply = new AddReply(threadId, commentId, payload, userId);
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const addedReply = await replyRepositoryPostgres.addReply(newReply);

      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'sebuah balasan',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyAvailableReply function', () => {
    it('should return error if reply is not found', async () => {
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await expect(replyRepositoryPostgres.verifyAvailableReply('reply-111')).rejects.toThrow(NotFoundError);
    });

    it('should not throw error if reply is found', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123' });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await expect(replyRepositoryPostgres.verifyAvailableReply('reply-123')).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyUserAccess function', () => {
    it('should return error if user does not have access', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const payload = {
        content: 'sebuah balasan',
      };
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      const newReply = new AddReply(threadId, commentId, payload, userId);
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await replyRepositoryPostgres.addReply(newReply);

      await expect(replyRepositoryPostgres.verifyUserAccess('reply-123', 'user-111')).rejects.toThrow(AuthorizationError);
    });

    it('should not throw error if user has access', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123' });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await expect(replyRepositoryPostgres.verifyUserAccess('reply-123', 'user-123')).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteReply function', () => {
    it('should update is_delete to 1', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const payload = {
        content: 'sebuah balasan',
      };
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';
      
      const newReply = new AddReply(threadId, commentId, payload, userId);
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await replyRepositoryPostgres.addReply(newReply);

      await replyRepositoryPostgres.deleteReply(threadId, commentId, replyId, userId);

      const results = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(results[0].is_delete).toStrictEqual(2);
    });
  });

  describe('getRepliesByThreadId function', () => {
    it('should return detail replies correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123' });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      const replies = await replyRepositoryPostgres.getRepliesByThreadId('thread-123');

      expect(replies[0].id).toEqual('reply-123');
      expect(replies[0].content).toEqual('sebuah balasan');
      expect(replies[0].comment_id).toEqual('comment-123');
      expect(replies[0].username).toEqual('dicoding');
      expect(replies[0].date).toEqual('2021-08-08T07:19:09.775Z');
      expect(replies[0].is_delete).toEqual(1);
    });
  });
});