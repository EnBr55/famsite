import React from 'react'
import './BoardTag.css'
import firebaseRef from '../../firebase'
import { SidebarContext } from '../../Contexts/SidebarContext'

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
  board: board
  setBoard(board: boardRef): void
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

const BoardTag: React.FC<props> = ({ board, setBoard }) => {
  const [modules, setModules] = React.useState<module[]>([])
  const sidebar = React.useContext(SidebarContext)

  React.useEffect(() => {
    const unsubscribe = firebaseRef
      .firestore()
      .collection('boards')
      .doc(board.id)
      .collection('modules')
      .onSnapshot((snapshot) => {
        const snapshotModules: module[] = []
        snapshot.forEach((doc) => {
          snapshotModules.push({
            id: doc.id,
            name: doc.data().name,
            type: doc.data().type,
          })
        })
        setModules(snapshotModules)
      })
  }, [])

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
    <div className="board-tag">
      <div onClick={() => sidebar.setSidebar(<div>
          <span onClick={() => sidebar.setSidebar(sidebar.default)}>back</span>
          {moduleList}
        </div>)}>
        {board.name} 
      </div>
    </div>
  )
}

export default BoardTag
