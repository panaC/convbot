
export interface InlpData<Tname extends string, Tcontext extends string, Tconv> {
  utterance: string;
  nodeName: Tname;
  context: Tcontext;
}