const AddReply = require('../../Domains/replies/entities/AddReply');
 
class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }
 
  async execute(threadId, commentId, useCasePayload, userId) {
    const addReply = new AddReply(threadId, commentId, useCasePayload, userId);
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);
    return this._replyRepository.addReply(addReply);
  }
}
 
module.exports = AddReplyUseCase;
