import React from 'react'
import './BoardTag.css'

type module = {
  id: string
  type: string
  name: string
}

type board = {
  members: string[]
  name: string
  modules: module[]
  id: string
  dateCreated: number
}

type boardRef = {
  board: string
  module: string
  moduleType: string
}

type props = {
  board: board
  toggleSidebar(): void
  setBoard(board: boardRef): void
  toggleSidebar(): void
}

const BoardTag: React.FC<props> = ({ board, setBoard, toggleSidebar }) => {
  return (
    <div className='board-tag'>
      { board.name } { board.modules.map(module => 
        <div className='module' key={module.id} onClick={() => {
          setBoard({ board: board.id, moduleType: module.type, module: module.id })
          toggleSidebar()
        }}>
          { module.name }
        </div>
      )}
    </div>
  )
}

export default BoardTag
