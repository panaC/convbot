export type Tgraph<Tname extends string, T1> = { [n in Tname]?: T1 };

export type Tgraph1<Tname extends string, T1> = { [n in Tname]?: T1 };

export type Tgraph2<Tname extends string, T1, T2> = { [n in Tname]?: T1 & T2 };

export type Tgraph3<Tname extends string, T1, T2, T3> = {
  [n in Tname]?: T1 & T2 & T3
};

export type Tgraph4<Tname extends string, T1, T2, T3, T4> = {
  [n in Tname]?: T1 & T2 & T3 & T4
};

export type Tgraph5<Tname extends string, T1, T2, T3, T4, T5> = {
  [n in Tname]?: T1 & T2 & T3 & T4 & T5
};
