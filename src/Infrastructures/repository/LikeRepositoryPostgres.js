const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(newLike) {
    const { userId, commentId } = newLike;
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3)',
      values: [id, commentId, userId],
    };
     
    await this._pool.query(query);
  }

  async isLiked(userId, commentId) {
    const query = {
      text: 'SELECT * FROM likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };
  
    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteLike(userId, commentId) {
    const query = {
      text: 'DELETE FROM likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    await this._pool.query(query);
  }

  async getLikeByThreadId(threadId) {
    const query = {
      text: `SELECT likes.comment_id, COUNT(likes.id) AS likes FROM likes LEFT JOIN 
        comments ON comments.id = likes.comment_id INNER JOIN threads ON threads.id = comments.thread_id
        WHERE threads.id = $1 GROUP BY likes.comment_id`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = LikeRepositoryPostgres;
