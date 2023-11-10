export type ArgumentValues = {
  filepath: string;
  volume?: number;
};

export type ArgumentValueTransformers = {
  [K in keyof ArgumentValues]?: (
    value: NonNullable<ArgumentValues[K]>,
  ) => NonNullable<ArgumentValues[K]>;
};

export type ArgumentValueTransformersAll = {
  [K in keyof ArgumentValues]?: (
    value: ArgumentValues[K],
  ) => NonNullable<ArgumentValues[K]>;
};

export type ArgumentValueTransformersMap = Record<
  string,
  ArgumentValueTransformers
>;

export type PreparedCommand = {
  name: string;
  arguments: string;
};

export type SharedOptions = {
  /**
   * A volume value between 0 and 1, where 1 is the loudest and 0 is the
   * quietest. Only supported by some players.
   *
   * Values higher than 1 are supported by some players.
   *
   * @default 1
   */
  volume?: number;

  /**
   * Additional arguments to pass to the audio player. Keys are the names of the
   * audio player and values are the arguments.
   *
   * The passed arguments will be prepended to the rest of the arguments.
   */
  arguments?: Record<string, string>;

  /**
   * Transformer functions for the values passed to the arguments of each audio
   * player.
   *
   * The top-level keys are the names of the audio players. The corresponding
   * values are objects that map arguments (by name) to transformer functions.
   *
   * The transformer functions will be called with the value of the argument and
   * should return the transformed value.
   *
   * The `all` special key can be used instead of the name of an audio player to
   * apply its transformers to all audio players.
   */
  argumentValueTransformers?: ArgumentValueTransformersMap;
};

export type PlayerOptions = SharedOptions & {
  /**
   * A list of commands that will be used to play the audio file.
   *
   * The first executable found will be used. Commands can be specified using
   * one of the following formats:
   *
   * - `command`
   * - `command <arguments>` where arguments must contain `%filepath%` and
   *   optionally `%volume%`
   */
  commands?: string[];

  /**
   * A function that will be called with the built-in commands and should return
   * a list of commands that will be used to play the audio file.
   *
   * The first executable found will be used. Commands can be specified using
   * one of the following formats:
   *
   * - `command`
   * - `command <arguments>` where arguments must contain `%filepath%` and
   *   optionally `%volume%`
   */
  extendCommands?: (defaultCommands: string[]) => string[];
};

export type PlayOptions = SharedOptions;
