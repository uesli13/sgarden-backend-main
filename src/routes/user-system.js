import express from "express";

import { validations, email } from "../utils/index.js";
import { User, Reset, Invitation } from "../models/index.js";

const router = express.Router();

router.post("/createUser",
	(req, res, next) => validations.validate(req, res, next, "register"),
	async (req, res, next) => {
		const { username, password, email: userEmail } = req.body;
		try {
			const user = await User.findOne({ $or: [{ username }, { email: userEmail }] });
			if (user) {
				return res.json({
					status: 409,
					message: "Registration Error: A user with that e-mail or username already exists.",
				});
			}

			await new User({
				username,
				password,
				email: userEmail,
			}).save();
			return res.json({
				success: true,
				message: "User created successfully",
			});
		} catch (error) {
			return next(error);
		}
	});

router.post("/createUserInvited",
	(req, res, next) => validations.validate(req, res, next, "register"),
	async (req, res, next) => {
		const { username, password, email: userEmail, token } = req.body;
		try {
			const invitation = await Invitation.findOne({ token });

			if (!invitation) {
				return res.json({
					success: false,
					message: "Invalid token",
				});
			}

			const user = await User.findOne({ $or: [{ username }, { email: userEmail }] });
			if (user) {
				return res.json({
					status: 409,
					message: "Registration Error: A user with that e-mail or username already exists.",
				});
			}

			await new User({
				username,
				password,
				email: userEmail,
			}).save();

			await Invitation.deleteOne({ token });

			return res.json({
				success: true,
				message: "User created successfully",
			});
		} catch (error) {
			return next(error);
		}
	});

router.post("/authenticate",
	(req, res, next) => validations.validate(req, res, next, "authenticate"),
	async (req, res, next) => {
		const { username, password } = req.body;
		try {
			const user = await User.findOne({ username }).select("+password");
			if (!user) {
				return res.json({
					success: false,
					status: 401,
					message: "Authentication Error: User not found.",
				});
			}

			if (!user.comparePassword(password, user.password)) {
				return res.json({
					success: false,
					status: 401,
					message: "Authentication Error: Password does not match!",
				});
			}

			return res.json({
				success: true,
				user: {
					username,
					id: user._id,
					email: user.email,
					role: user.role,
				},
				token: validations.jwtSign({ username, id: user._id, email: user.email, role: user.role }),
			});
		} catch (error) {
			return next(error);
		}
	});

router.post("/forgotpassword",
	(req, res, next) => validations.validate(req, res, next, "request"),
	async (req, res) => {
		try {
			const { username } = req.body;

			const user = await User.findOne({ username }).select("+password");
			if (!user) {
				return res.json({
					status: 404,
					message: "Resource Error: User not found.",
				});
			}

			if (!user?.password) {
				return res.json({
					status: 404,
					message: "User has logged in with google",
				});
			}

			const token = validations.jwtSign({ username });
			await Reset.findOneAndRemove({ username });
			await new Reset({
				username,
				token,
			}).save();

			await email.forgotPassword(user.email, token);
			return res.json({
				success: true,
				message: "Forgot password e-mail sent.",
			});
		} catch (error) {
			return res.json({
				success: false,
				message: error.body,
			});
		}
	});

router.post("/resetpassword", async (req, res) => {
	const { token, password } = req.body;

	try {
		const reset = await Reset.findOne({ token });

		if (!reset) {
			return res.json({
				status: 400,
				message: "Invalid Token!",
			});
		}

		const today = new Date();

		if (reset.expireAt < today) {
			return res.json({
				success: false,
				message: "Token expired",
			});
		}

		const user = await User.findOne({ username: reset.username });
		if (!user) {
			return res.json({
				success: false,
				message: "User does not exist",
			});
		}

		user.password = password;
		await user.save();
		await Reset.deleteOne({ _id: reset._id });

		return res.json({
			success: true,
			message: "Password updated succesfully",
		});
	} catch (error) {
		return res.json({
			success: false,
			message: error,
		});
	}
});

export default router;
