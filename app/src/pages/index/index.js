/* eslint-disable */
/* eslint-disable no-nested-ternary */
import { watcher } from '../../store';
import { $s } from '../../locales/index';
import actions from '../../components/tabs/actions';
// import Stats from '../../modules/stats';
Page({
    data: {
        $s,
        tab: Object.keys(actions.bottom)[0],
        tick: 0,
        key: '',
    },
    onLoad() {
        // watcher.addListener(this, '*', () => {
        //   const sdf = Stats.list('service', 'desc', 10, 0);
        // });
        // if (appData.ready) {
        //   const sdf = Stats.list('service', 'desc', 10, 0);
        // }
        // console.log('');
    },
    onUnload() {
        watcher.removelistener(this, '*');
    },
    onPullDownRefresh() {
        this.setData({
            tick: -Date.now(),
        });
    },
    onReachBottom() {
        this.setData({
            tick: Date.now(),
        });
    },
    onShareAppMessage() {
        return {};
    },
    onGoto(event) {
        this.setData({
            tab: event.detail,
        });
    },
    search(event) {
        this.setData({
            key: event.detail,
        });
    },
});
