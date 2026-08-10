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
  },
  {
    timestamps: true,
  }
);

export default models.Workspace || model("Workspace", WorkspaceSchema);