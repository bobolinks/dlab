/* eslint-disable no-restricted-syntax */
/* eslint-disable no-throw-literal */
import { appData } from '../store';
import { Earn, Mixed, Module, Order, Product, Service, Type } from 'dl/stats';

const cached: Record<Type, Array<Mixed>> = {
  service: [] as Array<Service>,
  product: [] as Array<Product>,
};

async function fetchData() {
  const file = await wx.cloud.downloadFile({
    fileID: 'cloud://cloud1-0g8h5fze48931cdf.636c-cloud1-0g8h5fze48931cdf-1305608886/earns.json'
  });
  const fs = wx.getFileSystemManager();

  const { tempFilePath } = file;
  const data = JSON.parse(fs.readFileSync(tempFilePath, 'utf-8') as string) as any;

  if (!cached.service.length || !cached.product.length) {
    for (const iterator of ['s', 'p']) {
      const mapping: Record<Name, Mixed> = {};
      for (const [symbol, stock] of Object.entries(data)) {
        const { n: name, d: date, } = stock as any;
        const source: Record<string, Earn> = (stock as any)[iterator];
        for (const [ks, s] of Object.entries(source)) {
          if (s.i < 0 || s.c < 0) {
            continue;
          }
          const sv = mapping[ks] || (mapping[ks] = { name: ks, date: date, sample: 0, gross: 0, cap: 0, income: 0, cost: 0, proportion: [], left: { income: 0, cost: 0, gross: 0 } });
          sv.sample += 1;
          if (sv.date.localeCompare(date) < 0) {
            sv.date = date;
          }
          sv.cap += s.i;
          if (s.c > 0) {
            sv.income += s.i;
            sv.cost += s.c;
            sv.proportion.push({ name, symbol, income: s.i, cost: s.c, gross: 1 - s.c / s.i });
          }
        }
      }
      Object.values(mapping).forEach(sv => {
        sv.proportion.sort((a, b) => b.gross - a.gross);
        sv.gross = 1 - sv.cost / sv.income;
        sv.proportion.slice(4).forEach(p => {
          sv.left.income += p.income;
          sv.left.cost += p.cost || 0;
        });
        sv.left.gross = 1 - sv.left.cost / sv.left.income;
      });
      const mName = iterator === 's' ? 'service' : 'product';
      cached[mName] = Object.values(mapping).sort((a, b) => b.gross - a.gross);
    }
  }
  const pathCached = `${wx.env.USER_DATA_PATH}/cached.json`;
  fs.writeFileSync(pathCached, JSON.stringify(cached), 'utf-8');
  appData.ready = true;
}

export async function loadData() {
  const pathCached = `${wx.env.USER_DATA_PATH}/cached.json`;
  const fs = wx.getFileSystemManager();
  try {
    fs.accessSync(pathCached);
    const pack = JSON.parse(fs.readFileSync(pathCached, 'utf-8') as string) as Record<Type, Array<Mixed>>;
    cached.service = pack.service;
    cached.product = pack.product;
  } catch (_e) {
    await fetchData();
  }
}

export default new class implements Module {
  list(type: Type, key?: MatchKey, order?: Order, count?: number, offset?: number): RecSet<Mixed> {
    const items = key ? cached[type].filter(item => item.name.indexOf(key) !== -1) : cached[type];
    const rs: RecSet<Mixed> = {
      total: items.length,
      items: [],
    };
    if (!offset) {
      offset = 0;
    } else if (offset > items.length) {
      offset = items.length - 1;
    }
    if (!count) {
      count = items.length - offset;
    } else {
      count = Math.min(count, items.length - offset);
    }
    if (order === 'desc') {
      rs.items = items.slice(offset, offset + count);
    } else {
      rs.items = items.slice(items.length - offset - count, offset + count).reverse();
    }
    return rs;
  }
};
