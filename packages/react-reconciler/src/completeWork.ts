import { NoFlags } from './fiberFlags'
import { appendInitialChild, Container, createInstance, createTextInstance } from 'hostConfig'
import { FiberNode } from './fiber'
import { HostComponent, HostRoot, HostText } from './workTags'

/**
 * 递归中的归阶段
 */
export default function completeWork(wip: FiberNode): null {
  const current = wip.alternate
  const newProps = wip.pendingProps

  switch (wip.tag) {
    case HostRoot:
      // 构建离屏 DOM 树
      bubbleProperties(wip)
      break
    case HostComponent:
      if (current !== null && wip.stateNode) {
        // update
      } else {
        // 1.构建 DOM
        const instance = createInstance(wip.type, newProps)
        // 2.将 DOM 插入到 DOM 树
        appendAllChildren(instance, wip)
        wip.stateNode = instance
      }
      bubbleProperties(wip)
      break
    case HostText:
      if (current !== null && wip.stateNode) {
        // update
      } else {
        // 1.构建 DOM
        const instance = createTextInstance(newProps.content)
        wip.stateNode = instance
      }
      bubbleProperties(wip)
      break
    default:
      __DEV__ && console.warn('[completeWork]', `unknown tag: ${wip.tag}`)
      break
  }

  return null
}

function appendAllChildren(parent: Container, wip: FiberNode) {
  let node = wip.child

  while (node !== null) {
    if (node.tag === HostComponent || node.tag === HostText) {
      appendInitialChild(parent, node.stateNode)
    } else if (node.child !== null) {
      node.child.return = node
      node = node.child
      continue
    }

    if (node === wip) {
      return
    }

    while (node.sibling === null) {
      if (node.return === null || node.return === wip) {
        return
      }
      node = node.return
    }
    node.sibling.return = node.return
    node = node.sibling
  }
}

function bubbleProperties(wip: FiberNode) {
  let subtreeFlags = NoFlags
  let child = wip.child

  while (child !== null) {
    subtreeFlags |= child.subtreeFlags
    subtreeFlags |= child.flags

    child.return = wip
    child = child.sibling
  }

  wip.subtreeFlags |= subtreeFlags
}
