
module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema


  const UserSchema = new Schema({
    __v: { type: Number, select: false },
    email: { type: String, required: true },
    passwd: { type: String, required: true, select: false },
    nickname: { type: String, required: true },
    avatar: { type: String, required: false, default: '/user.png' },
    following: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      default: [],
    },
    likeArticle: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
      default: [],

    },
    disLikeArticle: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
      default: [],

    },
  }, { timestamps: true })
  return mongoose.model('User', UserSchema)
}
