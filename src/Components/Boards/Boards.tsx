import React from 'react'
import './Boards.css'
import { UserContext } from '../../Contexts/UserContext'
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close'
import BoardTag from '../BoardTag/BoardTag'
import LoadingBar from '../LoadingBar/LoadingBar'
import firebaseRef from '../../firebase'
import firebase from 'firebase'
import { Board, BoardRef } from '../../Models/Boards'

type props = {
  setBoard(board: BoardRef): void
}

const Boards: React.FC<props> = ({ setBoard }) => {
  const user = React.useContext(UserContext)
  const [newBoardName, setNewBoardName] = React.useState('')
  const [addingBoard, setAddingBoard] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const boards = user.boards

  const createBoard = (boardName: string) => {
    firebaseRef.firestore().collection('boards').add({
      creator: user.id,
      members: [user.id],
      name: boardName,
      dateCreated: new Date().getTime()
    }).then(board => firebaseRef.firestore()
      .collection('users').doc(user.id).update({
      boards: firebase.firestore.FieldValue.arrayUnion(board.id)
    })
    )
  }

  const sortByBoardDates = (a: Board, b: Board) => {
    return (a.dateCreated > b.dateCreated) ? 1 : ((b.dateCreated > a.dateCreated) ? -1 : 0) 
  }

  return (
    <div className='boards'>
      <h1 onClick={() => setIsLoading(!isLoading)}>Boards</h1>
      { isLoading && <LoadingBar /> }
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
