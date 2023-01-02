import { HostComponent, HostRoot, HostText } from './workTags'
import { appendChildToContainer, Container } from 'hostConfig'
import { MutationMask, NoFlags, Placement } from './fiberFlags'
import { FiberNode, FiberRootNode } from './fiber'

let nextEffect: FiberNode | null = null

export function commitMutationEffects(finishedWork: FiberNode) {
  nextEffect = finishedWork

  while (nextEffect !== null) {
    // 向下遍历
    const child: FiberNode | null = nextEffect.child
    if (child !== null && (nextEffect.subtreeFlags & MutationMask) !== NoFlags) {
      nextEffect = child
    } else {
      // 向上遍历
      while (nextEffect !== null) {
        commitMutationEffectsOnFiber(nextEffect)
        const sibling: FiberNode | null = nextEffect.sibling
        if (sibling !== null) {
          nextEffect = sibling
          break
        }
        nextEffect = nextEffect.return
      }
    }
  }
}

function commitMutationEffectsOnFiber(finishedWork: FiberNode) {
  let flags = finishedWork.flags

  // Placement
  if ((flags & Placement) !== NoFlags) {
    commitPlacement(finishedWork)
    flags &= ~Placement
  }
}

function commitPlacement(finishedWork: FiberNode) {
  __DEV__ && console.log('[Placement 操作]', finishedWork)
  const hostParent = getHostParent(finishedWork)
  if (hostParent) {
    appendPlacementNodeIntoContainer(finishedWork, hostParent)
  }
}

function getHostParent(fiber: FiberNode): Container | null {
  let parent = fiber.return

  while (parent !== null) {
    const parentTag = parent.tag
    if (parentTag === HostComponent) {
      return parent.stateNode as Container
    }
    if (parentTag === HostRoot) {
      return (parent.stateNode as FiberRootNode).container
    }

    parent = parent.return
  }

  __DEV__ && console.warn('[getHostParent]', 'not found HostParent', fiber)

  return null
}

function appendPlacementNodeIntoContainer(finishedWork: FiberNode, hostParent: Container) {
  const tag = finishedWork.tag
  if (tag === HostComponent || tag === HostText) {
    appendChildToContainer(finishedWork.stateNode, hostParent)
    return
  }
  const child = finishedWork.child
  if (child !== null) {
    appendPlacementNodeIntoContainer(child, hostParent)
    let sibling = child.sibling
    while (sibling !== null) {
      appendPlacementNodeIntoContainer(sibling, hostParent)
      sibling = sibling.sibling
    }
  }
}
