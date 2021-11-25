import { generate } from './generator';
import * as core from '@actions/core';

class change {
  module: string;
  old_version: string;
  new_version: string;
  constructor(module: string, old_version: string, new_version: string) {
    this.module = module;
    this.old_version = old_version;
    this.new_version = new_version;
  }
}

export async function run(): Promise<void> {
  const changes = core.getInput('changes');
  const token = core.getInput('token');
  const owner = core.getInput('owner');

  const changes_arr = changes.trim().split('\n');
  const changes_obj = changes_arr.map(
    (change_str) =>
      new change(
        change_str.substring(0, change_str.search(': ')).trim(),
        change_str
          .substring(change_str.search(': ') + 2, change_str.search(' -> '))
          .trim(),
        change_str.substring(change_str.search(' -> ') + 4).trim()
      )
  );

  const changes_str_arr = Promise.all(
    changes_obj.map((change) =>
      generate(
        change.module + ': ' + change.old_version + ' -> ' + change.new_version,
        owner + '/' + change.module,
        change.old_version,
        change.new_version,
        token
      )
    )
  );

  const changes_str = (await changes_str_arr).join('\n');
  core.setOutput('release_notes', await changes_str);
}
run();
