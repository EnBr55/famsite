export interface Module {
  id: string
  type: string
  name: string
}

export interface Board {
  members: string[]
  name: string
  id: string
  dateCreated: number
}

export interface BoardRef {
  board: string
  module: string
  moduleType: string
}