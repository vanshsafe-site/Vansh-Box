Vansh Box
=========

A lightweight browser-based x86 virtual machine. The guest OS really executes,
inside the v86 WebAssembly x86 emulator — nothing is faked.

Adding an ISO
-------------

Put the ISO inside:

    public/isos/

Then add it to `src/config/operatingSystems.ts`:

    {
      id: "my-os",
      name: "My OS",
      description: "My experimental operating system.",
      iso: "/isos/my-os.iso",
      type: "iso",     // "iso" | "floppy" | "hd"
      memory: 16       // MB
    }

Start Vansh Box and select the OS.

Vansh OS
--------

The default entry expects `public/isos/vansh-os.iso`. If the file is missing,
the UI shows "Vansh OS image not found." instead of crashing.

Emulator assets
---------------

`public/emulator/` holds `libv86.mjs`, `v86.wasm`, `v86-fallback.wasm`,
`seabios.bin` and `vgabios.bin`. They are loaded lazily, only when you press
START. The app checks these assets before attempting to boot the guest.
