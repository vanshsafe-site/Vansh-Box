export type OsType = "iso" | "floppy" | "hd";

export interface OperatingSystem {
  id: string;
  name: string;
  description: string;
  iso: string;
  type: OsType;
  /** RAM in megabytes */
  memory?: number;
  default?: boolean;
}

/**
 * Add a new operating system by dropping its image in public/isos/
 * and appending an entry here. Nothing else needs to change.
 */
export const operatingSystems: OperatingSystem[] = [
  {
    id: "vansh-os",
    name: "Vansh OS",
    description: "The default Vansh Box operating system.",
    iso: "/isos/vansh-os.iso",
    type: "iso",
    memory: 16,
    default: true,
  },
];

export const defaultOs = (operatingSystems.find((os) => os.default) ?? operatingSystems[0])!;
