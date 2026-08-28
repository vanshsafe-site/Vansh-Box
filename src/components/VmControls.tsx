import type { VmState } from "./Emulator";

interface Props {
  state: VmState;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onKeyboard: () => void;
  onFullscreen: () => void;
}

export function VmControls({ state, onStart, onStop, onReset, onKeyboard, onFullscreen }: Props) {
  const live = state === "RUNNING" || state === "PAUSED";
  return (
    <div className="vb-controls">
      <button className="vb-btn" onClick={onStart} disabled={state === "RUNNING"}>
        {state === "PAUSED" ? "RESUME" : "START"}
      </button>
      <button className="vb-btn" onClick={onStop} disabled={state !== "RUNNING"}>
        STOP
      </button>
      <button className="vb-btn" onClick={onReset} disabled={!live}>
        RESET
      </button>
      <button className="vb-btn" onClick={onKeyboard} aria-label="Toggle virtual keyboard">
        KEYBOARD
      </button>
      <button className="vb-btn" onClick={onFullscreen} aria-label="Fullscreen screen">
        FULLSCREEN
      </button>
    </div>
  );
}
