const GetThreadUseCase = require('../GetThreadUseCase');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    const threadId = 'thread-123';

    const expectedThread = new DetailThread({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        new DetailComment({
          id: 'comment-123',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment',
          is_delete:1,
          replies: [
            new DetailReply({
              id: 'reply-123',
              comment_id: 'comment-123',
              content: 'sebuah balasan',
              date: '2021-08-08T07:22:33.555Z',
              username: 'johndoe',
              is_delete: 1,
            }),
            new DetailReply({
              id: 'reply-113',
              comment_id: 'comment-123',
              content: 'sebuah balasan',
              date: '2021-08-08T07:22:33.555Z',
              username: 'dicoding',
              is_delete: 2,
            }),
          ],
        }),
      ],
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    }));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comment-123',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment',
          is_delete:1,
        },
      ]));
    mockReplyRepository.getRepliesByThreadId = jest.fn().mockImplementation(() => Promise.resolve([
      {
        id: 'reply-123',
        comment_id: 'comment-123',
        content: 'sebuah balasan',
        date: '2021-08-08T07:22:33.555Z',
        username: 'johndoe',
        is_delete: 1,
      },
      {
        id: 'reply-113',
        comment_id: 'comment-123',
        content: 'sebuah balasan',
        date: '2021-08-08T07:22:33.555Z',
        username: 'dicoding',
        is_delete: 2,
      },
    ]));
    
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const thread = await getThreadUseCase.execute(threadId);

    expect(thread).toStrictEqual(expectedThread);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(threadId);
  });
});
