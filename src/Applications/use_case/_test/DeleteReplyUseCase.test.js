const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const replyId = 'reply-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyAvailableReply = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyUserAccess = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn().mockImplementation(() => Promise.resolve());

    const getReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    await expect(getReplyUseCase.execute(threadId, commentId, replyId, userId)).resolves.not.toThrowError();

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(commentId);
    expect(mockReplyRepository.verifyAvailableReply).toBeCalledWith(replyId);
    expect(mockReplyRepository.verifyUserAccess).toBeCalledWith(replyId, userId);
    expect(mockReplyRepository.deleteReply).toBeCalledWith(threadId, commentId, replyId, userId);
  });
});
