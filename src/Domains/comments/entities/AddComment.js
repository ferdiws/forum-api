class AddComment {
  constructor(threadId, payload, userId) {
    this._verifyPayload(payload);
    this._verifyThread(threadId);
    this._verifyUser(userId);

    this.content = payload.content;
    this.threadId = threadId;
    this.userId = userId;
  }

  _verifyPayload({ content }) {
    if (!content) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string') {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _verifyThread(threadId) {
    if (!threadId) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }

  _verifyUser(userId) {
    if (!userId) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }
}

module.exports = AddComment;
