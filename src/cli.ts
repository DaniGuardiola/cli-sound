#!/usr/bin/env node
import path from "node:path";

import { Player } from "./player.js";

const args = process.argv.slice(2);

const HELP = `
Usage: cli-sound [options] <filepath>

Options:
  -v, --volume    Set the volume (0-1).
  -h, --help      Show this help message and exit.
`.trim();

if (args[0] === "-h" || args[0] === "--help") {
  console.log(HELP);
  process.exit(0);
}

let volume = 1;
let filePath: string;

if (args[0] === "-v" || args[0] === "--volume") {
  volume = Number(args[1]);
  filePath = args[2];
} else {
  filePath = args[0];
}

const absoluteFilePath = path.resolve(process.cwd(), filePath);

async function main() {
  try {
    const player = new Player({ volume });

    try {
      console.log(`Playing ${filePath}`);
      await player.play(absoluteFilePath);
    } catch (error) {
      console.error("There was an error playing the file:");
      console.error(error);
      process.exit(1);
    }
  } catch (error) {
    console.error("There was an error creating the player:");
    console.error(error);
    process.exit(1);
  }
}

main();
