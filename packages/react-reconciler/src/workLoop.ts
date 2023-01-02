import beginWork from './beginWork'
import completeWork from './completeWork'
import { createWorkInProgress, FiberNode, FiberRootNode } from './fiber'
import { HostRoot } from './workTags'

// 正在处理的 FiberNode
let workInProgress: FiberNode | null = null

/**
 * 准备新栈
 */
function prepareFreshStack(root: FiberRootNode) {
  workInProgress = createWorkInProgress(root.current, {})
}

export function scheduleUpdateOnFiber(fiber: FiberNode) {
  // 调度工作
  const root = markUpdateFromFiberToRoot(fiber)
  root && renderRoot(root)
}

function markUpdateFromFiberToRoot(fiber: FiberNode): FiberRootNode | null {
  let node = fiber
  let parent = node.return
  while (parent !== null) {
    node = parent
    parent = node.return
  }

  if (node.tag === HostRoot) {
    return node.stateNode
  }
  return null
}

function renderRoot(root: FiberRootNode) {
  // 初始化
  prepareFreshStack(root)

  // 循环
  do {
    try {
      workLoop()
      break
    } catch (e) {
      __DEV__ && console.warn('[workLoop Error]', e)
      workInProgress = null
    }
  } while (workInProgress !== null)

  const finishedWork = root.current.alternate
  root.finishedWork = finishedWork

  // 依据 wip fiber 树中的 flags 执行具体的 DOM 操作
  // commitRoot(root)
}

function workLoop() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress)
  }
}

function performUnitOfWork(fiber: FiberNode) {
  const next = beginWork(fiber)
  fiber.memoizedProps = fiber.pendingProps

  if (next === null) {
    completeUnitOfWork(fiber)
  } else {
    workInProgress = next
  }
}

function completeUnitOfWork(fiber: FiberNode) {
  let node: FiberNode | null = fiber

  do {
    completeWork(node)
    const sibling = node.sibling
    if (sibling !== null) {
      workInProgress = sibling
      return
    }
    node = node.return
    workInProgress = node
  } while (node !== null)
}
