import React from 'react'
import './Board.css'
import firebaseRef from '../../firebase'
import { SidebarContext } from '../../Contexts/SidebarContext'
import firebase from 'firebase'

type module = {
  id: string
  type: string
  name: string
}

type board = {
  members: string[]
  name: string
  id: string
  dateCreated: number
}

type boardRef = {
  board: string
  module: string
  moduleType: string
}

type props = {
  setBoard(board: boardRef): void
  board: board
  modules: module[]
}

const createModule = (
  board: board,
  newModuleName: string,
  newModuleType: string,
) => {
  firebaseRef
    .firestore()
    .collection('boards')
    .doc(board.id)
    .collection('modules')
    .add({
      name: newModuleName,
      type: newModuleType,
    })
    .catch((error) => console.log(error))
}

const addUserToBoard = (board: board, userId: string) => {
  firebaseRef
    .firestore()
    .collection('boards')
    .doc(board.id)
    .update({ members: firebase.firestore.FieldValue.arrayUnion(userId) })
    .then(() => {
      // TODO: check that user exists in database first
      firebaseRef
        .firestore()
        .collection('users')
        .doc(userId)
        .update({ boards: firebase.firestore.FieldValue.arrayUnion(board.id) })
    })
    .catch((e) => console.log(e))
}

const Board: React.FC<props> = ({ setBoard, board, modules }) => {
  const sidebar = React.useContext(SidebarContext)
  const [newUserId, setNewUserId] = React.useState('')
  const moduleList = modules.map((module) => (
    <div
      className="module"
      key={module.id}
      onClick={() => {
        setBoard({
          board: board.id,
          moduleType: module.type,
          module: module.id,
        })
        sidebar.setSidebar(undefined)
      }}
    >
      {module.name}
    </div>
  ))

  return (
    <div className="board">
      <h1>{board.name}</h1>
      <span onClick={() => sidebar.setSidebar(sidebar.default)}>back</span>
      {moduleList}
      <input onChange={(e) => setNewUserId(e.target.value)} />
      <button onClick={() => addUserToBoard(board, newUserId)}>Add User</button>
    </div>
  )
}
export default Board
