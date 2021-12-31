export enum NodeType {
  leaf = 'leaf',
  node = 'node',
  null = 'null',
}

export enum Relation {
  AND = 'AND',
  OR = 'OR',
  MINUS = 'MINUS',
}

export const RelationName = {
  [Relation.AND]: '且',
  [Relation.OR]: '或',
  [Relation.MINUS]: '减',
};

export enum Operate {
  EXCLUDE = 0,
  INCLUDE = 1,
}

export const OperateName = {
  [Operate[Operate.INCLUDE]]: '包含',
  [Operate[Operate.EXCLUDE]]: '不包含',
};

export interface ILeaf {
  type: NodeType.leaf;
  identifier: string;
  dataId?: number;
  operate?: Operate;
  valueList?: string[];
  main?: boolean;
}

export interface INode {
  type: NodeType.node;
  identifier: string;
  relation: Relation;
  children: Array<ILeaf|INode>;
  main?: boolean;
}

export interface INull {
  type?: NodeType.null;
  identifier?: string;
}

export type ITreeData = INode|ILeaf|INull;

export interface ITreeUtils {
  sourceDataList: ISourceData[];
  showMainBtn?: boolean;
  onSetMain: () => void;
  convertLeafToNode: (Target: ILeaf) => void;
  deleteTreeNode: (Target: INode|ILeaf) => void;
  setNodeByIdentifier: (identifier: string, nodeValue: INode|ILeaf) => void;
}

export interface ITreeProps extends ITreeUtils {
  treeData: ITreeData;
  updateTreeData: (treeData: ITreeData) => void;
  addChildToNode: (Target: INode) => void;
}

export interface ILeafProps extends ITreeUtils {
  leafData: ILeaf;
}

export interface ICustomTreeProps {
  value: ITreeData;
  onChange: (value: ITreeData) => void;
  sourceDataList: ISourceData[];
}

export interface ISourceData {
  id: number;
  name: string;
  valueList: ISourceDataValue[];
}

export interface ISourceDataValue {
  id: number;
  value: string;
}

export interface ICustomTreeRef {
  /**
   * 校验表单内容，校验通过则resolve表单值，否则reject
   */
  handleSubmit: () => Promise<ITreeData>;
}

export interface ITreeUtilsExtraProps {
  treeData: ITreeData;
  setTreeData: (treeData: ITreeData) => void;
}
