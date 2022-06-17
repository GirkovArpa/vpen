import { cwd } from '@sys';

const HOME = cwd().replace('this://app', '');

export function localizePath(path) {
  return 'file://' + `${HOME}/${path}`.replace(/[/\\]+/g, '/');
}
