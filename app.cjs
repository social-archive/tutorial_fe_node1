const exec = require("child_process").exec;
const path = require("path");

const client = exec("npm run start", {
	windowsHide: true,
	cwd: path.join(__dirname, "./"),
});

client.stdout.pipe(process.stdout);
client.stderr.pipe(process.stderr);

// 에러 처리
client.on("error", (error) => {
	console.error("Error:", error);
});

// 프로세스 종료 처리
client.on("close", (code) => {
	console.log(`Child process exited with code ${code}`);
});