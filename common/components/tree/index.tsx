import React, { useImperativeHandle } from 'react';
import Tree from './Tree';
import { ICustomTreeProps, ICustomTreeRef, ILeaf, INode, ITreeData, ITreeUtilsExtraProps } from './interface';
import { validateTreeData, addChildToNode, deleteTreeNode, convertLeafToNode, setNodeByIdentifier } from './utils';
import './index.less';

export * from './interface';
export default React.forwardRef((props: ICustomTreeProps, ref: React.Ref<ICustomTreeRef>): React.ReactElement => CustomTree(props, ref));

function CustomTree(props: ICustomTreeProps, ref: React.Ref<ICustomTreeRef>): JSX.Element {
  const { value: treeData = {}, onChange: setTreeData, sourceDataList = [] } = props;
  const treeUtilsExtraProps: ITreeUtilsExtraProps = {
    treeData,
    setTreeData,
  };

  useImperativeHandle(ref, (): ICustomTreeRef => ({
    handleSubmit: (): Promise<ITreeData> => new Promise((resolve, reject): void => {
      validateTreeData(treeData).then((): void => {
        resolve(treeData);
      }).catch((err: Error): void => {
        reject(err);
      });
    }),
  }));

  function addChildToNodeFunc(Target: INode): void {
    addChildToNode(treeUtilsExtraProps, Target);
  }

  function deleteTreeNodeFunc(Target: INode | ILeaf): void {
    deleteTreeNode(treeUtilsExtraProps, Target);
  }

  function convertLeafToNodeFunc(Target: ILeaf): void {
    convertLeafToNode(treeUtilsExtraProps, Target);
  }

  function setNodeByIdentifierFunc(identifier: string, nodeValue: INode | ILeaf): void {
    setNodeByIdentifier(treeUtilsExtraProps, identifier, nodeValue);
  }

  return (
    <div className="customtree-container">
      <Tree
        treeData={treeData}
        onSetMain={(): void => { /** empty */ }}
        sourceDataList={sourceDataList}
        updateTreeData={setTreeData}
        addChildToNode={addChildToNodeFunc}
        deleteTreeNode={deleteTreeNodeFunc}
        convertLeafToNode={convertLeafToNodeFunc}
        setNodeByIdentifier={setNodeByIdentifierFunc}
      />
    </div>
  );
}
