const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123', threadId = 'thread-123', content = 'sebuah comment', owner = 'user-123', date = new Date('2021-08-08T00:19:09.775Z'), isDelete = 1,
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, threadId, content, owner, date, isDelete],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };
 
    const result = await pool.query(query);
    return result.rows;
  },

  async deleteComment(id) {
    const query = {
      text: 'UPDATE comments SET is_delete = 2 WHERE id = $1',
      values: [id],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE comments CASCADE');
  },
};

module.exports = CommentsTableTestHelper;
