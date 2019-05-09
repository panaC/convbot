import { IcoreData } from './data';
import { Ibot } from '../../interface/bot';

export enum EnodeType {
  fallback,
  cancel,
  error,
}

export interface Icore<Tname extends string, Tcontext extends string, Tconv> {
  context: Tcontext;
  node: {
    return: boolean;
    type?: EnodeType;
    fct: (bot: Ibot<Tconv, IcoreData<Tname, Tcontext, Tconv>>) => Tname;
  };
}