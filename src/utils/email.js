import sgMail from "@sendgrid/mail";

const {
	CLIENT_URL,
	SENDGRID_API_KEY,
	SENDGRID_EMAIL,
} = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = (data, email, templateId) => (
	sgMail.send({
		from: SENDGRID_EMAIL,
		templateId,
		to: email,
		dynamicTemplateData: data,
	})
);

const forgotPassword = (to, token) => {
	const msg = {
		from: SENDGRID_EMAIL,
		templateId: "d-1bd5ed666ba2403d9d635fcf8fc0ed29",

		to,

		dynamicTemplateData: {
			ResetPasswordUrl: `${CLIENT_URL}/reset-password?token=${token}`,
		},
	};

	return sgMail.send(msg);
};

const inviteUser = (to, token) => {
	const msg = {
		from: SENDGRID_EMAIL,
		templateId: "d-5ab96d63a78a446cbd17fcbbba7d8004",

		to,

		dynamicTemplateData: {
			InvitationUrl: `${CLIENT_URL}/register?token=${token}&email=${to}`,
		},
	};

	return sgMail.send(msg);
};

const email = {
	sendEmail,
	forgotPassword,
	inviteUser,
};

export default email;
