class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId, commentId, userId) {
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);
    await this._commentRepository.verifyUserAccess(commentId, userId);
    await this._commentRepository.deleteComment(threadId, commentId, userId);
  }
}

module.exports = DeleteCommentUseCase;
