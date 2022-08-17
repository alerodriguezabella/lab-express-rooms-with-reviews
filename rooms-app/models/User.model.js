const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required.']
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required.']
    },
    fullName: String
    // slack login - optional
    // slackID: String,
    // google login - optional
    // googleID: String
  },
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
