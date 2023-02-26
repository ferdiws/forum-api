const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');
 
class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    
    const addedReply = await addReplyUseCase.execute(request.params.threadId, request.params.commentId, request.payload, request.auth.credentials.id);
 
    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);

    await deleteReplyUseCase.execute(request.params.threadId, request.params.commentId, request.params.replyId, request.auth.credentials.id);

    const response = h.response({
      status: 'success',
      message: 'balasan berhasil dihapus',
    });
    return response;
  }
}

module.exports = RepliesHandler;
