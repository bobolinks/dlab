/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import automator from 'miniprogram-automator';
import MiniProgram from 'miniprogram-automator/out/MiniProgram';
import Page from 'miniprogram-automator/out/Page';
import { MockData } from './dataset.mock';

export { default as Page } from 'miniprogram-automator/out/Page';

export const env = {
  app: null as any as MiniProgram,
};

beforeAll(async () => {
  env.app = await automator.launch({
    projectPath: '../',
    timeout: 20000,
  }) as any as MiniProgram;
});

afterAll(async () => {
  // env.app.close();
  env.app = null as any as MiniProgram;
});

export type MockRule = {
  /** 表达式 */
  rule: string;
  /** 是否仅匹配一次 */
  once?: boolean;
  /** 回包 */
  result: {
    /** 数据 */
    data: MockData;
    cookies?: Array<any>;
    header?: Record<string, any>;
    statusCode: number;
  };
};

export default {
  async mock(dataset: Array<MockRule>) {
    return await env.app.mockWxMethod(
      'request',
      function (obj: any, data: Array<MockRule>) {
        for (let i = 0, len = data.length; i < len; i++) {
          const item = data[i];
          const rule = new RegExp(item.rule);
          if (rule.test(obj.url)) {
            if (item.once) {
              data.splice(i, 1);
            }
            return item.result;
          }
        }
        // 没命中规则的真实访问后台
        return new Promise(resolve => {
          obj.success = (res: unknown) => resolve(res);
          obj.fail = (res: unknown) => resolve(res);
          // @ts-ignore
          this.origin(obj);
        });
      },
      dataset,
    );
  },

  async waitForPage(path: string, timeout = 5000): Promise<Page> {
    path = path.replace(/^\//, '');
    const startTime = Date.now();
    return new Promise((resolve, reject) => {
      const func = async () => {
        const page = await env.app.currentPage();
        if (page?.path === path) {
          // 强制等待500ms，等装载数据完成，非常caodan的操作
          await page?.waitFor(500);
          resolve(page as any as Page);
        } else if ((Date.now() - startTime) >= timeout) {
          reject(new Error(`Page ${path} load timeout`));
        } else {
          setTimeout(func, 200);
        }
      };
      func();
    });
  },

  async reLaunch(path: string): Promise<Page> {
    return await env.app.reLaunch(path) as any as Page;
  },
};
