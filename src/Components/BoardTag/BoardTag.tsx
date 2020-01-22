import React from 'react'
import './BoardTag.css'
import firebaseRef from '../../firebase'
import { SidebarContext } from '../../Contexts/SidebarContext'
import BoardDisplay from '../BoardDisplay/BoardDisplay'
import { Board, BoardRef, Module } from '../../Models/Boards'

type props = {
  board: Board
  setBoard(board: BoardRef): void
}

const BoardTag: React.FC<props> = ({ board, setBoard }) => {
  const [modules, setModules] = React.useState<Module[]>([])
  const sidebar = React.useContext(SidebarContext)

  React.useEffect(() => {
    const unsubscribe = firebaseRef
      .firestore()
      .collection('boards')
      .doc(board.id)
      .collection('modules')
      .onSnapshot((snapshot) => {
        const snapshotModules: Module[] = []
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
    <div className="board-tag" onClick={() => sidebar.setSidebar(
        <BoardDisplay setBoard={setBoard} board={board} modules={modules}/>
      )}>
        {board.name} 
    </div>
  )
}

export default BoardTag
