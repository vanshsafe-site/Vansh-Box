import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import type { OperatingSystem } from "@/config/operatingSystems";
import {
  checkEmulatorAssets,
  checkImage,
  createMachine,
  type V86Instance,
} from "@/emulator/emulator";

export type VmState = "STOPPED" | "STARTING" | "RUNNING" | "PAUSED" | "ERROR";

export interface EmulatorHandle {
  start(): Promise<void>;
  stop(): void;
  reset(): void;
  destroy(): void;
  sendScancodes(codes: number[]): void;
  focus(): void;
}

interface Props {
  os: OperatingSystem;
  state: VmState;
  onState: (s: VmState) => void;
  onError: (message: string | null) => void;
}

export const Emulator = forwardRef<EmulatorHandle, Props>(function Emulator(
  { os, state, onState, onError },
  ref,
) {
  const screenRef = useRef<HTMLDivElement>(null);
  const vmRef = useRef<V86Instance | null>(null);

  const destroy = () => {
    try {
      vmRef.current?.destroy();
    } catch {
      /* emulator already gone */
    }
    vmRef.current = null;
    if (screenRef.current) screenRef.current.innerHTML = "";
  };

  useEffect(() => destroy, []);

  useImperativeHandle(ref, () => ({
    async start() {
      if (vmRef.current) {
        vmRef.current.run();
        onState("RUNNING");
        return;
      }
      const container = screenRef.current;
      if (!container) return;
      onError(null);
      onState("STARTING");

      if (!(await checkEmulatorAssets())) {
        onState("ERROR");
        onError("Vansh Box emulator assets are incomplete. Check public/emulator.");
        return;
      }
      if (!(await checkImage(os.iso))) {
        onState("ERROR");
        onError(`${os.name} image not found.\nExpected: ${os.iso}`);
        return;
      }
      if (typeof WebAssembly === "undefined") {
        onState("ERROR");
        onError("This browser does not support WebAssembly, which Vansh Box needs.");
        return;
      }
      try {
        const vm = await createMachine(os, container);
        vmRef.current = vm;
        vm.add_listener("emulator-started", () => onState("RUNNING"));
        onState("RUNNING");
      } catch {
        destroy();
        onState("ERROR");
        onError("Vansh Box could not start the virtual machine.");
      }
    },
    stop() {
      if (!vmRef.current) return;
      vmRef.current.stop();
      onState("PAUSED");
    },
    reset() {
      if (!vmRef.current) return;
      try {
        vmRef.current.restart();
        onState("RUNNING");
      } catch {
        onState("ERROR");
        onError("The selected image could not be booted.");
      }
    },
    destroy() {
      destroy();
      onState("STOPPED");
    },
    sendScancodes(codes) {
      vmRef.current?.keyboard_send_scancodes(codes);
    },
    focus() {
      screenRef.current?.querySelector("canvas")?.focus();
      screenRef.current?.focus();
    },
  }));

  const idle = state === "STOPPED" || state === "ERROR";

  return (
    <div className="vb-monitor">
      <div className="vb-screen" tabIndex={0} aria-label="Virtual computer screen">
        <div ref={screenRef} className="vb-screen-inner">
          {/* v86 renders text mode into the div and graphics into the canvas */}
          <div className="vb-text" />
          <canvas />
        </div>
        {idle && (
          <pre className="vb-boot" aria-live="polite">{`VANSH BOX BIOS

Vansh Box Virtual Computer
Memory Test ........ OK
CPU ................. OK
Display ............. OK
Storage ............. OK

Boot device:
${os.name}

${state === "ERROR" ? "Halted." : "Press START..."}`}</pre>
        )}
        {state === "STARTING" && <pre className="vb-boot">Starting...</pre>}
        <div className="vb-scanlines" aria-hidden />
      </div>
    </div>
  );
});
