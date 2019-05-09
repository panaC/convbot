import { IcoreData } from './interface/data';
import { Ibot } from './../interface/bot';
import { Icore } from './interface/core';
import { exec } from './exec';

export type Tgraph<Tname extends string, Tcontext extends string, Tconv> = { [n in Tname]?: Icore<Tname, Tcontext, Tconv>};

export const coreFactory =
  <Tname extends string, Tcontext extends string, Tconv>(graph: Tgraph<Tname, Tcontext, Tconv>) => 

  (bot: Ibot<Tconv, IcoreData<Tname, Tcontext, Tconv>>) => {
    /**
     * Call by manager pipe
     * find the node and compute by recursivity until the return node
     */
    exec<Tname, Tcontext, Tconv>(graph, bot, 0);
    return bot;
  };