const AddComment = require('../../Domains/comments/entities/AddComment');
 
class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }
 
  async execute(threadId, useCasePayload, userId) {
    const addComment = new AddComment(threadId, useCasePayload, userId);
    await this._threadRepository.verifyAvailableThread(threadId);
    return this._commentRepository.addComment(addComment);
  }
}
 
module.exports = AddCommentUseCase;
