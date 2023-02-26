const AddThread = require('../../Domains/threads/entities/AddThread');
 
class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }
 
  async execute(useCasePayload, userId) {
    const addThread = new AddThread(useCasePayload, userId);
    return this._threadRepository.addThread(addThread);
  }
}
 
module.exports = AddThreadUseCase;