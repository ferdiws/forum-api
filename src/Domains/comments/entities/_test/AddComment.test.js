const AddComment = require('../AddComment');

describe('an AddComment entities', () =>  {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};
    const userId = 'user-123';
    const threadId = 'thread-123';

    expect(() => new AddComment(threadId, payload, userId)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      content: 123,
    };
    const userId = 'user-123';
    const threadId = 'thread-123';
    
    expect(() => new AddComment(threadId, payload, userId)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when userId invalid', () => {
    const payload = {
      content: 'sebuah comment',
    };
    const userId = '';
    const threadId = 'thread-123';

    expect(() => new AddComment(threadId, payload, userId)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when threadId invalid', () => {
    const payload = {
      content: 'sebuah comment',
    };
    const userId = 'user-123';
    const threadId = '';

    expect(() => new AddComment(threadId, payload, userId)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should create addComment object correctly', () => {
    const payload = {
      content: 'sebuah comment',
    };
    const fakeUserId = 'user-123';
    const fakeThreadId = 'thread-123'
    
    const { content, threadId, userId } = new AddComment(fakeThreadId, payload, fakeUserId);
    
    expect(content).toEqual(payload.content);
    expect(threadId).toEqual(fakeThreadId);
    expect(userId).toEqual(fakeUserId);
  });
});
