const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
 
class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    
    const addedComment = await addCommentUseCase
      .execute(request.params.threadId, request.payload, request.auth.credentials.id);
 
    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);

    await deleteCommentUseCase
      .execute(request.params.threadId, request.params.commentId, request.auth.credentials.id);

    const response = h.response({
      status: 'success',
      message: 'komentar berhasil dihapus',
    });
    return response;
  }
}

module.exports = CommentsHandler;
