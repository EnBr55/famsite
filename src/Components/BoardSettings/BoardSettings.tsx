import React from 'react'
import './BoardSettings.css'
import firebaseRef from '../../firebase'
//import { UserContext } from '../../Contexts/UserContext'
import { SidebarContext } from '../../Contexts/SidebarContext'
import { Board, BoardRef } from '../../Models/Boards'
import DeleteIcon from '@material-ui/icons/Delete'

type props = {
  board: Board
  setModal?(element: JSX.Element | undefined): void
  setBoard(board: BoardRef | undefined): void
}

const BoardSettings: React.FC<props> = ({board, setModal, setBoard}) => {
  // const user = React.useContext(UserContext)
  const sidebar = React.useContext(SidebarContext)
  const [deleteConfirming, setDeleteConfirming] = React.useState(false)

  const deleteBoard = () => {
    setBoard(undefined)
    sidebar.setSidebar(undefined)
    firebaseRef
      .firestore()
      .collection('boards')
      .doc(board.id)
      .delete()
      .then(_ => {
        setModal && setModal(undefined)
      })
  }

  const deleteButton = () => {
    if (deleteConfirming) {
      return (
        <div className='delete-buttons'>
          <hr />
          Are you sure you want to delete {board.name}?
          <br />
          <button onClick={() => deleteBoard()}>Yes</button>
          <button onClick={() => setDeleteConfirming(false)}>No</button>
          <hr />
        </div>
      )
    } else {
      return (
        <button className='delete-button' onClick={() => setDeleteConfirming(true)}>
          Delete Board <DeleteIcon />
        </button> 
      )
    }
  }

  return (
    <div className='board-settings'>
      Board settings here
      <div className='delete'>
        { deleteButton() }
      </div>
    </div>
  )
}

export default BoardSettings
