import { Ibot } from './interface/bot';

export const managerFactory = <Tstorage, Tnlp, Tmiddleware, Tconv>
  (...fct: Array<(bot: Ibot<Tstorage, Tnlp, Tmiddleware, Tconv>) =>
    Ibot<Tstorage, Tnlp, Tmiddleware, Tconv> | Promise<Ibot<Tstorage, Tnlp, Tmiddleware, Tconv>>>):
  (bot: Ibot<Tstorage, Tnlp, Tmiddleware, Tconv>) => Promise<Ibot<Tstorage, Tnlp, Tmiddleware, Tconv> | null> =>

  async (bot: Ibot<Tstorage, Tnlp, Tmiddleware, Tconv>) => {
    if (bot.utterance.length) {
      // handle both user id and session id in middleware and not here .. allow to check if session lost

      const start = fct.shift();
      if (start) {
        return fct.reduce(async (pv, cv) => Promise.resolve(cv(await pv)), Promise.resolve(start(bot)));
      }
    }
    return null;
  };