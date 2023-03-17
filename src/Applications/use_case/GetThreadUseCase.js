const DetailComment = require('../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../Domains/replies/entities/DetailReply');
const DetailThread = require('../../Domains/threads/entities/DetailThread');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyAvailableThread(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId) || [];
    const replies = await this._replyRepository.getRepliesByThreadId(threadId) || []; 
    const likes = await this._likeRepository.getLikeByThreadId(threadId);

    thread.comments = this._mapAdditionalAttributes(
      comments,
      replies,
      likes,
    );
    return new DetailThread(thread);
  }

  _mapAdditionalAttributes(comments, replies, likeArray) {
    return comments.map((comment) => {
      comment.replies = replies
        .filter((reply) => reply.comment_id === comment.id)
        .map((reply) => new DetailReply(reply));

      const like = likeArray.find((item) => item.comment_id === comment.id);
      comment.likeCount = like !== undefined ? like.likes : 0;

      return new DetailComment(comment);
    });
  }
}

module.exports = GetThreadUseCase;
