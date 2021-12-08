import { ISourceData } from 'common/components/tree';

export const getSourceDataList = (): Promise<ISourceData[]> => new Promise((resolve) => {
  resolve([{
    id: 1,
    name: '性别',
    valueList: [{
      id: 1001,
      value: '男',
    }, {
      id: 1002,
      value: '女',
    }, {
      id: 1003,
      value: '其他',
    }],
  }, {
    id: 2,
    name: '年龄',
    valueList: [{
      id: 2001,
      value: '18-24岁',
    }, {
      id: 2002,
      value: '25-35岁',
    }, {
      id: 2003,
      value: '35-45岁',
    }, {
      id: 2004,
      value: '45-60岁',
    }, {
      id: 2005,
      value: '60岁以上',
    }],
  }]);
});
