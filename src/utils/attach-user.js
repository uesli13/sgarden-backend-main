import jwt from "jsonwebtoken";
import Sentry from "@sentry/node";

import { User } from "../models/index.js";

const { SERVER_SECRET } = process.env;

const attachUser = async (req, res, next) => {
	try {
		// Get user token
		const token = req?.cookies?._token || req?.body?.token || req?.query?.token || req?.headers["x-access-token"];
		if (token) {
			// Decode token
			const decodedToken = jwt.verify(token, SERVER_SECRET);

			// Check if user exists
			const user = await User.findById(decodedToken.id).exec();
			if (user) {
				// Update active session date
				user.lastActiveAt = new Date();
				await user.save();

				// Get user info
				res.locals.user = { ...user.toObject(), jwt: token };
				return next();
			}

			return res.status(404).json({ message: "User not found." });
		}

		return res.status(401).json({ message: "No token provided." });
	} catch (error) {
		if (!(error instanceof jwt.TokenExpiredError)) Sentry.captureException(error);
		return res.status(401).json({ message: "Failed to authenticate user." });
	}
};

export default attachUser;
