const path = require("node:path");
const fs = require("node:fs");
const { spawnSync } = require("node:child_process");

if (process.platform !== "win32") {
  console.error("Use npm run android:debug:linux em macOS/Linux.");
  process.exit(1);
}
const root = path.resolve(__dirname, "..");
const sdk = process.env.ANDROID_HOME ||
  process.env.ANDROID_SDK_ROOT ||
  path.join(process.env.LOCALAPPDATA || "", "Android", "Sdk");
if (!fs.existsSync(path.join(sdk, "platform-tools"))) {
  console.error("Android SDK não encontrado. Instale o SDK pelo Android Studio.");
  process.exit(1);
}
const env = { ...process.env, ANDROID_HOME: sdk, ANDROID_SDK_ROOT: sdk };
const gradle = path.join(root, "android", "gradlew.bat");
if (!fs.existsSync(gradle)) {
  console.error("Projeto Android ausente. Execute npm run android:prepare primeiro.");
  process.exit(1);
}
function run(command, cwd) {
  console.log("Fluir QA:", command);
  const result = spawnSync("cmd.exe", ["/d", "/s", "/c", command], {
    cwd, env, stdio: "inherit"
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
run("npm.cmd run android:sync", root);
run("gradlew.bat :app:assembleDebug --no-daemon", path.join(root, "android"));
console.log("APK debug: " + path.join(root,
  "android", "app", "build", "outputs", "apk", "debug", "app-debug.apk"));
