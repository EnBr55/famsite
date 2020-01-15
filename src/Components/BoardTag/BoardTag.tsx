import React from 'react'
import './BoardTag.css'
import firebaseRef from '../../firebase'

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

const createModule = (board: board, newModuleName: string, newModuleType: string) => {
  firebaseRef.firestore().collection('boards').doc(board.id).collection('modules').add({
    name: newModuleName,
    type: newModuleType
  }).catch(error => console.log(error))
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
