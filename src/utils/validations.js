import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pipe } from "ramda";

import validationSchemas from "./validation-schemas.js";

// import commonJS module via default export
const { compareSync, hashSync, genSaltSync } = bcrypt;

const helpers = {
	passwordDigest: (password, saltWorkFactor = 10) => pipe(
		genSaltSync,
		(salt) => hashSync(password, salt),
	)(saltWorkFactor),
	comparePassword: (password, hash) => compareSync(password, hash),
	jwtSign: (payload) => jwt.sign(payload, process.env.SERVER_SECRET),
	minPassword: validationSchemas.minPassword,
	validate: async (req, res, next, schema) => {
		try {
			const { body } = req;
			await validationSchemas[schema].validate(body);
			return next();
		} catch (error) {
			return res.json({
				message: `Validation Error: ${error.errors[0]}`,
				status: 400,
			});
		}
	},
};

export default helpers;
