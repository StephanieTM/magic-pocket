import _ from 'lodash';
import { CHILDREN_SPLITTER, defaultLeafData } from './dict';
import { INode, ILeaf, ITreeData, NodeType, Relation, ITreeUtilsExtraProps } from './interface';

/**
 * 将指定的原始节点数据格式化为标准的树数据结构，identifier的索引偏移将会被校正
 * @param data 原始节点数据
 * @param id 指定id
 */
export function formatTreeData(data: ITreeData, id: string): INode | ILeaf | ITreeData {
  if (!data || !data.type) {
    return {};
  }
  if (data.type === NodeType.leaf) {
    return {
      ...data,
      main: !!data.main,
      identifier: id,
    };
  } else if (data.type === NodeType.node) {
    return {
      ...data,
      main: !!data.main,
      identifier: id,
      children: (data.children?.map((child: ITreeData, index: number): ITreeData => formatTreeData(child, `${id}${CHILDREN_SPLITTER}${index}`)) || []) as (INode|ILeaf)[],
    };
  }
  return {};
}

/**
 * 校验树数据是否填写完整
 * @param treeData 树数据
 */
export function validateTreeData(treeData: ITreeData): Promise<boolean> {
  return new Promise<boolean>((resolve, reject): void => {
    if (!treeData.type || treeData.type === NodeType.null) {
      reject(new Error('请设置条件'));
    }

    function traverse(node: INode|ILeaf): void {
      if (node.type === NodeType.node) {
        if (node.relation === Relation.MINUS) {
          let mainChildCount = 0;
          node.children.forEach((child): void => {
            if (child.main) {
              mainChildCount += 1;
            }
          });
          if (mainChildCount !== 1) {
            reject(new Error('条件为“减”的分支需指定唯一主数据'));
          }
        }
        node.children.map((child): void => traverse(child));
      } else if (node.type === NodeType.leaf) {
        if (!node.dataId) {
          reject(new Error('请选择数据'));
        }
        if (!node.valueList?.length) {
          reject(new Error('请选择数据值'));
        }
      }
    }

    traverse(treeData as INode|ILeaf);
    resolve(true);
  });
}

/**
 * 将叶子节点提升为关系运算符节点
 * @param Target 目标节点
 */
export function convertLeafToNode(extraProps: ITreeUtilsExtraProps, Target: ILeaf): void {
  const { identifier } = Target;
  const children: ILeaf[] = [{
    ...Target,
    identifier: `${identifier}.children0`,
  }, {
    ...defaultLeafData,
    identifier: `${identifier}.children1`,
  }];
  const newNode: INode = {
    type: NodeType.node,
    relation: Relation.AND,
    main: !!Target.main,
    identifier,
    children,
  };

  setNodeByIdentifier(extraProps, identifier, newNode);
}

/**
 * 为关系运算符节点增加一个叶子节点
 * @param Target 目标节点
 */
export function addChildToNode(extraProps: ITreeUtilsExtraProps, Target: INode): void {
  const { identifier } = Target;
  const newIdentifier = ((): string => {
    const childList = Target.children;
    if (!childList.length) {
      return `${identifier}${CHILDREN_SPLITTER}0`;
    }
    const lastChildId = (_.last(childList) as INode).identifier;
    const pathArray = lastChildId.split(CHILDREN_SPLITTER);
    pathArray[pathArray.length - 1] = String(Number(_.last(pathArray)) + 1);
    return pathArray.join(CHILDREN_SPLITTER);
  })();
  const children = _.cloneDeep(Target.children).concat([{
    ...defaultLeafData,
    identifier: newIdentifier,
  }]);

  setNodeByIdentifier(extraProps, identifier, {
    ...Target,
    children,
  });
}

/**
 * 删除指定的节点
 * @param Target 目标节点
 */
export function deleteTreeNode(extraProps: ITreeUtilsExtraProps, Target: INode|ILeaf): void {
  const { setTreeData } = extraProps;
  const { identifier, main } = Target;
  if (identifier === 'root') {
    setTreeData({});
    return;
  }

  const parentId = identifier.split(CHILDREN_SPLITTER).slice(0, -1).join(CHILDREN_SPLITTER);
  const parentNode = getNodeByIdentifier(extraProps, parentId) as INode;

  if (parentNode.children.length > 2) {
    // 同级节点数大于2，删除后层级不变
    setNodeByIdentifier(extraProps, parentId, {
      ...parentNode,
      children: parentNode.children.filter((item): boolean => item.identifier !== identifier)
        .map((item, index): INode|ILeaf => ({
          ...item,
          main: main ? index === 0 : item.main,
        })),
    });
  } else {
    // 同级只有2个节点，删除后将父节点仅剩的一个child提升为父节点(main属性继承自父节点)
    const onlyChild = {
      ...parentNode.children
        .filter((item): boolean => item.identifier !== identifier)[0] || {},
      main: parentNode.main,
    };
    setNodeByIdentifier(extraProps, parentId, calcNodeWithNewLevel(onlyChild, parentId));
  }
}

/**
 * 更新指定identifier的节点内容
 * @param identifier 节点identifier
 * @param nodeValue 节点新值
 */
export function setNodeByIdentifier({ treeData, setTreeData }: ITreeUtilsExtraProps, identifier: string, nodeValue: INode|ILeaf): void {
  if (identifier === 'root') {
    setTreeData(nodeValue);
  } else {
    const actualPath = getActualPath(treeData as INode, identifier);
    const cloneData = _.cloneDeep(treeData);
    _.set(cloneData, actualPath, nodeValue);
    setTreeData(cloneData);
  }
}

/**
 * 由于删除节点会导致节点在children中的索引和其identifier值有偏差，
 * 故使用此方法通过某节点的identifier获取其实际路径索引，返回结果可
 * 直接用于 _.set() 或 _.get() 中的path参数
 * 如 root.children10.children7 的实际path可能是 children.2.children.1
 * @param Target 节点所在的树
 * @param path identifier
 */
export function getActualPath(Target: Readonly<INode>, path: string): string {
  const pathArr = path.split(CHILDREN_SPLITTER).slice(1);
  let pointer = _.cloneDeep(Target);
  const actualPathArr = [];
  for (let i = 0;i < pathArr.length;i += 1) {
    const index = pointer.children
      .findIndex((item): boolean => pathArr[i] === _.last(item.identifier.split(CHILDREN_SPLITTER)));
    actualPathArr.push(String(index));
    pointer = pointer.children[index] as INode;
  }

  return [''].concat(actualPathArr).join(`${CHILDREN_SPLITTER}.`).slice(1);
}

/**
 * 根据identifier查找节点
 * @param identifier 节点identifier
 */
export function getNodeByIdentifier({ treeData }: ITreeUtilsExtraProps, identifier: string): ITreeData {
  if (identifier === 'root') {
    return treeData;
  } else {
    const actualPath = getActualPath(treeData as INode, identifier);
    return _.get(treeData, actualPath) || {};
  }
}

/**
 * 根据为目标节点指定新的id，递归计算新节点及其children的id
 * @param Target 目标节点
 * @param targetId 目标节点的新id
 */
export function calcNodeWithNewLevel(Target: INode|ILeaf, targetId: string): INode|ILeaf {
  const { identifier } = Target;
  if (Target.type === NodeType.leaf) {
    return {
      ...Target,
      identifier: targetId,
    };
  } else {
    return {
      ...Target,
      identifier: targetId,
      children: Target.children.map((child): INode|ILeaf => calcNodeWithNewLevel(
        child,
        child.identifier.replace(identifier, targetId),
      )),
    };
  }
}
