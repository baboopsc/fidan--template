import { Schema, model } from 'mongoose';

const columnSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 64,
    },

    cards: {
      type: [Schema.Types.Mixed],
      default: [],
    },
  },
  { _id: false }
);

const boardSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 64,
    },

    iconId: {
      type: String,
      default: 'grid',
    },

    backgroundId: {
      type: String,
      default: 'none',
    },

    backgroundPreview: {
      type: String,
      default: '',
    },

    columns: {
      type: [columnSchema],
      default: [],
    },
  },
  { _id: false }
);

const workspaceSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    boards: {
      type: [boardSchema],
      default: [],
    },
    activeBoardId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true, versionKey: false },
);


export const Workspace = model('Workspace', workspaceSchema);
