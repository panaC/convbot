export interface Iid {
  session?: string;
  user?: string;
}

export interface Ibot<Tconv, Tdata> {
  /**
   * conv is compulsory and needeed to pass into all chain of middleware
   */
  conv: Tconv;
  /**
   * middleware data
   */
  data: Tdata;
}
