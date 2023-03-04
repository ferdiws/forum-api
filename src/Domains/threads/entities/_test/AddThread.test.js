const AddThread = require('../AddThread');

describe('an AddThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'sebuah thread',
    };
    const userId = 'user-123';

    expect(() => new AddThread(payload, userId)).toThrow('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when userId invalid', () => {
    const payload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
    };
    const userId = '';

    expect(() => new AddThread(payload, userId)).toThrow('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      title: 123,
      body: 'sebuah body thread',
    };
    const userId = 'user-123';
    
    expect(() => new AddThread(payload, userId)).toThrow('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addThread object correctly', () => {
    const payload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
    };
    const fakeUserId = 'user-123';
    
    const { title, body, userId } = new AddThread(payload, fakeUserId);
    
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(userId).toEqual(fakeUserId);
  });
});
