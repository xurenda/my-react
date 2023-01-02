import { ReactElement } from './../../shared/ReactTypes'
import { FiberNode, FiberRootNode } from './fiber'
import { Container } from 'hostConfig'
import { HostRoot } from './workTags'
import { createUpdate, createUpdateQueue, enqueueUpdate, UpdateQueue } from './updateQueue'
import { scheduleUpdateOnFiber } from './workLoop'

export function createContainer(container: Container): FiberRootNode {
  const hostRootFiber = new FiberNode(HostRoot, {}, null)
  const root = new FiberRootNode(container, hostRootFiber)
  hostRootFiber.updateQueue = createUpdateQueue()

  return root
}

export function updateContainer(element: ReactElement | null, root: FiberRootNode): ReactElement | null {
  const hostRootFiber = root.current
  const update = createUpdate(element)
  enqueueUpdate(hostRootFiber.updateQueue as UpdateQueue<ReactElement | null>, update)
  scheduleUpdateOnFiber(hostRootFiber)

  return element
}
