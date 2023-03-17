const AddLike = require('../AddLike');

describe('an AddLike entities', () => {
  it('should throw error when userId invalid', () => {
    const userId = '';
    const commentId = 'comment-123';

    expect(() => new AddLike(userId, commentId)).toThrow('ADD_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when commentId invalid', () => {
    const userId = 'user-123';
    const commentId = '';

    expect(() => new AddLike(userId, commentId)).toThrow('ADD_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should create addLike object correctly', () => {
    const fakeUserId = 'user-123';
    const fakeCommentId = 'comment-123';
    
    const { userId, commentId } = new AddLike(fakeUserId, fakeCommentId);
    
    expect(userId).toEqual(fakeUserId);
    expect(commentId).toEqual(fakeCommentId);
  });
});
