export type Container = Element
export type Instance = Element

export function createInstance(type: string, props: Record<string, any>): Instance {
  const element = document.createElement(type)
  // TODO: handle props
  return element
}

export function createTextInstance(content: string | number): Text {
  const instance = document.createTextNode(content + '')
  return instance
}

export function appendInitialChild(parent: Container | Instance, child: Instance) {
  parent.appendChild(child)
}

export const appendChildToContainer = appendInitialChild
