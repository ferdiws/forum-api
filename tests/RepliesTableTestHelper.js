const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123', threadId = 'thread-123', commentId = 'comment-123', content = 'sebuah balasan', owner = 'user-123', date = '2021-08-08T07:19:09.775Z', isDelete = 1,
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7)',
      values: [id, threadId, commentId, content, owner, date, isDelete],
    };

    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };
 
    const result = await pool.query(query);
    return result.rows;
  },

  async deleteReply(id) {
    const query = {
      text: 'UPDATE replies SET is_delete = 2 WHERE id = $1',
      values: [id],
    }

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE replies CASCADE');
  },
};

module.exports = RepliesTableTestHelper;