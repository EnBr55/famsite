import React from 'react'
import './Boards.css'
import { UserContext } from '../../Contexts/UserContext'
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close'
import BoardTag from '../BoardTag/BoardTag'
import firebaseRef from '../../firebase'
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
}

const Boards: React.FC<props> = ({ setBoard }) => {
  const user = React.useContext(UserContext)
  const [newBoardName, setNewBoardName] = React.useState('')
  const [addingBoard, setAddingBoard] = React.useState(false)
  const [boards, setBoards] = React.useState<board[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  const createBoard = (boardName: string) => {
    firebaseRef.firestore().collection('boards').add({
      members: [user.id],
      name: boardName,
      dateCreated: new Date().getTime()
    }).then(board => firebaseRef.firestore()
      .collection('users').doc(user.id).update({
      boards: firebase.firestore.FieldValue.arrayUnion(board.id)
    })
    )
  }

  React.useEffect(() => {
    const unsubscribe = 
      firebaseRef.firestore().collection('boards')
      .where('members', 'array-contains', user.id)
      .onSnapshot(snapshot => {
      const snapshotBoards: board[] = []
        if (snapshot.size > 0) { setIsLoading(true) }
        snapshot.forEach(doc => {
            snapshotBoards.push({
              members: doc.data().members,
              name: doc.data().name,
              id: doc.id,
              dateCreated: doc.data().dateCreated
            })
        })
        setIsLoading(false)
        setBoards(snapshotBoards)
      })
    return unsubscribe
  }, [])

  const sortByBoardDates = (a: board, b: board) => {
   return (a.dateCreated > b.dateCreated) ? 1 : ((b.dateCreated > a.dateCreated) ? -1 : 0) 
  }

  return (
    <div className='boards'>
      <h1 onClick={() => setIsLoading(!isLoading)}>Boards</h1>
      { isLoading && 'Loading boards...' }
      { boards.sort(sortByBoardDates).map(board =>
        <BoardTag key={board.id} board={board} setBoard={setBoard} />
      )}
        <hr />
        <br />
      <div className='new'>
        { addingBoard && (
        <>
        <input className='new-board' placeholder="Board Name" onChange={e => setNewBoardName(e.target.value)} />
        <button onClick={() => createBoard(newBoardName)}>Create</button>
        <CloseIcon className='hoverable' onClick={() => setAddingBoard(false)}/>
        </>
        )}
        { !addingBoard && <>
          New Board 
          <AddIcon className='hoverable' onClick={() => setAddingBoard(true)}/>
        </>}
      </div>
    </div>
  )
}

export default Boards
