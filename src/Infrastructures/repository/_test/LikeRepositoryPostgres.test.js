const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const AddLike = require('../../../Domains/likes/entities/AddLike');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
  });
     
  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });
  
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123' });
  });

  describe('addLike function', () => {
    it('should persist add like', async () => {
      const userId = 'user-123';
      const commentId = 'comment-123';

      const newLike = new AddLike(userId, commentId);
      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      await likeRepositoryPostgres.addLike(newLike);

      const results = await LikesTableTestHelper.findLikeById('like-123');
      expect(results).toHaveLength(1);
    });
  });

  describe('isLiked function', () => {
    it('should return empty array if comment does not liked', async () => {
      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      const likes = await likeRepositoryPostgres.isLiked('user-123', 'comment-123');

      expect(likes).toHaveLength(0);
    });

    it('should return with array if comment does not liked', async () => {
      await LikesTableTestHelper.addLike({ id: 'like-123' });
  
      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);
  
      const likes = await likeRepositoryPostgres.isLiked('user-123', 'comment-123');
  
      expect(likes).toHaveLength(1);
    });
  });

  describe('deleteLike function', () => {
    it('should delete like (unlike)', async () => {
      await LikesTableTestHelper.addLike({ id: 'like-123' });
      
      const userId = 'user-123';
      const commentId = 'comment-123';
      
      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      await likeRepositoryPostgres.deleteLike(userId, commentId);

      const results = await LikesTableTestHelper.findLikeById('like-123');
      expect(results).toHaveLength(0);
    });
  });

  describe('getLikeByThreadId function', () => {
    it('should return empty array (no like)', async () => {
      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      const likes = await likeRepositoryPostgres.getLikeByThreadId('thread-123');

      expect(likes).toHaveLength(0);
    });

    it('should not return empty array (comments have like)', async () => {
      await LikesTableTestHelper.addLike({ id: 'like-123' });
    
      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);
  
      const likes = await likeRepositoryPostgres.getLikeByThreadId('thread-123');
  
      expect(likes).toHaveLength(1);
    });
  });
});
