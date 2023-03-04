class DetailReply {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.content = payload.is_delete === 2 ? '**balasan telah dihapus**' : payload.content;
    this.date = payload.date;
    this.username = payload.username;
  }

  _verifyPayload({ id, content, date, username, is_delete }) {
    if (!id || !content || !date || !username || !is_delete) {
      throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof content !== 'string'
      || !(date instanceof Date)
      || typeof username !== 'string'
      || typeof is_delete !== 'number'
    ) {
      throw new Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailReply;
