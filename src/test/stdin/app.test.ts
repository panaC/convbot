import { coreFactory } from '../../core/factory';
import { nlpFactory } from '../../nlp/factory';
import { InlpData } from '../../nlp/interface/data';
import { IcoreData } from '../../core/interface/data';
import { managerFactory } from '../../manager/manager';
import { Inlp } from '../../nlp/interface/nlp';
import { Icore, EnodeType } from '../../core/interface/core';
import { Tgraph2 } from '../../manager/type/graph';

type Tname =
  | 'start'
  | 'name'
  | 'fallback'
  | 'error'
  | 'whoIam'
  | 'hello'
  | 'bye';

type Tcontext = 'default' | 'personality';

interface Iconv {
  input: string;
  output: string;
}

const graph: Tgraph2<
  Tname,
  Icore<Tname, Tcontext, Iconv>,
  Inlp<Tname, Tcontext, Iconv>
> = {
  start: {
    context: 'default',
    node: {
      return: false,
      fct: bot => {
        bot.conv.output = '[start]';
        return 'hello';
      },
    },
  },
  hello: {
    context: 'default',
    node: {
      return: true,
      fct: bot => {
        bot.conv.output += 'Hello world';
        return 'hello';
      },
    },
    nlp: {
      nlu: {
        fr: ['bonjour', 'salut'],
      },
    },
  },
  fallback: {
    context: 'default',
    node: {
      return: true,
      type: EnodeType.fallback,
      fct: bot => {
        bot.conv.output = "Je n'ai pas compris";
        return 'fallback';
      },
    },
  },
  error: {
    context: 'default',
    node: {
      return: true,
      type: EnodeType.error,
      fct: bot => {
        bot.conv.output = 'Une érreur est survenue';
        return 'error';
      },
    },
  },
};

interface Idata
  extends IcoreData<Tname, Tcontext, Iconv>,
    InlpData<Tname, Tcontext, Iconv> {}

test('hello world', async () => {
  const compute = managerFactory<Iconv, Idata>(
    bot => {
      bot.data.utterance = bot.conv.input;
      return bot;
    },
    await nlpFactory<Tname, Tcontext, Iconv, Idata>(graph),
    coreFactory<Tname, Tcontext, Iconv, Idata>(graph)
  );

  const conv: Iconv = {
    input: 'bonjour',
    output: '',
  };

  await compute(conv, () => ({
    utterance: '',
    nodeName: 'hello',
    context: 'default',
  }));

  expect(conv.output).toBe('Hello world');
});

test('test fallback', async () => {
  const compute = managerFactory<Iconv, Idata>(
    bot => {
      bot.data.utterance = bot.conv.input;
      return bot;
    },
    await nlpFactory<Tname, Tcontext, Iconv, Idata>(graph),
    coreFactory<Tname, Tcontext, Iconv, Idata>(graph)
  );

  const conv: Iconv = {
    input: 'bon',
    output: '',
  };

  await compute(conv, () => ({
    utterance: '',
    nodeName: 'hello',
    context: 'default',
  }));

  expect(conv.output).toBe("Je n'ai pas compris");
});

/**
 * Mode intent name
 * without nlp
 * used in Actions for example to handle 'Welcome' or 'mediaStatus' event
 */

test('intent node without nlp', async () => {
  const compute = managerFactory<Iconv, Idata>(
    coreFactory<Tname, Tcontext, Iconv, Idata>(graph)
  );

  const conv: Iconv = {
    input: '',
    output: '',
  };

  await compute(conv, () => ({
    utterance: '',
    nodeName: 'start',
    context: 'default',
  }));

  expect(conv.output).toBe('[start]Hello world');
});
