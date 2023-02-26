const DetailThread = require('../DetailThread');
const DetailComment = require('../../../comments/entities/DetailComment');

describe('a DetailThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
    };

    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 123,
      comments: true,
    };

    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detailThread object correctly', () => {
    const comment1 = {
      id: 'comment-123',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      replies: [],
      is_delete: 1,
    };
    const comment2 = {
      id: 'comment-121',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      replies: [],
      is_delete: 1,
    };

    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        new DetailComment(comment1),
        new DetailComment(comment2),
      ],
    };

    const detailThread = new DetailThread(payload);

    expect(detailThread.id).toEqual(payload.id);
    expect(detailThread.title).toEqual(payload.title);
    expect(detailThread.body).toEqual(payload.body);
    expect(detailThread.date).toEqual(payload.date);
    expect(detailThread.username).toEqual(payload.username);
    expect(detailThread.comments.length).toEqual(payload.comments.length);
    expect(detailThread.comments[0]).toStrictEqual(payload.comments[0]);
    expect(detailThread.comments[1]).toStrictEqual(payload.comments[1]);
  });
});
