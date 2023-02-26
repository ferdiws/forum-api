const DetailReply = require('../DetailReply');

describe('a DetailReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'reply-123',
      date: '2021-08-08T07:22:33.555Z',
      username: 'johndoe',
      is_delete: 0,
    };

    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'reply-123',
      content: 123,
      date: '2021-08-08T07:22:33.555Z',
      username: 'johndoe',
      is_delete: true,
    };

    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detailReply object correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'sebuah balasan',
      date: '2021-08-08T07:22:33.555Z',
      username: 'johndoe',
      is_delete: 1,
    };

    const detailReply = new DetailReply(payload);

    expect(detailReply.id).toEqual(payload.id);
    expect(detailReply.content).toEqual(payload.content);
    expect(detailReply.date).toEqual(payload.date);
    expect(detailReply.username).toEqual(payload.username);
  });

  it('should create detailReply with deleted content object correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'sebuah balasan',
      date: '2021-08-08T07:22:33.555Z',
      username: 'johndoe',
      is_delete: 2,
    };

    const detailReply = new DetailReply(payload);

    expect(detailReply.id).toEqual(payload.id);
    expect(detailReply.content).toEqual('**balasan telah dihapus**');
    expect(detailReply.date).toEqual(payload.date);
    expect(detailReply.username).toEqual(payload.username);
  });
});
