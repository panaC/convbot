import { IcoreData } from './interface/data';
import { Ibot } from '../manager/interface/bot';
import { Icore } from './interface/core';
import { exec } from './exec';

export type Tgraph<Tname extends string, Tcontext extends string, Tconv> = {
  [n in Tname]?: Icore<Tname, Tcontext, Tconv>
};

export const coreFactory = <
  Tname extends string,
  Tcontext extends string,
  Tconv,
  Tdata extends IcoreData<Tname, Tcontext, Tconv>
>(
  graph: Tgraph<Tname, Tcontext, Tconv>
) => (bot: Ibot<Tconv, Tdata>) => {
  /**
   * Call by manager pipe
   * find the node and compute by recursivity until the return node
   */
  exec<Tname, Tcontext, Tconv>(graph, bot, 0);
  return bot;
};
