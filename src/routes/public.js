import Sentry from "@sentry/node";
import express from "express";

const router = express.Router({ mergeParams: true });

router.get("/", (req, res) => {
	try {
		return res.json({ message: "It works!" });
	} catch (error) {
		Sentry.captureException(error);
		return res.status(500).json({ message: "Something went wrong." });
	}
});

export default router;
