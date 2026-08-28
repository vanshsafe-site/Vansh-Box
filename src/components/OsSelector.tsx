import { operatingSystems, type OperatingSystem } from "@/config/operatingSystems";

interface Props {
  value: OperatingSystem;
  onChange: (os: OperatingSystem) => void;
  disabled?: boolean;
}

export function OsSelector({ value, onChange, disabled }: Props) {
  return (
    <div className="vb-os">
      <label htmlFor="vb-os-select">Operating System</label>
      <select
        id="vb-os-select"
        className="vb-select"
        value={value.id}
        disabled={disabled}
        onChange={(e) => {
          const next = operatingSystems.find((o) => o.id === e.target.value);
          if (next) onChange(next);
        }}
      >
        {operatingSystems.map((os) => (
          <option key={os.id} value={os.id}>
            {os.name}
          </option>
        ))}
      </select>
      <p className="vb-os-desc">{value.description}</p>
    </div>
  );
}
