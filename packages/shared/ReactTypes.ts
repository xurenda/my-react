export type Type = any
export type Key = any
export type Ref = any
export type Props = any
export type ElementType = any

export interface ReactElement {
  $$typeof: symbol | number
  $$mark: string
  type: ElementType
  key: Key
  ref: Ref
  props: Props
}
