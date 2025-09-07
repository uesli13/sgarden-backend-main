import mongoose from "mongoose";
import mongooseLeanDefaults from "mongoose-lean-defaults";

const { Schema } = mongoose;

// Create the invitations related schema
const inviteSchema = new Schema(
	{
		email: {
			index: true,
			type: String,
			required: true,
			unique: "A token already exists for that email!",
			lowercase: true,
		},
		token: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true, toObject: { versionKey: false } },
);

inviteSchema.plugin(mongooseLeanDefaults.default);

export default mongoose.model("invitation", inviteSchema);
