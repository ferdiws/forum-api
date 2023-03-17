const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });
   
  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
  });

  describe('addComment function', () => {
    it('should persist add comment', async () => {
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

    it('should not throw error if comment is found', async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await expect(commentRepositoryPostgres.verifyAvailableComment('comment-123')).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyUserAccess function', () => {
    it('should return error if user does not have access', async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await expect(commentRepositoryPostgres.verifyUserAccess('comment-123', 'user-111')).rejects.toThrow(AuthorizationError);
    });

    it('should not throw error if user has access', async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await expect(commentRepositoryPostgres.verifyUserAccess('comment-123', 'user-123')).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteComment function', () => {
    it('should update is_delete to 1', async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await commentRepositoryPostgres.deleteComment(threadId, commentId, userId);

      const results = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(results[0].is_delete).toStrictEqual(2);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return detail comments correctly', async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      expect(comments).toStrictEqual([{
        id: 'comment-123',
        content: 'sebuah comment',
        username: 'dicoding',
        date: new Date('2021-08-08T00:19:09.775Z'),
        is_delete: 1,
      }]);
    });
  });
});
