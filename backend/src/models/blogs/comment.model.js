// Define a schema for a comment
const CommentSchema = new Schema(
    {
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // User who made the comment
      content: { type: String, required: true }, // The comment content
      createdAt: { type: Date, default: Date.now }, // Timestamp when comment was created
      updatedAt: { type: Date, default: Date.now }, // Timestamp for when comment was last updated
      edited: { type: Boolean, default: false }, // Whether the comment has been edited
      parentComment: { type: Schema.Types.ObjectId, ref: 'Comment', default: null }, // For nested comments (replies)
    },
    { timestamps: true }
);