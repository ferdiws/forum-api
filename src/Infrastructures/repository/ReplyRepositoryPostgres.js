const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply) {
    const { threadId, commentId, content, userId } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, threadId, commentId, content, userId, date, 1],
    };
     
    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async verifyAvailableReply(replyId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('tidak dapat menghapus balasan karena balasan tidak ditemukan');
    }
  }

  async verifyUserAccess(replyId, userId) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (result.rows[0].owner !== userId) {
      throw new AuthorizationError('anda tidak memiliki hak untuk menghapus balasan ini');
    }
  }

  async deleteReply(threadId, commentId, replyId, userId) {
    const query = {
      text: 'UPDATE replies SET is_delete = 2 WHERE id = $1 AND thread_id = $2 AND comment_id = $3 AND owner = $4',
      values: [replyId, threadId, commentId, userId],
    };

    await this._pool.query(query);
  }

  async getRepliesByThreadId(threadId) {
    const query = {
      text: `SELECT replies.id, comment_id, content, date, username, is_delete FROM replies INNER JOIN users 
        ON replies.owner = users.id WHERE replies.thread_id = $1 ORDER BY date ASC`,
      values: [threadId],
    };

    const { rows } = await this._pool.query(query);
    return rows;
  }
}

module.exports = ReplyRepositoryPostgres;
