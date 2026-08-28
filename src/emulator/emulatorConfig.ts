import type { OperatingSystem } from "@/config/operatingSystems";

/** Turn DEBUG on to surface extra emulator information in the UI. */
export const DEBUG = false;

export const EMULATOR_ASSETS = {
  wasm: "/emulator/v86.wasm",
  bios: "/emulator/seabios.bin",
  vgaBios: "/emulator/vgabios.bin",
  lib: "/emulator/libv86.mjs",
};

export const MEMORY_OPTIONS = [4, 8, 16, 32, 64, 128];

export const DEFAULT_MEMORY_MB = 16;
export const VGA_MEMORY_MB = 2;

const MB = 1024 * 1024;

export function buildV86Options(os: OperatingSystem, screenContainer: HTMLElement) {
  const memory = (os.memory ?? DEFAULT_MEMORY_MB) * MB;

  const media: Record<string, { url: string }> = {};
  if (os.type === "floppy") media["fda"] = { url: os.iso };
  else if (os.type === "hd") media["hda"] = { url: os.iso };
  else media["cdrom"] = { url: os.iso };

  return {
    wasm_path: EMULATOR_ASSETS.wasm,
    memory_size: memory,
    vga_memory_size: VGA_MEMORY_MB * MB,
    bios: { url: EMULATOR_ASSETS.bios },
    vga_bios: { url: EMULATOR_ASSETS.vgaBios },
    screen_container: screenContainer,
    autostart: true,
    disable_speaker: true,
    ...media,
  };
}
