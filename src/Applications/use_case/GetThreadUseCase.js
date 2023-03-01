const DetailComment = require("../../Domains/comments/entities/DetailComment");
const DetailReply = require("../../Domains/replies/entities/DetailReply");
const DetailThread = require("../../Domains/threads/entities/DetailThread");

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyAvailableThread(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId) || [];
    const replies = await this._replyRepository.getRepliesByThreadId(threadId) || []; 

    thread.comments = this._mapAdditionalAttributes(
      comments,
      replies,
    );
    return new DetailThread(thread);
  }

  _mapAdditionalAttributes(comments, replies) {
    return comments.map((comment) => {
        comment.replies = replies
          .filter((reply) => reply.comment_id === comment.id).map((reply) => new DetailReply(reply));

        return new DetailComment(comment);
    });
  }
}

module.exports = GetThreadUseCase;
