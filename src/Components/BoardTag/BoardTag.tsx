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
  const [loading, setLoading] = React.useState(false)
  const sidebar = React.useContext(SidebarContext)

  React.useEffect(() => {
    setLoading(true)
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
        setLoading(false)
      })
    return unsubscribe
  }, [board.id])

    

  return (
    <div className={loading ? "board-tag disabled" : "board-tag" } onClick={() => !loading && sidebar.setSidebar(
        <BoardDisplay setBoard={setBoard} board={board} modules={modules}/>
      )}>
        {board.name} 
    </div>
  )
}

export default BoardTag
