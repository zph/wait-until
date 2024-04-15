#!/usr/bin/env deno run -A

import {$, CommandBuilder, Delay} from "jsr:@david/dax"

type PollUntilOptions = {
  count?: number,
  delay?: Delay,
  command?: CommandBuilder,
}
export async function pollUntilInternal({command, count = 10000, delay = "5s"}: PollUntilOptions) {
  await $.withRetries({
    count,
    delay: delay as Delay,
    action: async () => await command
  })
}


export async function pollUntil(message: string, command: CommandBuilder, onSuccess?: CommandBuilder, onFailure?: CommandBuilder, pollUntilInternalOptions?: PollUntilOptions) {
  const pb = $.progress(`Polling for ${message} to exit zero`);

  try {
    await pb.with(async () => {
      console.log(`Attempt at ${new Date()}`)
      await pollUntilInternal({...pollUntilInternal, ...{command}})
    });
    console.log(`%cSuccess: ${message}`, 'color: green')
    onSuccess && await onSuccess
  } catch (error) {
    console.warn(`%cError: ${error}`, 'color: red')
    onFailure && await onFailure
    Deno.exit(1)
  }

}
export async function main() {
  const [ command, onSuccess, onFailure ] = Deno.args;

  await pollUntil(command, $.raw`${command}`, $.raw`${onSuccess}`, $.raw`${onFailure}`, {count: 10000, delay: "5s", command: undefined})
  Deno.exit(0)
}

if (import.meta.main) {
  await main()
}
