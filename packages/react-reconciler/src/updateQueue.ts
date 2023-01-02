import { Action } from 'shared/ReactTypes'

export interface Update<State> {
  action: Action<State>
}

export interface UpdateQueue<State> {
  shared: {
    pending: Update<State> | null
  }
}

export function createUpdate<State>(action: Action<State>): Update<State> {
  return {
    action,
  }
}

export function createUpdateQueue<State>(): UpdateQueue<State> {
  return {
    shared: {
      pending: null,
    },
  }
}

export function enqueueUpdate<State>(updateQueue: UpdateQueue<State>, update: Update<State>) {
  updateQueue.shared.pending = update
}

export function processUpdateQueue<State>(
  baseState: State,
  pendingUpdate: Update<State> | null,
): { memoizedState: State } {
  const res = { memoizedState: baseState }

  if (pendingUpdate !== null) {
    const action = pendingUpdate.action
    if (action instanceof Function) {
      res.memoizedState = action(baseState)
    } else {
      res.memoizedState = action
    }
  }

  return res
}
