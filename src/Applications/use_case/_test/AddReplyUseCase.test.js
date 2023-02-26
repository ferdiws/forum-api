const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    const useCasePayload = {
      content: 'sebuah balasan',
    };
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: userId,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedReply));

    const getReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository
    });

    const addedReply = await getReplyUseCase.execute(threadId, commentId, useCasePayload, userId);

    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(commentId);
    expect(mockReplyRepository.addReply).toBeCalledWith(new AddReply(threadId, commentId, useCasePayload, userId));
  });
});