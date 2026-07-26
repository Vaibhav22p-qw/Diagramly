import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    diagramlyId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      default: null,
    },

    password: {
      type: String,
      default: null,
    },

    provider: {
      type: String,
      enum: ["manual", "google"],
      default: "manual",
    },

    avatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default models.User || model("User", UserSchema);