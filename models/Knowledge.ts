import mongoose, { Schema, Document, Model } from "mongoose";

export interface IKnowledge extends Document {
  concept: string;
  intent: string;
  language: string;

  prompt: string;
  code: string;

  source: {
    type: "compiler" | "document" | "canvas";
    userId?: string;
    workspaceId?: string;
  };

  validation: {
    compiled: boolean;
    testsPassed: boolean;
    accepted: boolean;
  };

  usage: {
    timesRetrieved: number;
    timesAccepted: number;
  };

  tags: string[];

  createdAt: Date;
  updatedAt: Date;
}

const KnowledgeSchema = new Schema<IKnowledge>(
  {
    concept: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    intent: {
      type: String,
      required: true,
      trim: true,
    },

    language: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    prompt: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
    },

    source: {
      type: {
        type: String,
        enum: ["compiler", "document", "canvas"],
        required: true,
      },

      userId: {
        type: String,
      },

      workspaceId: {
        type: String,
      },
    },

    validation: {
      compiled: {
        type: Boolean,
        default: false,
      },

      testsPassed: {
        type: Boolean,
        default: false,
      },

      accepted: {
        type: Boolean,
        default: false,
      },
    },

    usage: {
      timesRetrieved: {
        type: Number,
        default: 0,
      },

      timesAccepted: {
        type: Number,
        default: 0,
      },
    },

    tags: {
      type: [String],
      default: [],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Knowledge: Model<IKnowledge> =
  mongoose.models.Knowledge ||
  mongoose.model<IKnowledge>("Knowledge", KnowledgeSchema);

export default Knowledge;