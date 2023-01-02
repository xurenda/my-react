import beginWork from './beginWork'
import completeWork from './completeWork'
import { FiberNode } from './fiber'

// 正在处理的 FiberNode
let workInProgress: FiberNode | null = null

/**
 * 准备新栈
 */
function prepareFreshStack(fiber: FiberNode) {
  workInProgress = fiber
}

function renderRoot(root: FiberNode) {
  // 初始化
  prepareFreshStack(root)

  // 循环
  do {
    try {
      workLoop()
      break
    } catch (e) {
      console.warn('[workLoop Error]', e)
      workInProgress = null
    }
  } while (workInProgress !== null)
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

export {}
