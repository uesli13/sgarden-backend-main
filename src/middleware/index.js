export const setServerTimeout = (millis = 5 * 60 * 1000) => (req, res, next) => {
	req.setTimeout(millis, () => res.status(408).json({ message: "Request Timeout" }));
	res.setTimeout(millis, () => res.status(503).json({ message: "Service Unavailable" }));
	next();
};
