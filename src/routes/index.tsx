import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Header } from "@/components/Header";
import { Emulator, type EmulatorHandle, type VmState } from "@/components/Emulator";
import { VmControls } from "@/components/VmControls";
import { OsSelector } from "@/components/OsSelector";
import { StatusBar } from "@/components/StatusBar";
import { MobileKeyboard } from "@/components/MobileKeyboard";
import { defaultOs, type OperatingSystem } from "@/config/operatingSystems";
import { DEBUG } from "@/emulator/emulatorConfig";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vansh Box" },
      {
        name: "description",
        content:
          "Vansh Box is a tiny browser-based x86 virtual machine that boots Vansh OS and other small bootable ISO images.",
      },
      { property: "og:title", content: "Vansh Box" },
      {
        property: "og:description",
        content:
          "The tiny computer inside your browser. Boot Vansh OS in a retro 4:3 virtual machine.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VanshBox,
});

function VanshBox() {
  const [os, setOs] = useState<OperatingSystem>(defaultOs);
  const [state, setState] = useState<VmState>("STOPPED");
  const [error, setError] = useState<string | null>(null);
  const [keyboard, setKeyboard] = useState(false);
  const vm = useRef<EmulatorHandle>(null);
  const stage = useRef<HTMLDivElement>(null);

  const changeOs = (next: OperatingSystem) => {
    vm.current?.destroy();
    setError(null);
    setOs(next);
  };

  const fullscreen = () => {
    const el = stage.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen?.();
  };

  return (
    <main className="vb-app">
      <Header />

      <div className="vb-stage" ref={stage} onClick={() => vm.current?.focus()}>
        <Emulator ref={vm} os={os} state={state} onState={setState} onError={setError} />
      </div>

      <VmControls
        state={state}
        onStart={() => void vm.current?.start()}
        onStop={() => vm.current?.stop()}
        onReset={() => vm.current?.reset()}
        onKeyboard={() => setKeyboard((k) => !k)}
        onFullscreen={fullscreen}
      />

      <StatusBar os={os} state={state} error={error} />

      {keyboard && (
        <MobileKeyboard
          onKeys={(codes) => vm.current?.sendScancodes(codes)}
          onClose={() => setKeyboard(false)}
        />
      )}

      <OsSelector value={os} onChange={changeOs} disabled={state === "RUNNING"} />

      {DEBUG && (
        <pre className="vb-debug">{JSON.stringify({ os: os.id, iso: os.iso, state }, null, 1)}</pre>
      )}

      <footer className="vb-footer">Vansh Box v0.1</footer>
    </main>
  );
}
