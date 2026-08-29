import { Schema, model, models } from "mongoose";

const WorkspaceSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    template: {
      type: String,
      enum: ["blank", "flowchart", "uml", "mindmap"],
      default: "blank",
    },

    isFavorite: {
      type: Boolean,
      default: false,
    },

    isTrashed: {
      type: Boolean,
      default: false,
    },

    collaborators: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    document: {
      version: { type: Number, default: 1 },
      title: { type: String, default: "Untitled" },
      author: { type: String, default: "Unknown" },
      content: { type: [Schema.Types.Mixed], default: [] },
      metadata: {
        wordCount: { type: Number, default: 0 },
        characterCount: { type: Number, default: 0 },
      },
    },
  },
  {
    timestamps: true,
  }
);

export default models.Workspace || model("Workspace", WorkspaceSchema);
