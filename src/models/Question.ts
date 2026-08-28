import mongoose, { Document, Model, Schema } from "mongoose";

export interface IReply {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface IQuestion extends Document {
  _id: mongoose.Types.ObjectId;
  lesson: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  question: string;
  replies: IReply[];
  createdAt: Date;
  updatedAt: Date;
}

const replySchema = new Schema<IReply>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    text: {
      type: String,
      required: [true, "Reply text is required"],
      trim: true,
      maxlength: [2000, "Reply cannot exceed 2000 characters"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const questionSchema = new Schema<IQuestion>(
  {
    lesson: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
      required: [true, "Lesson is required"],
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    question: {
      type: String,
      required: [true, "Question text is required"],
      trim: true,
      maxlength: [2000, "Question cannot exceed 2000 characters"],
    },
    replies: [replySchema],
  },
  {
    timestamps: true,
  }
);

questionSchema.index({ lesson: 1, createdAt: -1 });
questionSchema.index({ course: 1, createdAt: -1 });

const Question: Model<IQuestion> =
  mongoose.models.Question || mongoose.model<IQuestion>("Question", questionSchema);

export default Question;
