<p align="center">
  <img alt="The cli-sound logo" src="https://github.com/DaniGuardiola/cli-sound/raw/main/logo.png">
</p>

A simple utility to play sounds from Node.js programs, useful for (but not limited to) CLI apps.

It can also be used directly as a terminal command:

```sh
npm i -g cli-sound
cli-sound path/to/sound.mp3

# or
npx cli-sound path/to/sound.mp3
```

It works by executing a locally installed audio program without a graphical interface.

This package is inspired by [play-sound](https://github.com/shime/play-sound), but it goes to greater lengths to ensure good cross-operative-system support, provide volume control, customization, TypeScript types, ESM and CommonJS compatibility, and better reliability overall.

## <a name='Install'></a>Install

```
npm install cli-sound
```

## <a name='Example'></a>Example

```ts
import { Player } from "cli-sound";

const player = new Player();

await player.play("path/to/sound.mp3");
```

## <a name='Content'></a>Content

<!-- vscode-markdown-toc -->

- [Install](#install)
- [Example](#example)
- [Content](#content)
- [How it works](#how-it-works)
- [Usage](#usage)
  - [Creating the player](#creating-the-player)
  - [Playing a sound](#playing-a-sound)
- [Error handling](#error-handling)
- [Inspecting the command](#inspecting-the-command)
- [Contributing](#contributing)
- [Author](#author)

<!-- vscode-markdown-toc-config
	numbering=false
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

## <a name='Howitworks'></a>How it works

This package will go through a list of programs, find the first one available, and attempt to use it to play the sound. It uses the `exec` function from the `node:child_process` module internally.

The default list of programs is as follows:

- `ffplay` - Linux, Windows, macOS
- `mpv` - Linux, Windows, macOS
- `mpg123` - Linux, Windows, macOS
- `mpg321` - Linux, macOS
- `mplayer` - Linux, Windows, macOS
- `afplay` - macOS - _untested, volume control not supported_
- `play` - Linux, macOS (SoX package) - _untested_
- `omxplayer` - Linux (specifically Raspberry Pi OS) - _untested, volume control not supported_
- `aplay` - Linux (ALSA sound system) - _untested, volume control not supported_
- `cmdmp3` - Windows - _untested, volume control not supported_
- `cvlc` - Linux, Windows, macOS - _untested_
- `powershell` - Windows - _untested, volume control not supported_

## <a name='Usage'></a>Usage

### <a name='Creatingtheplayer'></a>Creating the player

```ts
import { Player } from "cli-sound";

const player = new Player();
```

When the player is created, the first available program is found and stored.

The `Player` constructor accepts an optional `options` object as an argument with the following properties:

**`commands`** - `string[]`

A list of commands that will be used to play the audio file.

The first executable found will be used. Commands can be specified using
one of the following formats:

- `command`
- `command <arguments>` where arguments must contain `%filepath%` and
  optionally `%volume%`

**`extendCommands`** - `(defaultCommands: string[]) => string[]`

A function that will be called with the built-in commands and should return
a list of commands that will be used to play the audio file.

The first executable found will be used. Commands can be specified using
one of the following formats:

- `command`
- `command <arguments>` where arguments must contain `%filepath%` and
  optionally `%volume%`

**`volume`** - `number` (default: `1`)

A volume value between 0 and 1, where 1 is the loudest and 0 is the
quietest. Only supported by some players.

Values higher than 1 are supported by some players.

**`arguments`** - `Record<string, string>`

Additional arguments to pass to the audio player. Keys are the names of the
audio player and values are the arguments.

The passed arguments will be prepended to the rest of the arguments.

**`argumentValueTransformers`** - `ArgumentValueTransformersMap`

Transformer functions for the values passed to the arguments of each audio
player.

The top-level keys are the names of the audio players. The corresponding
values are objects that map arguments (by name) to transformer functions.

The transformer functions will be called with the value of the argument and
should return the transformed value.

The `all` special key can be used instead of the name of an audio player to
apply its transformers to all audio players.

### <a name='Playingasound'></a>Playing a sound

```ts
await player.play("path/to/sound.mp3");
```

The `play` method accepts the path to the sound file as a string and returns a promise that resolves when the sound is finished playing. The resolved value is an object containing the `stdout` and `stderr` from the command's output.

The `play` method also accepts an optional `options` object as the second argument. It accepts the `volume`, `arguments` and `argumentValueTransformers` properties described above.

## <a name='Errorhandling'></a>Error handling

There are two points at which an error can occur:

- Creating the player (`new Player()`): happens if none of the programs are available.
- Playing a sound (`player.play()`): happens if the program command fails for some reason, including but not limited to the file not existing or being in the wrong format.

If succeeding in playing the sound is not critical, you can wrap the code in a try/catch block to prevent the failure from crashing your app.

> [!WARNING]
> Note that, since the package doesn't have a lot of control over the spawned programs, they may fail silently or behave in unexpected ways.

## <a name='Inspectingthecommand'></a>Inspecting the command

If you want to obtain the command that will be used to play the sound, you can use the `createPlayCommand` method:

```ts
console.log(player.createPlayCommand("path/to/sound.mp3"));
```

It takes the same arguments as the `play`` method, but it doesn't execute the command: it just returns it synchronously instead.

This can be useful for debugging or logging purposes, or if you want to use the command differently.

## <a name='Contributing'></a>Contributing

Install [bun](https://bun.sh/) and install dependencies with `bun i`.

You can run `bun run test` to test each of the commands on your machine, and get a report after it is done, along with success/error logs.

Contributions are welcome, especially those that add support for more programs/platforms. Bug fixes and feature additions are also highly appreciated.

## <a name='Author'></a>Author

`cli-sound` was built by [Dani Guardiola](https://dio.la/)
