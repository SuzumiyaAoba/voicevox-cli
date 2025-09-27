import { execSync } from "node:child_process";

// Docker が利用可能かチェック
const isDockerAvailable = (): boolean => {
  try {
    execSync("docker info", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
};

// VOICEVOX エンジンが既に起動しているかチェック
const isVoicevoxRunning = (): boolean => {
  try {
    const output = execSync("docker-compose ps --filter status=running", {
      encoding: "utf8",
    });
    return output.includes("voicevox-engine");
  } catch {
    return false;
  }
};

// VOICEVOX エンジンの起動を待機
const waitForVoicevox = async (maxWaitTime = 60000): Promise<void> => {
  const startTime = Date.now();
  const checkInterval = 2000; // 2秒間隔でチェック

  while (Date.now() - startTime < maxWaitTime) {
    try {
      const response = await fetch("http://localhost:50021/version");
      if (response.ok) {
        console.log("✅ VOICEVOX engine is ready");
        return;
      }
    } catch {
      // まだ準備できていない
    }

    console.log("⏳ Waiting for VOICEVOX engine to be ready...");
    await new Promise((resolve) => setTimeout(resolve, checkInterval));
  }

  throw new Error("❌ VOICEVOX engine failed to start within timeout period");
};

export async function setup(): Promise<void> {
  console.log("🚀 Setting up test environment...");

  if (!isDockerAvailable()) {
    console.warn("⚠️  Docker is not available. Skipping VOICEVOX engine setup.");
    console.warn("   Some integration tests may fail.");
    return;
  }

  if (isVoicevoxRunning()) {
    console.log("✅ VOICEVOX engine is already running");
    return;
  }

  try {
    console.log("🐳 Starting VOICEVOX engine...");
    execSync("docker-compose up -d voicevox-engine", {
      stdio: "inherit",
    });

    // エンジンの起動を待機
    await waitForVoicevox();
  } catch (error) {
    console.error("❌ Failed to start VOICEVOX engine:", error);
    throw error;
  }
}

export async function teardown(): Promise<void> {
  console.log("🧹 Cleaning up test environment...");

  if (!isDockerAvailable()) {
    return;
  }

  try {
    console.log("🛑 Stopping VOICEVOX engine...");
    execSync("docker-compose down", {
      stdio: "inherit",
    });
    console.log("✅ VOICEVOX engine stopped");
  } catch (error) {
    console.error("❌ Failed to stop VOICEVOX engine:", error);
    // teardownでのエラーは致命的ではないので、テストを失敗させない
  }
}
