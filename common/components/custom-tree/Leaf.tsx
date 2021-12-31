import React, { useEffect, useState } from 'react';
import { Button, Radio, Select } from 'antd';
import { LabeledValue } from 'antd/lib/select';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { ILeafProps } from './interface';
import { operateOptions } from './dict';

export default function Leaf(props: ILeafProps): JSX.Element {
  const {
    leafData,
    convertLeafToNode,
    deleteTreeNode,
    setNodeByIdentifier,
    showMainBtn,
    onSetMain,
    sourceDataList,
  } = props;
  const { identifier, dataId } = leafData;
  const [dataValueList, setDataValueList] = useState<LabeledValue[]>([]);

  useEffect((): void => {
    setDataValueList(sourceDataList.filter((item): boolean => item.id === Number(dataId))[0]
      ?.valueList.map((item): LabeledValue => ({
        value: item.id,
        label: item.value,
      })) || []);
  }, [sourceDataList, dataId]);

  function convertToNode(): void {
    convertLeafToNode(leafData);
  }

  function deleteLeaf(): void {
    deleteTreeNode(leafData);
  }

  function onDataChange(key: 'dataId'|'operate'|'valueList'): (value: number|string|string[]) => void {
    return (value: number|string|string[]): void => {
      const newValue = {
        ...leafData,
        [key]: value,
      };
      if (key === 'dataId') {
        const curData = sourceDataList.find((item): boolean => String(item.id) === value);
        newValue.valueList = [];
        newValue.dataId = Number(value);
        setDataValueList(curData?.valueList?.map((item): LabeledValue => ({
          value: item.id,
          label: item.value,
        })) || []);
      }
      setNodeByIdentifier(identifier, newValue);
    };
  }

  return (
    <div
      data-testid={`leaf#${leafData.identifier}`}
      className="customtree-leaf-container"
    >
      {identifier === 'root' ? (
        <div className="customtree-leaf-first-add-btn">
          <Button data-testid={`leaf-root-add-btn#${leafData.identifier}`} icon={<PlusOutlined />} onClick={convertToNode}>添加</Button>
        </div>
      ) : null}
      <div className="customtree-leaf-body-container">
        <div className="customtree-leaf-body">
          <div className="customtree-leaf-select-group">
            <Select
              data-testid={`leaf-data-select#${leafData.identifier}`}
              className="data-select"
              placeholder="请选择数据"
              options={sourceDataList.map((item): LabeledValue => ({
                label: item.name,
                value: item.id,
              }))}
              value={leafData.dataId}
              onChange={onDataChange('dataId')}
            />
            <Select
              data-testid={`leaf-operate-select#${leafData.identifier}`}
              className="operate-select"
              placeholder="请选择"
              options={operateOptions}
              value={leafData.operate}
              onChange={onDataChange('operate')}
            />
            <Select
              data-testid={`leaf-data-value-select#${leafData.identifier}`}
              className="data-value-select"
              placeholder="请选择数据值"
              options={dataValueList}
              value={leafData.valueList}
              onChange={onDataChange('valueList')}
              mode="multiple"
            />
            <Button data-testid={`leaf-convert-to-node-btn#${leafData.identifier}`} icon={<PlusOutlined />} onClick={convertToNode} className="customtree-opt-btn" />
            <Button data-testid={`leaf-delete-btn#${leafData.identifier}`} icon={<MinusOutlined />} onClick={deleteLeaf} className="customtree-opt-btn leaf-minus-btn" />
          </div>
          {showMainBtn ? (
            <div className="set-main-btn">
              <Radio
                data-testid={`leaf-set-main-radio#${leafData.identifier}`} 
                defaultChecked={!!leafData.main}
                checked={!!leafData.main}
                onChange={onSetMain}
              >
                设置为主数据
              </Radio>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
