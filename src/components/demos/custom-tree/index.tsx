import React, { useState, useRef } from 'react';
import { useAsyncRetry } from 'react-use';
import { Button, message } from 'antd';
import CustomTree, { ICustomTreeRef, ITreeData } from 'common/components/custom-tree';
import { getSourceDataList } from './service';
import './index.less';

export default function Demo(): JSX.Element {
  const [treeData, setTreeData] = useState<ITreeData>({});
  const { value: sourceDataList = [] } = useAsyncRetry(() => getSourceDataList(), []);
  const customTreeRef = useRef<ICustomTreeRef>();

  function handleSubmit(): void {
    customTreeRef.current?.handleSubmit().then((value): void => {
      console.log('value :>> ', value);
      message.success('提交成功');
    }).catch((err: Error): void => {
      console.log('err :>> ', err.message);
      message.error(err.message);
    });
  }

  return (
    <div className="tree-container">
      <CustomTree
        ref={customTreeRef as React.Ref<ICustomTreeRef>}
        value={treeData}
        onChange={setTreeData}
        sourceDataList={sourceDataList}
      />
      <Button type="primary" onClick={handleSubmit} className="tree-submit-btn">提交</Button>
    </div>
  );
}
