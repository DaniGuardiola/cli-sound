import { type ArgumentValueTransformersMap } from "./types.js";

export const DEFAULT_COMMANDS = [
  'ffplay -autoexit -nodisp -af "volume=%volume%" %filepath%', // Linux, Windows, macOS
  "mpv --no-video --audio-display=no --volume=%volume% %filepath%", // Linux, Windows, macOS
  "mpg123 -g %volume% %filepath%", // Linux, Windows, macOS
  "mpg321 -g %volume% %filepath%", // Linux, macOS
  "mplayer -vo null -volume %volume% %filepath%", // Linux, Windows, macOS
  "afplay %filepath%", // macOS - untested
  "play -v %volume% %filepath%", // Linux, macOS (SoX package) - untested
  "omxplayer %filepath%", // Linux (specifically Raspberry Pi OS) - untested, volume `--vol` option is in millibels and I haven't looked into how to handle that
  "aplay %filepath%", // Linux (ALSA sound system)
  "cmdmp3 %filepath%", // Windows - untested
  "cvlc --gain=%volume% --play-and-exit %filepath%", // Linux, Windows, macOS - untested
  "powershell.exe -c (New-Object Media.SoundPlayer '%filepath%').PlaySync()", // Windows - untested
];

function clamped(
  fn: (value: number) => number,
  min: number = -Infinity,
  max: number = Infinity,
) {
  return (value: number) => Math.min(max, Math.max(min, fn(value)));
}

function volumePercent(value: number) {
  return value * 100;
}

export const BASE_ARGUMENT_TRANSFORMERS = {
  all: {
    filepath(value) {
      if (!value) throw new Error("No filepath specified");
      return value;
    },
    volume(value) {
      return Math.max(0, value ?? 1);
    },
  },
  mpv: { volume: clamped(volumePercent, 0, 1000) },
  mpg123: { volume: volumePercent },
  mpg321: { volume: volumePercent },
  mplayer: { volume: clamped(volumePercent, 0, 10000) },
} satisfies ArgumentValueTransformersMap;
