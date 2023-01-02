import { HostText } from './workTags'
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols'
import { ReactElement } from './../../shared/ReactTypes'
import { createFiberNodeFromReactElement, FiberNode } from './fiber'
import { Placement } from './fiberFlags'

/**
 * @param shouldTrackEffects 是否追踪副作用
 */
function createChildReconciler(shouldTrackEffects: boolean) {
  return function reconcileChildFibers(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    newChildren?: ReactElement,
  ) {
    if (newChildren == null) {
      return null
    }
    // 单节点情况
    if (typeof newChildren === 'object') {
      switch (newChildren.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(reconcileSingleElement(returnFiber, currentFiber, newChildren), shouldTrackEffects)
        default:
          __DEV__ && console.warn('[reconcileChildFibers]', 'unknown element', newChildren)
          return null
      }
    }

    // TODO: 多节点情况

    // HostText 情况
    if (typeof newChildren === 'string' || typeof newChildren === 'number') {
      return placeSingleChild(reconcileSingleTextElement(returnFiber, currentFiber, newChildren), shouldTrackEffects)
    }

    return null
  }
}

export const updateChildFibers = createChildReconciler(true)
export const mountChildFibers = createChildReconciler(false)

function reconcileSingleElement(
  returnFiber: FiberNode,
  currentFiber: FiberNode | null,
  element: ReactElement,
): FiberNode {
  const fiber = createFiberNodeFromReactElement(element)
  fiber.return = returnFiber
  return fiber
}

function reconcileSingleTextElement(
  returnFiber: FiberNode,
  currentFiber: FiberNode | null,
  content: string | number,
): FiberNode {
  const fiber = new FiberNode(HostText, { content }, null)
  fiber.return = returnFiber
  return fiber
}

function placeSingleChild(fiber: FiberNode, shouldTrackEffects: boolean): FiberNode {
  if (shouldTrackEffects /* 追踪副作用 */ && fiber.alternate === null /* 首屏渲染 */) {
    fiber.flags |= Placement
  }
  return fiber
}
