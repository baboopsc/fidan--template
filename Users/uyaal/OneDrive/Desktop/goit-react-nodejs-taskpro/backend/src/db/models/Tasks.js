import { Schema, model } from 'mongoose';

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Başlık alanı zorunludur'],
      trim: true,
      maxlength: [100, 'Başlık en fazla 100 karakter olabilir'],
    },
    description: {
      type: String,
      required: [true, 'Açıklama alanı zorunludur '],
      trim: true,
    },
    labelColor: {
      type: String,
      enum: ['blue', 'pink', 'green', 'gray'],
      default: 'gray',
    },
    deadline: {
      type: Date,
      required: [true, 'Teslim tarihi zorunludur'],
    },
    columnId: {
      type: String,
      required: true,
      default: 'todo',
    },
    boardId: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Task = model('Task', taskSchema);
