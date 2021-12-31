import React, { useState, useRef, useEffect } from 'react';
import { Select, Spin } from 'antd';
import { SelectProps, LabeledValue, SelectValue, RefSelectProps } from 'antd/es/select';

interface IFetchParams {
  /** 页码 */
  pageNo: number;

  /** 每一页的大小 */
  pageSize: number;

  /** 通过名称筛选 */
  label?: string;

  /** 通过 id 筛选 */
  value?: SelectValue;
}

interface ILazySelectProps<T = SelectValue> {
  /** 可以透传给 Select 的参数 */
  selectProps: SelectProps<T>;

  /** 拉取新数据的接口，接收 { pageNo: number; pageSize: number; label?: string; value?: SelectValue } ，返回 Promise<IPagingData<LabeledValue>> */
  fetchService: (params: IFetchParams) => Promise<IPagingData<LabeledValue>>;

  /** 滚动到倒数第 n 行时开始下一次加载，若不传则滚动到底时加载 */
  triggerLineNo?: number;

  /** 表单项的受控值 */
  value?: SelectProps<T>['value'];

  /** 用于更新表单值的函数 */
  onChange?: SelectProps<T>['onChange'];
};

/** 支持滚动加载和关键词搜索的受控下拉框组件 */
const LazySelectComp = React.forwardRef((props: ILazySelectProps, ref: React.Ref<RefSelectProps>): JSX.Element => LazySelect(props, ref));

export default LazySelectComp;

const pageSize = 10;

function LazySelect(props: ILazySelectProps, ref: React.Ref<RefSelectProps>): JSX.Element {
  const { selectProps, fetchService, triggerLineNo = 0, value, onChange } = props;

  const idSet = useRef(new Set()); // 数据 id 集合（用于列表去重）

  const [pageNo, setPageNo] = useState<number>(1); // 当前分页页码
  const [data, setData] = useState<LabeledValue[]>([]); // 截至目前已获取的全部数据列表
  const [total, setTotal] = useState<number>(0); // 数据总数
  const [fetching, setFetching] = useState<boolean>(false); // 数据拉取状态

  const [searchKey, setSearchKey] = useState<string>(''); // 搜索关键字
  const [searching, setSearching] = useState<boolean>(false); // 搜索是否请求中

  const [options, setOptions] = useState<LabeledValue[]>([]); // 下拉框选项

  useEffect((): void => {
    if (value) {
      // （针对编辑场景的初始化情况）如果初始已选择的选项不在默认拉取的10条数据中，需要额外获取这个选项的信息用于表单回填
      fetchService({ pageNo: 1, pageSize: 1, value })
        .then((result): void => {
          if (result.data) {
            appendDataList(result.data);
          }
        });
    }
  }, [fetchService, value]);

  useEffect((): void => {
    setFetching(true);
    // 页码变化时查询数据并追加至列表
    fetchService({ pageNo, pageSize })
      .then((result): void => {
        appendDataList(result.data);
        setTotal(result.total);
      })
      .finally((): void => {
        setFetching(false);
      });
  }, [fetchService, pageNo]);

  useEffect((): void => {
    // 数据列表变化时，同步更新下拉框选项
    setOptions(data);
  }, [data]);

  useEffect((): () => void => {
    // searchKey 变化时，根据 searchKey 模糊查询并更新下拉框选项
    let mounted = true;

    if (searchKey) {
      setOptions([]);
      setSearching(true);
      fetchService({ pageNo: 1, pageSize, label: searchKey })
        .then(({ data: searchResult }): void => {
          if (mounted) { // 防止过期的 effect 生效
            setOptions(searchResult);
          }
        })
        .finally((): void => {
          if (mounted) { // 防止过期的 effect 生效
            setSearching(false);
          }
        });
    } else {
      setOptions(data);
    }

    return (): void => {
      // 清除副作用，防止这种情况： searchKey 已经变化了，但是用旧的 searchKey 查询的数据较新的 searchKey 晚返回，导致 setOptions 的参数是已经过期的数据
      mounted = false;
    };
  }, [data, fetchService, searchKey]);

  function handleSearch(val: string): void {
    // 当标签搜索框输入内容变化时，更新 searchKey
    setSearchKey(val);
  }

  function handleScroll(e: React.UIEvent<HTMLDivElement>): void {
    const target = e.target as HTMLUListElement;
    // 当下拉框滚动到指定位置时开始拉取新数据（模糊查询时除外）
    if (target !== null && !searchKey && (target?.scrollHeight - target?.scrollTop <= target?.clientHeight + 32 * (triggerLineNo || 0))) {
      if (data.length < total && !fetching) {
        fetchData();
      }
    }
  }

  function handleChange(val: SelectValue, option: unknown): void {
    if (val) {
      // 选项变化时（针对从模糊搜索结果中选择的情况）将新选择的数据加入到列表中（如果目前不存在）
      const currentData = options.find((item): boolean => item.value === val);
      if (currentData) {
        appendDataList([currentData]);
      }
    }
    setSearchKey(''); // 选项变化后清空 searchKey
    Promise.resolve().then((): void => {
      // 选项变化后（针对从模糊搜索结果中选择的情况）需要将下拉框的选项重置为截至目前已获取的全部数据列表，这里异步执行，因为有可能选中了搜索结果中的项目，要等待上文的 appendDataList 生效后再 setOptions
      setOptions(data);
    });

    if (typeof onChange === 'function') {
      onChange(val, option as LabeledValue);
    }
  }

  /** 将数据追加到列表中 */
  function appendDataList(newData: LabeledValue[]): void {
    setData((curData): LabeledValue[] => {
      const result = [...curData];
      for (const item of newData) {
        if (!idSet.current.has(item.value)) {
          result.push(item);
          idSet.current.add(item.value);
        }
      }
      return [...result];
    });
  }

  /** 拉取下一页数据 */
  function fetchData(): void {
    setPageNo((cur): number => cur + 1);
  }

  return (
    <Select
      {...selectProps}
      ref={ref}
      showSearch
      filterOption={false}
      options={options}
      value={value}
      onChange={handleChange}
      onBlur={(): void => setSearchKey('')}
      onSearch={handleSearch}
      onPopupScroll={handleScroll}
      notFoundContent={searching ? <Spin size="small" /> : null}
    />
  );
}
