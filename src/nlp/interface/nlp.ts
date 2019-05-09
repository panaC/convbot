
type Tlanguage = 'fr' | 'en';

export interface Inlp<Tname extends string, Tcontext extends string, Tconv> {
  context: Tcontext;
  nlp?: {
    nlu: {
      [n in Tlanguage]: string[];
    };
  };
}