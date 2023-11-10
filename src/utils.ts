import {
  type ArgumentValues,
  type ArgumentValueTransformersMap,
  type PreparedCommand,
} from "./types.js";

const ARG_REPLACEMENTS = {
  filepath: "%filepath%",
  volume: "%volume%",
};

const COMMAND_REGEXP = /^(?<name>\S+)( (?<arguments>.+))?$/;

export function replaceArguments(command: string, args: ArgumentValues) {
  return Object.entries(args).reduce(
    (command, [name, value]) =>
      command.replace(new RegExp(`%${name}%`, "g"), String(value)),
    command,
  );
}

export function prepareCommand(command: string): PreparedCommand {
  const match = command.match(COMMAND_REGEXP);
  if (!match || !match.groups || !match.groups.name)
    throw new Error(`Invalid command: ${command}`);
  return {
    name: match.groups.name,
    arguments: match.groups.arguments ?? ARG_REPLACEMENTS.filepath,
  };
}

export function applyTransformer<K extends keyof ArgumentValues>(
  target: string,
  key: K,
  value: ArgumentValues[K],
  transformers?: ArgumentValueTransformersMap,
) {
  const transformer = transformers?.[target]?.[key] as any;
  if (transformer) return transformer(value);
  return value;
}
