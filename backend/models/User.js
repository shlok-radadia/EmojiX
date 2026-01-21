import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },

    email: {
      type: String,
      unique: true,
    },

    password: {
      type: String,
    },

    coins: {
      type: Number,
      default: 1000,
    },

    runPosition: {
      x: {
        type: Number,
        default: 0,
      },
      y: {
        type: Number,
        default: 0,
      },
    },

    lastDailyClaim: {
      type: Date,
      default: null,
    },

    stepsSinceReward: {
      type: Number,
      default: 0,
    },

    equippedItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserItem",
      default: null,
    },

    questProgressBuffer: {
      move: { type: Number, default: 0 },
      catch: { type: Number, default: 0 },
      sell: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = function (pw) {
  return bcrypt.compare(pw, this.password);
};

export default mongoose.model("User", userSchema);
