const { spawn } = require("child_process");

function startProject() {
  const child = spawn("npm start", {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
  });

  child.on("close", (code) => {
    if (code == 2) {
      startProject();
    }
  });
}

startProject();
