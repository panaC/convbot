import { Istorage } from './storage';

export interface Iid {
  session?: string;
  user?: string;
}

export interface Ibot<Tstorage = {}, Tnlp = {}, Tmiddleware = {}, Tconv = {}> {
  utterance: string;
  id: Iid;
  storage: Tstorage;
  nlp?: Tnlp;
  middleware?: Tmiddleware;
  conv?: Tconv;
}