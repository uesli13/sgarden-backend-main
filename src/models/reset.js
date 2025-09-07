import mongoose from "mongoose";
import mongooseLeanDefaults from "mongoose-lean-defaults";

const { Schema } = mongoose;

// Create the user related schema
const resetSchema = new Schema(
	{
		username: {
			index: true,
			type: String,
			required: true,
			unique: "A token already exists for that username!",
			lowercase: true,
		},
		token: {
			type: String,
			required: true,
		},
		expireAt: {
			type: Date,
			default: new Date(Date.now() + (12 * 60 * 60 * 1000)),
			index: { expires: "12h" },
		},
	},
	{ timestamps: true, toObject: { versionKey: false } },
);

resetSchema.plugin(mongooseLeanDefaults.default);

export default mongoose.model("reset", resetSchema);
