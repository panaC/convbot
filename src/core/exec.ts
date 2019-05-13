import { Ibot } from '../manager/interface/bot';
import { Icore, EnodeType } from './interface/core';
import { Tgraph } from './factory';
import { IcoreData } from './interface/data';

const EXEC_LOOP_MAX = 100;

const getObjWithKey = <T, R>(obj: T, name: keyof T, fallback?: R) =>
  Object.entries(obj).reduce((p, o) => {
    const [key, value] = o;
    if (key === name) {
      return value as R;
    }
    return p;
  }, fallback);

const getNodeByType = <Tname extends string, Tcontext extends string, Tconv>(
  graph: Tgraph<Tname, Tcontext, Tconv>,
  context: Tcontext,
  type: EnodeType,
  fallback?: Icore<Tname, Tcontext, Tconv>
) =>
  Object.entries(graph).reduce((p, o) => {
    const [key, value] = o;
    if (
      (value as Icore<Tname, Tcontext, Tconv>).context === context &&
      (value as Icore<Tname, Tcontext, Tconv>).node.type === type
    ) {
      return value as Icore<Tname, Tcontext, Tconv>;
    }
    return p;
  }, fallback);

export function exec<Tname extends string, Tcontext extends string, Tconv>(
  graph: Tgraph<Tname, Tcontext, Tconv>,
  bot: Ibot<Tconv, IcoreData<Tname, Tcontext, Tconv>>,
  loop = 0
): void {
  if (loop > EXEC_LOOP_MAX) {
    const error = getNodeByType<Tname, Tcontext, Tconv>(
      graph,
      bot.data.context,
      EnodeType.error
    );
    if (error) {
      if (error.node.return) {
        error.node.fct(bot);
      } else {
        throw new Error(
          `no return in 'error' node in ${bot.data.context} context`
        );
      }
    } else {
      throw new Error(
        `no node typed with 'error' found in ${bot.data.context} context`
      );
    }
  }
  const node = getObjWithKey<
    Tgraph<Tname, Tcontext, Tconv>,
    Icore<Tname, Tcontext, Tconv>
  >(graph, bot.data.nodeName);
  if (node) {
    if (node.node.return) {
      node.node.fct(bot);
    } else {
      bot.data.nodeName = node.node.fct(bot);
      return exec(graph, bot, ++loop);
    }
  } else {
    const handler = getNodeByType<Tname, Tcontext, Tconv>(
      graph,
      bot.data.context,
      EnodeType.fallback,
      getNodeByType<Tname, Tcontext, Tconv>(
        graph,
        bot.data.context,
        EnodeType.error
      )
    );
    if (handler) {
      if (handler.node.return) {
        handler.node.fct(bot);
      } else {
        bot.data.nodeName = handler.node.fct(bot);
        return exec(graph, bot, ++loop);
      }
    } else {
      throw new Error(
        `no node typed with 'error' found in ${bot.data.context} context`
      );
    }
  }
}
