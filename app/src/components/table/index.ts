/* eslint-disable no-nested-ternary */
import { Stats } from '../../modules/index';

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    name: {
      type: String,
      value: 'service',
    },
    tick: {
      type: Number,
    },
    key: {
      type: String,
    },
  },
  data: {
    items: [] as any,
    curPage: 0,
    pageSize: 10,
    pageCount: 0,
  },
  lifetimes: {
    attached() {
      this.update();
    },
  },
  observers: {
    tick(value) {
      if (value > 0) {
        if (this.data.pageCount > (this.data.curPage + 1)) {
          this.data.curPage += 1;
          this.update();
        }
      } else {
        if (this.data.curPage > 0) {
          this.data.curPage -= 1;
          this.update();
        }
      }
    },
    key(value) {
      this.data.curPage = 0;
      this.update();
    },
  },
  methods: {
    update() {
      const rs = Stats.list(this.data.name as any, this.data.key, 'desc', this.data.pageSize, this.data.curPage * this.data.pageSize);
      this.setData({
        items: rs.items.map(e => {
          return {
            ...e,
            gross: (e.gross * 100).toFixed(2),
            cap: (e.cap / 100000000).toFixed(3),
          };
        }),
        pageCount: rs.total / this.data.pageSize,
      });
      wx.stopPullDownRefresh();
      console.log('updated');
    },
    onTap(event: any) {
      const name = event.detail;
    },
  },
});
