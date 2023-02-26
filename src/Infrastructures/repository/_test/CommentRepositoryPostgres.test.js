const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });
   
  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      const payload = {
        content: 'sebuah comment',
      };
      const userId = 'user-123';
      const threadId = 'thread-123';

      const newComment = new AddComment(threadId, payload, userId);
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await commentRepositoryPostgres.addComment(newComment);

      const results = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(results).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      const payload = {
        content: 'sebuah comment',
      };
      const userId = 'user-123';
      const threadId = 'thread-123';
      
      const newComment = new AddComment(threadId, payload, userId);
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const addedComment = await commentRepositoryPostgres.addComment(newComment);

      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyAvailableComment function', () => {
    it('should return error if comment is not found', async () => {
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await expect(commentRepositoryPostgres.verifyAvailableComment('comment-111')).rejects.toThrow(NotFoundError);
    });
  });

  describe('verifyUserAccess function', () => {
    it('should return error if user does not have access', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      const payload = {
        content: 'sebuah comment',
      };
      const userId = 'user-123';
      const threadId = 'thread-123';

      const newComment = new AddComment(threadId, payload, userId);
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await commentRepositoryPostgres.addComment(newComment);

      await expect(commentRepositoryPostgres.verifyUserAccess('comment-123', 'user-111')).rejects.toThrow(AuthorizationError);
    });
  });

  describe('deleteComment function', () => {
    it('should update is_delete to 1', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      const payload = {
        content: 'sebuah comment',
      };
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      
      const newComment = new AddComment(threadId, payload, userId);
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await commentRepositoryPostgres.addComment(newComment);

      await commentRepositoryPostgres.deleteComment(threadId, commentId, userId);

      const results = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(results[0].is_delete).toStrictEqual(2);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return detail comments correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      expect(comments[0].id).toEqual('comment-123');
      expect(comments[0].content).toEqual('sebuah comment');
      expect(comments[0].username).toEqual('dicoding');
    });
  });
});
