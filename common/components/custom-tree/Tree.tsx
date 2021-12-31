import React, { useCallback, useEffect, useState } from 'react';
import { Button, Radio, Select } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import Leaf from './Leaf';
import { defaultLeafData, relationOptions, showMainBtnRelations } from './dict';
import { ILeaf, INode, ITreeProps, NodeType, Relation } from './interface';

export default function Tree(props: ITreeProps): JSX.Element|null {
  const {
    treeData = {},
    sourceDataList = [],
    updateTreeData,
    addChildToNode,
    convertLeafToNode,
    deleteTreeNode,
    setNodeByIdentifier,
    showMainBtn = false,
    onSetMain,
  } = props;
  const { type } = treeData;
  const [styles, setStyles] = useState<string>('');
  const getStyles = useCallback((): string => {
    if (type !== NodeType.node) {
      return '';
    }

    const treeNodeHeight = document.querySelector(`.node-children-container[id="${treeData.identifier}"]`)?.clientHeight || 0;
    const childNum = (treeData as INode).children.length;
    let borderHeight = 0;
    let topOffset = 0;
    (treeData as INode).children.forEach((child, index): void => {
      const elementHeight = document.querySelector(`.node-children[id="${child.identifier}"]`)?.clientHeight || 0;
      if (index === 0 || index === childNum - 1) {
        borderHeight += (elementHeight / 2 + 8);
      } else {
        borderHeight += (elementHeight + 16);
      }
      if (index === 0) {
        topOffset = elementHeight / 2;
      }
    });

    return `
      .node-children-container-border-container {
        display: flex;
        align-items: center;
        height: ${treeNodeHeight}px;
      }
      .node-children-container-border[id="${treeData.identifier}"] {
        display: inline-block;
        position: absolute;
        width: 1px;
        height: ${borderHeight}px;
        top: ${topOffset}px;
        border-left: 1px solid rgba(0, 0, 0, 0.1);
      }
    `;
  }, [treeData, type]);

  useEffect((): () => void => {
    let refreshId = 0;
    const animate = (): void => {
      refreshId = requestAnimationFrame(animate);
      /**
       * 标签值的多选下拉框在选项展示超过一行时，若删除选项使得展示行数减少，
       * 下拉框的高度变化比数据变化晚大约300ms，会导致边框样式错位，故使用
       * requestAnimationFrame在浏览器重绘时检查样式是否需要更新
       */
      const newStyle = getStyles();
      if (styles !== newStyle) {
        setStyles(newStyle);
      }
    };
    animate();

    return (): void => {
      window.cancelAnimationFrame(refreshId);
    };
  }, [getStyles, styles]);

  function handleFirstAdd(): void {
    updateTreeData(defaultLeafData);
  }

  function addChild(): void {
    addChildToNode(treeData as INode);
  }

  function deleteNode(): void {
    deleteTreeNode(treeData as INode);
  }

  function onChildSetMain(childId: string): void {
    const { children } = treeData as INode;
    setNodeByIdentifier(treeData.identifier as string, {
      ...treeData as INode,
      children: children.map((child): INode|ILeaf => ({
        ...child,
        main: child.identifier === childId,
      })),
    });
  }

  function onRelationChange(value: Relation): void {
    const { children } = treeData as INode;
    setNodeByIdentifier(treeData.identifier as string, {
      ...treeData as INode,
      children: children.map((child, index): INode|ILeaf => ({
        ...child,
        // 选“减”：默认将第一个child设为主数据
        main: value === Relation.MINUS ? index === 0 : false,
      })),
      relation: value,
    });
  }

  if (!type || type === NodeType.null) {
    return (
      <Button data-testid="tree-first-add-btn" icon={<PlusOutlined />} onClick={handleFirstAdd}>添加</Button>
    );
  }

  switch (type) {
    case NodeType.node:
      return (
        <div
          data-testid={`tree-node#${treeData.identifier}`}
          className="customtree-node-container"
        >
          <div className="customtree-node-add-child-btn">
            <Button data-testid={`tree-node-add-btn#${treeData.identifier}`} icon={<PlusOutlined />} onClick={addChild}>添加</Button>
          </div>
          <div className="customtree-node">
            <div className="cutomtree-node-relation-container">
              <Select
                data-testid={`tree-node-relation-select#${treeData.identifier}`}
                className="relation-select"
                options={relationOptions}
                value={(treeData as INode).relation}
                onChange={(value): void => onRelationChange(value)}
              />
            </div>
            <div className="node-children-container" id={treeData.identifier}>
              <div className="node-children-container-border" id={treeData.identifier} />
              <div className="children">
                {(treeData as INode).children.map((item): JSX.Element => (
                  <div data-testid={`node-children#${item.identifier}`} key={item.identifier} id={item.identifier} className="node-children">
                    <Tree
                      treeData={item}
                      sourceDataList={sourceDataList}
                      onSetMain={(): void => onChildSetMain(item.identifier)}
                      showMainBtn={showMainBtnRelations.indexOf((treeData as INode).relation) > -1}
                      updateTreeData={updateTreeData}
                      addChildToNode={addChildToNode}
                      convertLeafToNode={convertLeafToNode}
                      deleteTreeNode={deleteTreeNode}
                      setNodeByIdentifier={setNodeByIdentifier}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {
            showMainBtn ? (
              <div className="set-main-btn">
                <Radio
                  data-testid={`tree-node-set-main-btn#${treeData.identifier}`}
                  defaultChecked={(treeData as INode).main}
                  checked={(treeData as INode).main}
                  onChange={onSetMain}
                >
                  设置为主数据
                </Radio>
              </div>
            ) : null
          }
          <Button data-testid={`tree-node-delete-btn#${treeData.identifier}`} icon={<MinusOutlined />} onClick={deleteNode} className="customtree-opt-btn node-minus-btn" />
          <style>{styles}</style>
        </div>
      );
    case NodeType.leaf:
      return (
        <Leaf
          leafData={treeData as ILeaf}
          sourceDataList={sourceDataList}
          onSetMain={onSetMain}
          showMainBtn={showMainBtn}
          convertLeafToNode={convertLeafToNode}
          deleteTreeNode={deleteTreeNode}
          setNodeByIdentifier={setNodeByIdentifier}
        />
      );
    default:
      return null;
  }
}
