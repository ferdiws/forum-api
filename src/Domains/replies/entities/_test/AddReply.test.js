const AddReply = require('../AddReply');

describe('an AddReply entities', () =>  {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    expect(() => new AddReply(threadId, commentId, payload, userId)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      content: 123,
    };
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    
    expect(() => new AddReply(threadId, commentId, payload, userId)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when userId invalid', () => {
    const payload = {
      content: 'sebuah balasan',
    };
    const userId = '';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    expect(() => new AddReply(threadId, commentId, payload, userId)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when threadId invalid', () => {
    const payload = {
      content: 'sebuah balasan',
    };
    const userId = 'user-123';
    const threadId = '';
    const commentId = 'comment-123';

    expect(() => new AddReply(threadId, commentId, payload, userId)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when commentId invalid', () => {
    const payload = {
      content: 'sebuah balasan',
    };
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = '';

    expect(() => new AddReply(threadId, commentId, payload, userId)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should create addReply object correctly', () => {
    const payload = {
      content: 'sebuah balasan',
    };
    const fakeUserId = 'user-123';
    const fakeThreadId = 'thread-123';
    const fakeCommentId = 'comment-123';
    
    const { content, threadId, commentId, userId } = new AddReply(fakeThreadId, fakeCommentId, payload, fakeUserId);
    
    expect(content).toEqual(payload.content);
    expect(threadId).toEqual(fakeThreadId);
    expect(commentId).toEqual(fakeCommentId);
    expect(userId).toEqual(fakeUserId);
  });
});
