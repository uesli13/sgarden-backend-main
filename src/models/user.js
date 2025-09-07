import mongoose from "mongoose";
import mongooseLeanDefaults from "mongoose-lean-defaults";

import validations from "../utils/validations.js";

const { Schema } = mongoose;

// Create the user related schema
const userSchema = new Schema(
	{
		email: { type: String, required: true, unique: true },
		username: { type: String, required: true, unique: true },
		password: {
			type: String,
			select: false,
			minlength: validations.minPassword,
		},
		lastActiveAt: { type: Date, default: () => new Date() },
		role: { type: String, default: "user", enum: ["user", "admin"] },
	},
	{ timestamps: true, toObject: { versionKey: false } },
);

userSchema.plugin(mongooseLeanDefaults.default);

// Pre save hook that hashes passwords
userSchema.pre("save", function (next) {
	if (this.isModified("password")) {
		this.password = validations.passwordDigest(this.password);
	}

	return next();
});

// Model method that compares hashed passwords
userSchema.methods.comparePassword = function (password) {
	return validations.comparePassword(password, this.password);
};

export default mongoose.model("users", userSchema);
