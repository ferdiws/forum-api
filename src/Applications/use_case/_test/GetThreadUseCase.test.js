const GetThreadUseCase = require('../GetThreadUseCase');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    const threadId = 'thread-123';

    const expectedThread = new DetailThread({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: new Date('2021-08-08T00:19:09.775Z'),
      username: 'dicoding',
      comments: [
        new DetailComment({
          id: 'comment-123',
          username: 'johndoe',
          date: new Date('2021-08-08T00:19:09.775Z'),
          content: 'sebuah comment',
          is_delete: 1,
          likeCount: 2, 
          replies: [
            new DetailReply({
              id: 'reply-123',
              comment_id: 'comment-123',
              content: 'sebuah balasan',
              date: new Date('2021-08-08T00:19:09.775Z'),
              username: 'johndoe',
              is_delete: 1,
            }),
            new DetailReply({
              id: 'reply-113',
              comment_id: 'comment-123',
              content: 'sebuah balasan',
              date: new Date('2021-08-08T00:19:09.775Z'),
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
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: new Date('2021-08-08T00:19:09.775Z'),
      username: 'dicoding',
    }));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comment-123',
          username: 'johndoe',
          date: new Date('2021-08-08T00:19:09.775Z'),
          content: 'sebuah comment',
          is_delete: 1,
        },
      ]));
    mockReplyRepository.getRepliesByThreadId = jest.fn().mockImplementation(() => Promise.resolve([
      {
        id: 'reply-123',
        comment_id: 'comment-123',
        content: 'sebuah balasan',
        date: new Date('2021-08-08T00:19:09.775Z'),
        username: 'johndoe',
        is_delete: 1,
      },
      {
        id: 'reply-113',
        comment_id: 'comment-123',
        content: 'sebuah balasan',
        date: new Date('2021-08-08T00:19:09.775Z'),
        username: 'dicoding',
        is_delete: 2,
      },
    ]));
    mockLikeRepository.getLikeByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          comment_id: 'comment-123',
          likes: 2,
        },
      ]));
    
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    const thread = await getThreadUseCase.execute(threadId);

    expect(thread).toStrictEqual(expectedThread);
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toHaveBeenCalledWith(threadId);
    expect(mockLikeRepository.getLikeByThreadId).toHaveBeenCalledWith(threadId);
  });
});
