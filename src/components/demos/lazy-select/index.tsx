import React, { useState, useRef } from 'react';
import { useAsyncRetry } from 'react-use';
import { Button, message } from 'antd';
import LazySelect from 'common/components/lazy-select';
import './index.less';

export default function Demo(): JSX.Element {
  return (
    <div className="tree-container">
      <LazySelect
        selectProps={{
          placeholder: '请选择'
        }}
        fetchService={}
      />
      <Button type="primary" onClick={handleSubmit} className="tree-submit-btn">提交</Button>
    </div>
  );
}
