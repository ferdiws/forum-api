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

    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyUserAccess = jest.fn(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn(() => Promise.resolve());

    const getCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await getCommentUseCase.execute(threadId, commentId, userId);

    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.verifyAvailableComment).toHaveBeenCalledWith(commentId);
    expect(mockCommentRepository.verifyUserAccess).toHaveBeenCalledWith(commentId, userId);
    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(threadId, commentId, userId);
  });
});
