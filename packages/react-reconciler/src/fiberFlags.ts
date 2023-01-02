export type FiberFlags = number

export const NoFlags = 0b00000001
export const Placement = 0b00000010 // 添加（安置）节点
export const Update = 0b00000100 // 更新节点
export const ChildDeletion = 0b00001000 // 删除子节点
