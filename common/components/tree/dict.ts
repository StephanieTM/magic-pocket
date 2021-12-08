import { generateNumberOptions, generateStringOptions } from 'common/utils';
import { ILeaf, NodeType, Operate, OperateName, Relation, RelationName } from './interface';

/** 初始叶子节点的值 */
export const defaultLeafData: ILeaf = {
  type: NodeType.leaf,
  identifier: 'root',
  operate: Operate.INCLUDE,
  main: false,
};

/** identifier中用于分割子节点的字符串 */
export const CHILDREN_SPLITTER = '.children';

/** Relation的下拉选项 */
export const relationOptions = generateStringOptions(RelationName);

/** Operate的下拉选项 */
export const operateOptions = generateNumberOptions(Operate, OperateName);

/** 需要设定主数据的Relation */
export const showMainBtnRelations = [Relation.MINUS];
