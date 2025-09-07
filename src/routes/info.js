import Sentry from "@sentry/node";
import express from "express";

const router = express.Router({ mergeParams: true });

router.get("/hello", (req, res) => {
	try {
		return res.send("Hello world!");
	} catch (error) {
		Sentry.captureException(error);
		return res.status(500).json({ message: "Something went wrong." });
	}
});

export default router;
