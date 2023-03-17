const AddLike = require('../../Domains/likes/entities/AddLike');

class LikeUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(userId, threadId, commentId) {
    const newLike = new AddLike(userId, commentId);
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);
    const isLiked = await this._likeRepository.isLiked(userId, commentId);

    if (isLiked.length === 0) {
      await this._likeRepository.addLike(newLike);
    } else {
      await this._likeRepository.deleteLike(userId, commentId);
    }
  }
}

module.exports = LikeUseCase;
