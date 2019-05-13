import { Icore } from './core';

export interface IcoreData<
  Tname extends string,
  Tcontext extends string,
  Tconv
> {
  nodeName: Tname;
  context: Tcontext;
}
