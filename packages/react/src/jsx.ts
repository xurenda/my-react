import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols'
import { Type, Key, Ref, Props, ElementType, ReactElement } from 'shared/ReactTypes'

export function createReactElement(type: Type, key: Key, ref: Ref, props: Props): ReactElement {
  const ele = {
    $$typeof: REACT_ELEMENT_TYPE,
    $$mark: 'XiuRan',
    type,
    key,
    ref,
    props,
  }

  return ele
}

export function jsx(type: ElementType, cfg: Record<string, any>, ...maybeChildren: any[]): ReactElement {
  let key: Key = null
  let ref: Ref = null
  const props: Props = {}

  for (const k in cfg) {
    const v = cfg[k]

    if (k === 'key' && v !== undefined) {
      key = v
      continue
    }
    if (k === 'ref' && v !== undefined) {
      ref = v
      continue
    }

    if (Object.prototype.hasOwnProperty.call(cfg, k)) {
      props[k] = v
    }
  }

  const maybeChildrenLen = maybeChildren.length
  if (maybeChildrenLen) {
    if (maybeChildrenLen === 1) {
      props.children = maybeChildren[0]
    } else {
      props.children = maybeChildren
    }
  }

  return createReactElement(type, key, ref, props)
}

export const jsxDEV = (type: ElementType, cfg: Record<string, any>) => jsx(type, cfg)
