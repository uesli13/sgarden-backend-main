module.exports = {
	apps: [
		{
			name: "server",
			script: "npm",
			args: "start",
			env: {
				NODE_ENV: "production",
				PORT: 4000,
			},
		},
	],
};
