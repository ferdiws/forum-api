class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.username = payload.username;
    this.date = payload.date;
    this.content = payload.is_delete === 2 ? '**komentar telah dihapus**' : payload.content;
    this.replies = payload.replies;
  }

  _verifyPayload({ id, username, date, content, is_delete, replies }) {
    if (!id || !username || !date || !content || !is_delete || !replies) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof username !== 'string'
      || !(date instanceof Date)
      || typeof content !== 'string'
      || typeof is_delete !== 'number'
      || !Array.isArray(replies)
    ) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;
