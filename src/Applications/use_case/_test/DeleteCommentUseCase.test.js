const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyUserAccess = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn().mockImplementation(() => Promise.resolve());

    const getCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository
    });

    await expect(getCommentUseCase.execute(threadId, commentId, userId)).resolves.not.toThrowError();

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(commentId);
    expect(mockCommentRepository.verifyUserAccess).toBeCalledWith(commentId, userId);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(threadId, commentId, userId);
  });
});
