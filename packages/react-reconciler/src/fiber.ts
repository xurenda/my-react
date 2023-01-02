import { UpdateQueue } from './updateQueue'
import { FiberFlags, NoFlags } from './fiberFlags'
import { Key, Props, ReactElement, Ref } from 'shared/ReactTypes'
import { FunctionComponent, HostComponent, WorkTag } from './workTags'
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
  updateQueue: UpdateQueue<unknown> | null
  alternate: FiberNode | null
  flags: FiberFlags
  subtreeFlags: FiberFlags

  constructor(tag: WorkTag, pendingProps: Props, key: Key) {
    // 实例属性
    this.tag = tag
    this.key = key
    this.ref = null
    this.type = null // HostComponent: DOM类型string; FunctionComponent: 函数
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
    this.flags = NoFlags // 将进行的操作
    this.subtreeFlags = NoFlags // 子树中节点包含的操作
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
    wip.subtreeFlags = NoFlags
  }
  wip.type = current.type
  wip.updateQueue = current.updateQueue
  wip.child = current.child
  wip.memoizedProps = current.memoizedProps
  wip.memoizedState = current.memoizedState

  return wip
}

/**
 * 根据 ReactElement 创建 FiberNode
 */
export function createFiberNodeFromReactElement(element: ReactElement): FiberNode {
  const { type, key, props } = element
  let fiberTag: WorkTag = FunctionComponent

  if (typeof type === 'function') {
    fiberTag = FunctionComponent
  } else if (typeof type === 'string') {
    fiberTag = HostComponent
  } else {
    __DEV__ && console.warn('[createFiberNodeFromReactElement]', 'unknown element type', element)
  }

  const fiber = new FiberNode(fiberTag, props, key)
  fiber.type = type
  return fiber
}
