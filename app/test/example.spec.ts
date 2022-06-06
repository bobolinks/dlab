/* eslint-disable no-restricted-syntax */
/* eslint-disable no-return-await */
/* eslint-disable no-extend-native */
import app, { Page } from './wxtest';
import { mocks } from './dataset.mock';

jest.setTimeout(30000);

describe('主页', () => {
  let page: Page;

  it('打开主页', async () => {
    await app.mock([
      {
        rule: 'wxlogin',
        result: {
          data: mocks.wxlogin.成功,
          statusCode: 200,
        },
      },
    ]);

    // 开始
    await app.reLaunch('/pages/index/index');

    // Step.1 等待进入主页
    page = await app.waitForPage('/pages/index/index');

    expect(page).not.toBeNull();
  });
});
