module.exports = {
	apps: [
		{
			name: "fe_ch1",
			script: "app.cjs",
			autorestart: true,
			watch: false,
			max_memory_restart: "1G",
		},
	],
};