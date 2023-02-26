const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('HTTP server', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted thread', async () => {
      const payload = {
        content: 'sebuah comment',
      };
      const token = await ServerTestHelper.getAccessToken();
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const payload = {};
      const token = await ServerTestHelper.getAccessToken();
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menambahkan komentar karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      const payload = {
        content: 123,
      };
      const token = await ServerTestHelper.getAccessToken();
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menambahkan komentar karena tipe data tidak sesuai');
    });

    it('should response 404 when thread not found', async () => {
      const payload = {
        content: 'sebuah comment',
      };
      const token = await ServerTestHelper.getAccessToken();
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-111/comments',
        payload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat mencari thread atau menambahkan/menghapus komentar karena thread tidak ditemukan');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and comment deleted', async () => {
      const token = await ServerTestHelper.getAccessToken();
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
            Authorization: `Bearer ${token}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 403 when user does not have access', async () => {
      const token = await ServerTestHelper.getAccessToken();
      await UsersTableTestHelper.addUser({ id: 'user-111', username: 'dicoding1' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-111' });
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
            Authorization: `Bearer ${token}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('anda tidak memiliki hak untuk menghapus komentar ini');
    });

    it('should response 404 when thread not found', async () => {
      const token = await ServerTestHelper.getAccessToken();
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-111/comments/comment-123',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat mencari thread atau menambahkan/menghapus komentar karena thread tidak ditemukan');
    });

    it('should response 404 when comment not found', async () => {
      const token = await ServerTestHelper.getAccessToken();
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-111',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menghapus komentar karena komentar tidak ditemukan');
    });
  });
});