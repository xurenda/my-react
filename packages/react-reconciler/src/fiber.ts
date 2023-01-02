import { FiberFlags, NoFlags } from './fiberFlags'
import { Key, Props, Ref } from 'shared/ReactTypes'
import { WorkTag } from './workTags'
import { Container } from 'hostConfig'

export class FiberNode {
  tag: WorkTag
  key: Key
  ref: Ref | null
  type: any | null
  stateNode: any | null
  return: FiberNode | null
  sibling: FiberNode | null
  child: FiberNode | null
  index: number
  pendingProps: Props
  memoizedProps: Props | null
  memoizedState: any
  updateQueue: unknown
  alternate: FiberNode | null
  flags: FiberFlags

  constructor(tag: WorkTag, pendingProps: Props, key: Key) {
    // 实例属性
    this.tag = tag
    this.key = key
    this.ref = null
    this.type = null // FunctionComponent: 函数
    this.stateNode = null // HostComponent: DOM节点; HostRoot: FiberRootNode

    // 节点关系：构成 Fiber 树
    this.return = null
    this.sibling = null
    this.child = null
    this.index = 0

    // 作为工作单元
    this.pendingProps = pendingProps // 工作之前的属性
    this.memoizedProps = null // 工作完成的属性
    this.memoizedState = null
    this.updateQueue = null
    this.alternate = null // 双缓冲：current 和 workInProgress 交替

    // 副作用
    this.flags = NoFlags // fiber 将进行的操作
  }
}

export class FiberRootNode {
  container: Container
  current: FiberNode
  finishedWork: FiberNode | null

  constructor(container: Container, hostRootFiber: FiberNode) {
    this.container = container
    this.current = hostRootFiber
    hostRootFiber.stateNode = this
    this.finishedWork = null
  }
}

export function createWorkInProgress(current: FiberNode, pendingProps: Props): FiberNode {
  let wip = current.alternate

  if (wip === null) {
    // create

    wip = new FiberNode(current.tag, pendingProps, current.key)
    wip.stateNode = current.stateNode

    current.alternate = wip
    wip.alternate = current
  } else {
    // update

    wip.pendingProps = pendingProps
    // 清除副作用
    wip.flags = NoFlags
  }
  wip.type = current.type
  wip.updateQueue = current.updateQueue
  wip.child = current.child
  wip.memoizedProps = current.memoizedProps
  wip.memoizedState = current.memoizedState

  return wip
}
