import type { OperatingSystem } from "@/config/operatingSystems";
import { DEFAULT_MEMORY_MB } from "@/emulator/emulatorConfig";
import type { VmState } from "./Emulator";

interface Props {
  os: OperatingSystem;
  state: VmState;
  error: string | null;
}

export function StatusBar({ os, state, error }: Props) {
  return (
    <div className="vb-status" role="status">
      <span>{os.name.toUpperCase()}</span>
      <span aria-label={`State ${state}`}>| {state} |</span>
      <span>x86 | {os.memory ?? DEFAULT_MEMORY_MB} MB RAM</span>
      {error && <pre className="vb-error">{error}</pre>}
    </div>
  );
}
