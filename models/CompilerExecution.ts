import mongoose, { Document, Model, Schema } from "mongoose";

export type CompilerExecutionLanguage = "c" | "cpp" | "java" | "python";
export type CompilerExecutionStatus = "running" | "successful" | "failed";

export interface ICompilerExecution extends Document {
  executionId: string;
  language: CompilerExecutionLanguage;
  sourceCode: string;
  status: CompilerExecutionStatus;
  createdAt: Date;
  completedAt?: Date;
  expiresAt: Date;
}

const CompilerExecutionSchema = new Schema<ICompilerExecution>(
  {
    executionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    language: {
      type: String,
      required: true,
      enum: ["c", "cpp", "java", "python"],
    },
    sourceCode: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["running", "successful", "failed"],
      default: "running",
      index: true,
    },
    completedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
      expires: 0,
    },
  },
  {
    timestamps: true,
  }
);

const CompilerExecution: Model<ICompilerExecution> =
  mongoose.models.CompilerExecution ||
  mongoose.model<ICompilerExecution>(
    "CompilerExecution",
    CompilerExecutionSchema
  );

export default CompilerExecution;
