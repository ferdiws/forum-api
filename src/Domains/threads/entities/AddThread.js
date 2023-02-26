class AddThread {
  constructor(payload, userId) {
    this._verifyPayload(payload);
    this._verifyUser(userId);
 
    const { title, body } = payload;

    this.title = title;
    this.body = body;
    this.userId = userId;
  }

  _verifyPayload({ title, body }) {
    if (!title || !body) {
      throw new Error('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _verifyUser(userId) {
    if (!userId) {
      throw new Error('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }
}
   
module.exports = AddThread;
