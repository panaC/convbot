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
  | 'personality_whoIam'
  | 'personality_error'
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
        en: ['Hello', 'Hi'],
      },
    },
  },
  bye: {
    context: 'default',
    node: {
      return: true,
      fct: bot => {
        bot.conv.output += 'see you';
        return 'bye';
      },
    },
    nlp: {
      nlu: {
        en: ['Bye', 'goodbye'],
      },
    },
  },
  personality_whoIam: {
    context: 'personality',
    node: {
      return: true,
      fct: bot => {
        bot.conv.output += 'I am convbot';
        return 'personality_whoIam';
      },
    },
    nlp: {
      nlu: {
        en: ['who i am'],
      },
    },
  },
  personality_error: {
    context: 'personality',
    node: {
      return: true,
      type: EnodeType.error,
      fct: bot => {
        bot.conv.output = 'An error was happened on personality context';
        return 'personality_error';
      },
    },
  },
  fallback: {
    context: 'default',
    node: {
      return: true,
      type: EnodeType.fallback,
      fct: bot => {
        bot.conv.output = "I don't understand";
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
        bot.conv.output = 'An error was happened';
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
    bot => {
      if (bot.data.domain !== bot.data.context) {
        bot.data.nodeName = `${bot.data.domain}_fallback` as Tname;
      }
      return bot;
    },
    coreFactory<Tname, Tcontext, Iconv, Idata>(graph)
  );

  const conv: Iconv = {
    input: 'hello',
    output: '',
  };

  await compute(conv, () => ({
    utterance: '',
    nodeName: 'hello',
    context: 'default',
    domain: 'None',
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
    bot => {
      if (bot.data.domain !== bot.data.context) {
        bot.data.nodeName = `${bot.data.domain}_fallback` as Tname;
      }
      return bot;
    },
    coreFactory<Tname, Tcontext, Iconv, Idata>(graph)
  );

  const conv: Iconv = {
    input: 'hel',
    output: '',
  };

  await compute(conv, () => ({
    utterance: '',
    nodeName: 'hello',
    context: 'default',
    domain: 'None',
  }));

  expect(conv.output).toBe("I don't understand");
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
    domain: 'None',
  }));

  expect(conv.output).toBe('[start]Hello world');
});

test("test 'bye' in personality context", async () => {
  const compute = managerFactory<Iconv, Idata>(
    bot => {
      bot.data.utterance = bot.conv.input;
      return bot;
    },
    await nlpFactory<Tname, Tcontext, Iconv, Idata>(graph),
    bot => {
      if (bot.data.domain !== bot.data.context) {
        bot.data.nodeName = `${bot.data.domain}_fallback` as Tname;
      }
      return bot;
    },
    coreFactory<Tname, Tcontext, Iconv, Idata>(graph)
  );

  const conv: Iconv = {
    input: 'bye',
    output: '',
  };

  await compute(conv, () => ({
    utterance: '',
    nodeName: 'hello',
    context: 'personality',
    domain: 'None',
  }));

  expect(conv.output).toBe('An error was happened on personality context');
});

test("test 'who i am' in personality context", async () => {
  const compute = managerFactory<Iconv, Idata>(
    bot => {
      bot.data.utterance = bot.conv.input;
      return bot;
    },
    await nlpFactory<Tname, Tcontext, Iconv, Idata>(graph),
    bot => {
      if (bot.data.domain !== bot.data.context) {
        bot.data.nodeName = `${bot.data.domain}_fallback` as Tname;
      }
      return bot;
    },
    coreFactory<Tname, Tcontext, Iconv, Idata>(graph)
  );

  const conv: Iconv = {
    input: 'who i am ?',
    output: '',
  };

  await compute(conv, () => ({
    utterance: '',
    nodeName: 'hello',
    context: 'personality',
    domain: 'None',
  }));

  expect(conv.output).toBe('I am convbot');
});

test("test 'who i am' in default context", async () => {
  const compute = managerFactory<Iconv, Idata>(
    bot => {
      bot.data.utterance = bot.conv.input;
      return bot;
    },
    await nlpFactory<Tname, Tcontext, Iconv, Idata>(graph),
    bot => {
      if (bot.data.domain !== bot.data.context) {
        bot.data.nodeName = `${bot.data.domain}_fallback` as Tname;
      }
      return bot;
    },
    coreFactory<Tname, Tcontext, Iconv, Idata>(graph)
  );

  const conv: Iconv = {
    input: 'who i am ?',
    output: '',
  };

  await compute(conv, () => ({
    utterance: '',
    nodeName: 'hello',
    context: 'default',
    domain: 'None',
  }));

  expect(conv.output).toBe("I don't understand");
});
