import type { OperatingSystem } from "@/config/operatingSystems";
import { EMULATOR_ASSETS, buildV86Options } from "./emulatorConfig";

/** Minimal shape of the v86 instance we use. */
export interface V86Instance {
  run(): void;
  stop(): void;
  restart(): void;
  destroy(): void;
  add_listener(event: string, cb: (data: unknown) => void): void;
  keyboard_send_scancodes(codes: number[]): void;
  keyboard_send_text(text: string): void;
  screen_set_scale?(x: number, y: number): void;
}

type V86Ctor = new (options: Record<string, unknown>) => V86Instance;

let ctorPromise: Promise<V86Ctor> | null = null;

/** Lazily loads the emulator engine. Nothing is fetched until first Start. */
export async function loadV86(): Promise<V86Ctor> {
  if (!ctorPromise) {
    // v86's browser build expects a Node-style `global`.
    const g = globalThis as unknown as Record<string, unknown>;
    g["global"] ??= globalThis;
    g["setImmediate"] ??= (fn: (...a: unknown[]) => void, ...args: unknown[]) =>
      setTimeout(() => fn(...args), 0);
    // Loaded through a runtime import so the ~350KB engine is only fetched
    // when the user actually starts the machine.
    ctorPromise = import("v86").then(
      (mod: Record<string, unknown>) => (mod["V86"] ?? mod["V86Starter"]) as V86Ctor,
    );
  }
  return ctorPromise;
}

/** Verifies the disk image actually exists before booting. */
export async function checkImage(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "HEAD" });
    if (!res.ok) return false;
    const type = res.headers.get("content-type") ?? "";
    // A dev server returning index.html means the file is missing.
    return !type.includes("text/html");
  } catch {
    return false;
  }
}

export async function checkEmulatorAssets(): Promise<boolean> {
  const assets = [EMULATOR_ASSETS.wasm, EMULATOR_ASSETS.bios, EMULATOR_ASSETS.vgaBios];
  const results = await Promise.all(assets.map(checkImage));
  return results.every(Boolean);
}

export async function createMachine(
  os: OperatingSystem,
  screenContainer: HTMLElement,
): Promise<V86Instance> {
  const V86 = await loadV86();
  return new V86(buildV86Options(os, screenContainer));
}
