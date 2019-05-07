import { Ibot } from './../../interface/bot';

export interface Inode<Tintent = {}, Tgraph = {}> {
  intent?: boolean;
  context?: string;
  return?: boolean;
  setup?: Tintent;
  fct: (bot: Ibot) => keyof Tgraph;
}