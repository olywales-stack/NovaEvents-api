import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { Networks } from "@stellar/stellar-sdk";

const REQUIRED_ENV = {
  STELLAR_RPC_URL: "https://soroban-testnet.stellar.org",
  NOVA_EVENTS_CONTRACT_ID: "CABTSQOXHOOAFFWBPDIXAPAL7KKV76WFL3WLGBUH6SLJ7R2BO5YNWKFU",
};

async function loadConfig() {
  vi.resetModules();
  const mod = await import("./config");
  return mod.default;
}

describe("config.networkPassphrase", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv, ...REQUIRED_ENV };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("defaults to the testnet passphrase when unset", async () => {
    delete process.env.STELLAR_NETWORK_PASSPHRASE;

    const config = await loadConfig();

    expect(config.networkPassphrase).toBe(Networks.TESTNET);
  });

  it("uses STELLAR_NETWORK_PASSPHRASE when set", async () => {
    process.env.STELLAR_NETWORK_PASSPHRASE = Networks.PUBLIC;

    const config = await loadConfig();

    expect(config.networkPassphrase).toBe(Networks.PUBLIC);
  });
});
