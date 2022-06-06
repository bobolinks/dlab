export interface MockData {
  code: number;
  msg: string;
  [key: string]: any;
}

export const inputs = {
};

/**
 * wx.request的返回内容
 */

export const mocks = {
  wxlogin: {
    成功: {
      code: 0,
      msg: '',
    },
  },
};
