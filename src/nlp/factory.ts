import { InlpData } from './interface/data';
import { Ibot } from '../manager/interface/bot';
import { Inlp } from './interface/nlp';
import { NluManager } from 'node-nlp';

export type Tgraph<Tname extends string, Tcontext extends string, Tconv> = { [n in Tname]?: Inlp<Tname, Tcontext, Tconv>};

export const nlpFactory =
  async <Tname extends string, Tcontext extends string, Tconv, Tdata extends InlpData<Tname, Tcontext, Tconv>>(graph: Tgraph<Tname, Tcontext, Tconv>) => {

    const classifier = new NluManager({
      languages: Object.entries<Inlp<Tname, Tcontext, Tconv>>(graph as { [s: string]: Inlp<Tname, Tcontext, Tconv> })
        .reduce((p, c) => [...new Set([...p, ...((c) => {
          if (c[1].nlp) {
            return Object.keys(c[1].nlp.nlu);
          }
          return [] as string[];
        })(c)])], ['fr'])});

    Object.entries<Inlp<Tname, Tcontext, Tconv>>(graph as { [s: string]: Inlp<Tname, Tcontext, Tconv> }).map(o => {
      const [name, { nlp, context }] = o;
      if (nlp) {
        Object.entries(nlp.nlu).map(nlu => {
          const [lang, utterance] = nlu;
          if (utterance) {
            classifier.assignDomain(lang, name, context);
            utterance.map(ut => classifier.addDocument(lang, ut, name));
          }
        });
      }
    });
    await classifier.train();

    return ((bot: Ibot<Tconv, Tdata>): Ibot<Tconv, Tdata> => {
      const c = classifier.getClassifications(bot.data.utterance);
      bot.data.nodeName = c.intent;
      bot.data.context = c.domain; // be warn here // if intent found is None, they will be no context defined here // It need to have memory that set context before
      return bot;
    });
  };