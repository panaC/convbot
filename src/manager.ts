import { Ibot } from './interface/bot';

export const managerFactory = <Tconv, Tdata>
  (...fct: Array<(bot: Ibot<Tconv, Tdata>) =>
    Ibot<Tconv, Tdata> | Promise<Ibot<Tconv, Tdata>>>) =>

  async (conv: Tconv, initData?: (conv: Tconv) => Tdata) => {
    const bot: Ibot<Tconv, Tdata> = {
      conv,
      data: initData ? initData(conv) : undefined,
    };
    const start = fct.shift();
    if (start) {
      return fct.reduce(async (pv, cv) => Promise.resolve(cv(await pv)), Promise.resolve(start(bot)));
    }
    return null;
  };