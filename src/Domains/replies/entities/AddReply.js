class AddReply {
  constructor(threadId, commentId, payload, userId) {
    this._verifyPayload(payload);
    this._verifyThread(threadId);
    this._verifyComment(commentId);
    this._verifyUser(userId);

    this.content = payload.content;
    this.threadId = threadId;
    this.commentId = commentId;
    this.userId = userId;
  }

  _verifyPayload({ content }) {
    if (!content) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string') {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _verifyThread(threadId) {
    if (!threadId) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }

  _verifyComment(commentId) {
    if (!commentId) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }

  _verifyUser(userId) {
    if (!userId) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }
}

module.exports = AddReply;
