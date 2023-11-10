import path from "node:path";
import { fileURLToPath } from "node:url";

import { DEFAULT_COMMANDS } from "../src/commands.js";
import { Player, type PlayOptions } from "../src/index.js";

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const AUDIO_PATH = path.resolve(CURRENT_DIR, "test.mp3");
const ENV_VOLUME = process.env.VOLUME as number | undefined;
const PLAY_OPTIONS: PlayOptions = { volume: ENV_VOLUME ?? 0.7 };
const TOTAL_PROGRAMS = DEFAULT_COMMANDS.length;

const successfulPrograms = new Set<string>();
const failedPrograms = new Set<string>();

console.log(`Using options: ${JSON.stringify(PLAY_OPTIONS)}\n`);

for (const command of DEFAULT_COMMANDS) {
  const program = command.split(" ")[0];
  console.log(`- ${program}`);

  try {
    const player = new Player({ commands: [command] });

    try {
      const command = player.createPlayCommand(AUDIO_PATH, PLAY_OPTIONS);
      console.log(`Command: ${command}`);

      const result = await player.play(AUDIO_PATH, PLAY_OPTIONS);
      successfulPrograms.add(program);
      console.log("Success! Output:\n");
      console.log(result);
      console.log("\n");
    } catch (error) {
      failedPrograms.add(program);
      console.error("Error (player.play):\n");
      console.error(error);
      console.log("\n");
    }
  } catch (error) {
    failedPrograms.add(program);
    console.error("Error (Player.constructor):\n");
    console.error(error);
    console.log("\n");
  }
}

console.log(`Tests complete! Options used: ${JSON.stringify(PLAY_OPTIONS)}`);
console.log(
  `Successful programs (${successfulPrograms.size}/${TOTAL_PROGRAMS}): ${[
    ...successfulPrograms.values(),
  ].join(", ")}`,
);

console.log(
  `Failed programs (${failedPrograms.size}/${TOTAL_PROGRAMS}): ${[
    ...failedPrograms.values(),
  ].join(", ")}`,
);
