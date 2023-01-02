import { ReactElement } from './../../shared/ReactTypes'
import { processUpdateQueue, UpdateQueue } from './updateQueue'
import { HostRoot, HostComponent, HostText } from './workTags'
import { FiberNode } from './fiber'
import { mountChildFibers, updateChildFibers } from './childFibers'

/**
 * 递归中的递阶段
 */
export default function beginWork(wip: FiberNode): FiberNode | null {
  // 返回子 FiberNode
  switch (wip.tag) {
    case HostRoot:
      return updateHostRoot(wip)
    case HostComponent:
      return updateHostComponent(wip)
    case HostText:
      // HostText 无子节点
      return null
    default:
      __DEV__ && console.warn('[beginWork]', `unknown tag: ${wip.tag}`)
      return null
  }
}

/**
 * 1.计算状态最新值
 * 2.创建子 FiberNode
 */
function updateHostRoot(wip: FiberNode): FiberNode | null {
  const baseState = wip.memoizedState
  const updateQueue = wip.updateQueue as UpdateQueue<ReactElement | null>
  const pending = updateQueue.shared.pending
  const { memoizedState } = processUpdateQueue(baseState, pending)
  wip.memoizedState = memoizedState
  const nextChildren = wip.memoizedState
  reconcileChildren(wip, nextChildren)
  return wip.child
}

/**
 * 1.创建子 FiberNode
 */
function updateHostComponent(wip: FiberNode): FiberNode | null {
  const nextProps = wip.pendingProps
  const nextChildren = nextProps.children
  reconcileChildren(wip, nextChildren)
  return wip.child
}

function reconcileChildren(wip: FiberNode, children?: ReactElement) {
  const current = wip.alternate

  if (current === null) {
    // mount
    wip.child = mountChildFibers(wip, null, children)
  } else {
    // update
    wip.child = updateChildFibers(wip, current.child, children)
  }
}
