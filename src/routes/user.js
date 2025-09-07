import express from "express";
import Sentry from "@sentry/node";

import { email, validations } from "../utils/index.js";
import { User, Invitation } from "../models/index.js";

const router = express.Router({ mergeParams: true });

router.get("/decode/", (req, res) => res.json(res.locals.user));

router.get("/attempt-auth/", (req, res) => res.json({ ok: true }));

router.get("/", async (req, res) => {
	try {
		const users = await User.find();
		return res.json({ success: true, users });
	} catch (error) {
		Sentry.captureException(error);
		return res.status(500).json({ message: "Something went wrong." });
	}
});

router.post("/",
	(req, res, next) => validations.validate(req, res, next, "invite"),
	async (req, res) => {
		try {
			const { email: userEmail } = req.body;

			const user = await User.findOne({ email: userEmail });
			if (user) {
				return res.json({
					success: false,
					message: "A user with this email already exists",
				});
			}

			const token = validations.jwtSign({ email: userEmail });
			await Invitation.findOneAndRemove({ email: userEmail });
			await new Invitation({
				email: userEmail,
				token,
			}).save();

			await email.inviteUser(userEmail, token);
			return res.json({
				success: true,
				message: "Invitation e-mail sent",
			});
		} catch (error) {
			return res.json({
				success: false,
				message: error.body,
			});
		}
	});

router.post("/delete", async (req, res) => {
	try {
		const { id } = req.body;
		const user = await User.findByIdAndDelete(id);
		if (user) {
			return res.json({ success: true });
		}

		return res.json({ success: false });
	} catch (error) {
		Sentry.captureException(error);
		return res.status(500).json({ message: "Something went wrong." });
	}
});

router.post("/role", async (req, res) => {
	try {
		const { id, role } = req.body;
		const user = await User.findByIdAndUpdate(id, { role });
		if (user) {
			return res.json({ success: true });
		}

		return res.json({ success: false });
	} catch (error) {
		Sentry.captureException(error);
		return res.status(500).json({ message: "Something went wrong." });
	}
});

export default router;
