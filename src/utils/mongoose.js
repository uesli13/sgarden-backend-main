import "dotenv/config";

import Sentry from "@sentry/node";
import mongoose from "mongoose";

const init = async () => {
	const {
		DATABASE_URL = "mongodb://localhost:27017/testDB",
	} = process.env;

	mongoose.set("strictQuery", false);
	const connection = await mongoose.connect(DATABASE_URL).catch((error) => {
		Sentry.captureException(error);
		console.error(error.message);
		return null;
	});
	console.log("Connected to db!");

	return connection;
};

export default init;
