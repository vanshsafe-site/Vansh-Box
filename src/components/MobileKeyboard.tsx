import { useState } from "react";

interface Props {
  onKeys: (scancodes: number[]) => void;
  onClose: () => void;
}

/** set1 scancodes */
const SPECIAL: Array<[string, number]> = [
  ["ESC", 0x01],
  ["TAB", 0x0f],
  ["ENTER", 0x1c],
  ["BKSP", 0x0e],
  ["SPACE", 0x39],
  ["UP", 0x48],
  ["DOWN", 0x50],
  ["LEFT", 0x4b],
  ["RIGHT", 0x4d],
];

const MODIFIERS: Array<[string, number]> = [
  ["CTRL", 0x1d],
  ["ALT", 0x38],
  ["SHIFT", 0x2a],
];

const LETTERS: Record<string, number> = {
  a: 0x1e,
  b: 0x30,
  c: 0x2e,
  d: 0x20,
  e: 0x12,
  f: 0x21,
  g: 0x22,
  h: 0x23,
  i: 0x17,
  j: 0x24,
  k: 0x25,
  l: 0x26,
  m: 0x32,
  n: 0x31,
  o: 0x18,
  p: 0x19,
  q: 0x10,
  r: 0x13,
  s: 0x1f,
  t: 0x14,
  u: 0x16,
  v: 0x2f,
  w: 0x11,
  x: 0x2d,
  y: 0x15,
  z: 0x2c,
};

const DIGITS: Record<string, number> = {
  "1": 0x02,
  "2": 0x03,
  "3": 0x04,
  "4": 0x05,
  "5": 0x06,
  "6": 0x07,
  "7": 0x08,
  "8": 0x09,
  "9": 0x0a,
  "0": 0x0b,
};

const EXTENDED = new Set([0x48, 0x50, 0x4b, 0x4d]);

export function MobileKeyboard({ onKeys, onClose }: Props) {
  const [held, setHeld] = useState<number[]>([]);

  const press = (code: number) => {
    const seq: number[] = [];
    for (const mod of held) seq.push(mod);
    if (EXTENDED.has(code)) seq.push(0xe0, code, 0xe0, code | 0x80);
    else seq.push(code, code | 0x80);
    for (const mod of [...held].reverse()) seq.push(mod | 0x80);
    onKeys(seq);
    if (held.length) setHeld([]);
  };

  const toggleMod = (code: number) =>
    setHeld((h) => (h.includes(code) ? h.filter((c) => c !== code) : [...h, code]));

  return (
    <div className="vb-keyboard" aria-label="Virtual keyboard">
      <div className="vb-krow">
        {MODIFIERS.map(([label, code]) => (
          <button
            key={label}
            className={`vb-key${held.includes(code) ? " vb-key-on" : ""}`}
            aria-pressed={held.includes(code)}
            onClick={() => toggleMod(code)}
          >
            {label}
          </button>
        ))}
        {SPECIAL.map(([label, code]) => (
          <button key={label} className="vb-key" onClick={() => press(code)}>
            {label}
          </button>
        ))}
      </div>
      <div className="vb-krow">
        {Object.entries(DIGITS).map(([label, code]) => (
          <button key={label} className="vb-key" onClick={() => press(code)}>
            {label}
          </button>
        ))}
      </div>
      <div className="vb-krow">
        {Object.entries(LETTERS).map(([label, code]) => (
          <button key={label} className="vb-key" onClick={() => press(code)}>
            {label.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="vb-krow">
        <button className="vb-key" onClick={onClose}>
          CLOSE KEYBOARD
        </button>
      </div>
    </div>
  );
}
