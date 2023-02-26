const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { threadId, content, userId } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, threadId, content, userId, date, 1],
    };
     
    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async verifyAvailableComment(commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('tidak dapat menghapus komentar karena komentar tidak ditemukan');
    }
  }

  async verifyUserAccess(commentId, userId) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (result.rows[0].owner !== userId) {
      throw new AuthorizationError('anda tidak memiliki hak untuk menghapus komentar ini');
    }
  }

  async deleteComment(threadId, commentId, userId) {
    const query = {
      text: 'UPDATE comments SET is_delete = 2 WHERE id = $1 AND thread_id = $2 AND owner = $3',
      values: [commentId, threadId, userId],
    };

    await this._pool.query(query);
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id, username, date, content, is_delete FROM comments INNER JOIN users 
        ON comments.owner = users.id WHERE comments.thread_id = $1 ORDER BY date ASC`,
      values: [threadId],
    };

    const { rows } = await this._pool.query(query);
    return rows;
  }
}

module.exports = CommentRepositoryPostgres;