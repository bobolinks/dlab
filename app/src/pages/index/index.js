/* eslint-disable */
/* eslint-disable no-nested-ternary */
import { appData, watcher } from '../../store';
import { $s } from '../../locales/index';
import actions from '../../components/tabs/actions';
// import Stats from '../../modules/stats';
Page({
    data: {
        $s,
        tab: Object.keys(actions.bottom)[0],
        tick: 0,
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
        }
        else {
            this.setData({
                ready: true,
            });
        }
    },
    onUnload() {
        watcher.removelistener(this, '*');
    },
    onPullDownRefresh() {
        this.setData({
            tick: -Date.now(),
        });
        wx.stopPullDownRefresh();
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
