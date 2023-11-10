import { exec as execCb } from "node:child_process";
import { promisify } from "node:util";

import findExec from "find-exec";

import { BASE_ARGUMENT_TRANSFORMERS, DEFAULT_COMMANDS } from "./commands.js";
import {
  type ArgumentValues,
  type ArgumentValueTransformersMap,
  type PlayerOptions,
  type PlayOptions,
  type PreparedCommand,
  type SharedOptions,
} from "./types.js";
import { applyTransformer, prepareCommand, replaceArguments } from "./utils.js";

const exec = promisify(execCb);

/**
 * A "player" that can be used to play an audio file.
 *
 * @example
 *
 * ```ts
 * import { Player } from "cli-sound";
 *
 * try {
 *   const player = new Player();
 *   const audioPath = "test.mp3";
 * } catch (error) {
 *   console.error("An error occurred while playing the file:");
 *   console.error(error);
 * }
 * ```
 */
export class Player {
  #commands: PreparedCommand[];
  #command: PreparedCommand;
  #options: SharedOptions = {};
  #defaultArgumentValueTransformers: ArgumentValueTransformersMap =
    BASE_ARGUMENT_TRANSFORMERS;

  constructor({ commands, extendCommands, ...options }: PlayerOptions = {}) {
    if (commands && extendCommands)
      throw new Error(
        "Only one of 'commands' and 'extendCommands' can be specified",
      );
    const resolvedCommands = (commands =
      commands ?? extendCommands?.(DEFAULT_COMMANDS) ?? DEFAULT_COMMANDS);
    this.#commands = resolvedCommands.map(prepareCommand);

    const commandName = findExec(this.#commands.map((command) => command.name));
    const command = this.#commands.find(
      (command) => command.name === commandName,
    );
    if (!command) throw new Error("Couldn't find a suitable audio player");
    this.#command = command;

    if (options) this.#options = options;
  }

  #transformArgumentValue<K extends keyof ArgumentValues>(
    key: K,
    value: ArgumentValues[K],
    target: string,
    optionalTransformers?: ArgumentValueTransformersMap,
  ) {
    return [
      optionalTransformers,
      this.#defaultArgumentValueTransformers,
      this.#options.argumentValueTransformers,
      optionalTransformers,
    ].reduce(
      (outputValue, transformer) =>
        applyTransformer(target, key, outputValue, transformer),
      value,
    );
  }

  #transformArgumentValues(
    values: ArgumentValues,
    program: string,
    optionalTransformers?: ArgumentValueTransformersMap,
  ) {
    return Object.entries(values).reduce((values, [name, value]) => {
      let outputValue = value;

      // all
      outputValue = this.#transformArgumentValue(
        name as keyof ArgumentValues,
        outputValue,
        "all",
        optionalTransformers,
      ) as any;

      // program-specific
      outputValue = this.#transformArgumentValue(
        name as keyof ArgumentValues,
        outputValue,
        program,
        optionalTransformers,
      ) as any;

      return { ...values, [name]: outputValue };
    }, {} as ArgumentValues);
  }

  /**
   * Creates a command that can be used to play an audio file.
   *
   * Useful if you want to use your own method to play the audio file, or just
   * want to see what command will be used for debugging purposes.
   */
  createPlayCommand(filePath: string, options: PlayOptions = {}) {
    const resolvedCommand = [
      this.#command.name,
      this.#options.arguments?.[this.#command.name],
      options.arguments?.[this.#command.name],
      this.#command.arguments,
    ]
      .filter(Boolean)
      .join(" ");

    const transformedArgumentValues = this.#transformArgumentValues(
      { filepath: filePath, volume: options.volume ?? this.#options.volume },
      this.#command.name,
      this.#options.argumentValueTransformers,
    );

    return replaceArguments(resolvedCommand, transformedArgumentValues);
  }

  /**
   * Plays an audio file.
   *
   * When the command is done, the returned promise will be resolved with the
   * stdout and stderr of the command.
   */
  async play(filePath: string, options: PlayOptions = {}) {
    const command = this.createPlayCommand(filePath, options);
    return await exec(command);
  }
}
