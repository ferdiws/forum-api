class AddLike {
  constructor(userId, commentId) {
    this._verifyUser(userId);
    this._verifyComment(commentId);

    this.userId = userId;
    this.commentId = commentId;
  }
  
  _verifyUser(userId) {
    if (!userId) {
      throw new Error('ADD_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }

  _verifyComment(commentId) {
    if (!commentId) {
      throw new Error('ADD_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }
}
     
module.exports = AddLike;
