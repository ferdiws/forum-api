const GetThreadUseCase = require('../GetThreadUseCase');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    const reply1 = {
      id: 'reply-123',
      comment_id: 'comment-123',
      content: 'sebuah balasan',
      date: '2021-08-08T07:22:33.555Z',
      username: 'johndoe',
      is_delete: 1,
    }
    const reply2 = {
      id: 'reply-113',
      comment_id: 'comment-123',
      content: 'sebuah balasan',
      date: '2021-08-08T07:22:33.555Z',
      username: 'dicoding',
      is_delete: 2,
    }

    const comment = {
      id: 'comment-123',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      is_delete:1,
      replies: [
        new DetailReply(reply1),
        new DetailReply(reply2),
      ]
    };
    const threadId = 'thread-123';

    const mockComment = new DetailComment(comment);

    const mockThread = new DetailThread({
      id: threadId,
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        mockComment,
      ],
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread.comments.forEach((_, index, array) => {
        delete array[index].replies;
      })));
    mockReplyRepository.getRepliesByThreadId = jest.fn().mockImplementation(() => Promise.resolve(mockComment.replies));
    
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const thread = await getThreadUseCase.execute(threadId);

    expect(thread).toStrictEqual(mockThread);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(threadId);
  });
});
