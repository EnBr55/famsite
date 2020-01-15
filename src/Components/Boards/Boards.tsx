import React from 'react'
import './Boards.css'
import { UserContext } from '../../Contexts/UserContext'
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close'
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
  modules: module[]
  id: string
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
  const [isLoading, setIsLoading] = React.useState(true)

  const createBoard = (boardName: string) => {
    firebaseRef.firestore().collection('boards').add({
      members: [user.id],
      name: boardName,
    }).then(board => firebaseRef.firestore().collection('users').doc(user.id).update({
      boards: firebase.firestore.FieldValue.arrayUnion(board.id)
    })
    )
  }

  React.useEffect(() => {
    const unsubscribe = 
      firebaseRef.firestore().collection('boards').where("members", "array-contains", user.id).onSnapshot(snapshot => {
        const boards: board[] = []
        snapshot.forEach(doc => {
          doc.ref.collection('modules').get().then(modulesCollection => {
            const modules: module[] = []
            modulesCollection.forEach(module => {
              modules.push({ id: module.id, name: module.data().name, type: module.data().type } )
            })
            boards.push({
              members: doc.data().members,
              name: doc.data().name,
              modules: modules,
              id: doc.id
            })
          })
          setBoards(boards)
          setIsLoading(false)
        }
      )
      })
    return unsubscribe
  }, [isLoading])


  return (
    <div className='boards'>
      { boards.map(board => <div>
        { board.name } { board.modules.map(module => 
        <div className='module' onClick={() => setBoard({ board: board.id, moduleType: module.type, module: module.id })}>
          { module.name }
        </div>) }
      </div>) }
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
