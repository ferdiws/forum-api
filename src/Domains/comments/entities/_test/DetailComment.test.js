const DetailComment = require('../DetailComment');

describe('a DetailComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'comment-123',
      username: 'johndoe',
      date: new Date('2021-08-08T00:19:09.775Z'),
      is_delete: 0,
    };

    expect(() => new DetailComment(payload)).toThrow('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'comment-123',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: 123,
      replies: [],
      is_delete: true,
    };

    expect(() => new DetailComment(payload)).toThrow('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detailComment object correctly', () => {
    const payload = {
      id: 'comment-123',
      username: 'johndoe',
      date: new Date('2021-08-08T00:19:09.775Z'),
      content: 'sebuah comment',
      replies: [],
      is_delete: 1,
    };

    const detailComment = new DetailComment(payload);

    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.content).toEqual(payload.content);
    expect(detailComment.replies).toEqual(payload.replies);
  });

  it('should create detailComment with deleted content object correctly', () => {
    const payload = {
      id: 'comment-123',
      username: 'johndoe',
      date: new Date('2021-08-08T00:19:09.775Z'),
      content: 'sebuah comment',
      replies: [],
      is_delete: 2,
    };

    const detailComment = new DetailComment(payload);

    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.content).toEqual('**komentar telah dihapus**');
    expect(detailComment.replies).toEqual(payload.replies);
  });
});
