class DeleteReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId, commentId, replyId, userId) {
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);
    await this._replyRepository.verifyAvailableReply(replyId)
    await this._replyRepository.verifyUserAccess(replyId, userId);
    await this._replyRepository.deleteReply(threadId, commentId, replyId, userId);
  }
}

module.exports = DeleteReplyUseCase;
