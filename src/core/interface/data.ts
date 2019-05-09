import { Icore } from './core';

export interface IcoreData<Tname extends string, Tcontext extends string, Tconv> {
  nodeName: Tname;
  context: Tcontext;
  /*node: Icore<Tname, Tconv>;*/ // doesn't use , searching into graph with node name
}