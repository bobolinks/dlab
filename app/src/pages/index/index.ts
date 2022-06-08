/* eslint-disable no-nested-ternary */
import { appData, watcher } from '../../store';
import { $s } from '../../locales/index';
import actions from '../../components/tabs/actions';
import { Router } from '../../utils/index';

Page({
  data: {
    $s,
    tab: Object.keys(actions.bottom)[0],
    key: '',
    ready: false,
  },
  onLoad() {
    if (!appData.ready) {
      watcher.addListener(this, '*', () => {
        this.setData({
          ready: appData.ready,
        });
      });
    } else {
      this.setData({
        ready: true,
      });
    }
  },
  onUnload() {
    watcher.removelistener(this, '*');
  },
  onShareAppMessage() {
    return {} as any;
  },
  onGoto(event: any) {
    this.setData({
      tab: event.detail,
    });
  },
  showDetail(event: any) {
    Router.navigateTo({
      url: '../detail/index',
    }, { item: event.detail });
  },
  search(event: any) {
    this.setData({
      key: event.detail,
    });
  },
});
