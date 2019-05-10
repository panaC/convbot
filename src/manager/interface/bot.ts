
export interface Iid {
  session?: string;
  user?: string;
}

export interface Ibot<Tconv, Tdata> {
  /**
   * conv is compulsory and needeed to pass into all chain of middleware
   */
  conv: Tconv;
  // utterance: string;
  /*
  // all this will be inside middleware
  id: Iid;
  storage: Tstorage;
  nlp?: Tnlp;
  graph: Tgraph;
  */
  /**
   * middleware data
   */
  data: Tdata;
}