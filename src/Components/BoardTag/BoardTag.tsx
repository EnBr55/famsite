import React from 'react'
import './BoardTag.css'
import firebaseRef from '../../firebase'
import { SidebarContext } from '../../Contexts/SidebarContext'
import Board from '../Board/Board'

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
    return unsubscribe
  }, [])

    

  return (
    <div className="board-tag">
      <div onClick={() => sidebar.setSidebar(
        <Board setBoard={setBoard} board={board} modules={modules}/>
      )}>
        {board.name} 
      </div>
    </div>
  )
}

export default BoardTag
