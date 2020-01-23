import React from 'react'
import './BoardDisplay.css'
import firebaseRef from '../../firebase'
import UserSearch from '../UserSearch/UserSearch'
import { SidebarContext } from '../../Contexts/SidebarContext'
import firebase from 'firebase'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { User } from '../../Models/Users'
import { Board, BoardRef, Module } from '../../Models/Boards'

type props = {
  setBoard(board: BoardRef): void
  board: Board
  modules: Module[]
}

const addUserToBoard = (board: Board, userId: string) => {
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

const BoardDisplay: React.FC<props> = ({ setBoard, board, modules }) => {
  const sidebar = React.useContext(SidebarContext)
  const [newUserId, setNewUserId] = React.useState('')
  const [newModuleName, setNewModuleName] = React.useState('')
  const [newModuleType, setNewModuleType] = React.useState('')
  const [userList, setUserList] = React.useState<string[]>([])
  const [searchedUsers, setSearchedUsers] = React.useState<User[]>([])

  React.useEffect(() => {
    const unsubscribe = firebaseRef
      .firestore()
      .collection('boards')
      .doc(board.id)
      .onSnapshot(snapshot => {
        const members: string[] = snapshot.data()!.members
        const memberNames: string[] = []
        let counter = 0
        members.forEach(member => {
          firebaseRef.firestore().collection('users').doc(member).get().then(doc => {
            memberNames.push(doc.data()!.name)
            counter++
            if (counter === members.length) {
              setUserList(memberNames)
            }
          })
        })
      })
    return unsubscribe
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
      <div className="type-label">[{module.type}]</div>
    </div>
  ))

  const createModule = (
    board: Board,
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
      .then((doc) => {
        setBoard({
          board: board.id,
          moduleType: newModuleType,
          module: doc.id,
        })
        sidebar.setSidebar(undefined)
      })
      .catch((error) => console.log(error))
  }

  return (
    <div className="board">
      <h1>{board.name}</h1>
      <div className="back" onClick={() => sidebar.setSidebar(sidebar.default)}>
        <ArrowBackIcon /> <span> back </span>
      </div>
      {moduleList}
      <br />
      <hr />
      <br />
      <br />
      <p>New module</p>
      <input
        placeholder="Module Name"
        onChange={(e) => setNewModuleName(e.target.value)}
      />
      <select
        defaultValue="a"
        onChange={(e) => setNewModuleType(e.target.value)}
      >
        <option disabled value="a">
          Module type
        </option>
        <option value="todo">Todo</option>
        <option value="chat">Chat</option>
      </select>
      <button
        disabled={newModuleType === '' || newModuleName === ''}
        onClick={() => createModule(board, newModuleName, newModuleType)}
      >
        Create New Module
      </button>
      <br />
      <br />
      <h3>Members</h3>
      {userList.map(user => <li key={user}>{user}</li>)}
      <br />
      <h3> Add New Members </h3>
      <UserSearch callback={setSearchedUsers} />
      {searchedUsers.map(user => 
        <div key={user.id}>
          <div className="searched-user-grid">
            <div className="searched-user-profile-pic">
              <img alt="profile-pic" src={user.picURL} width="100%" height="100%"/>
            </div>
            <div className="searched-user-text">
              {user.name}
            </div>
            <div className="searched-user-text">
              <i>{user.username}</i>
            </div>
            <div>
              <button onClick={() => addUserToBoard(board, user.id)}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default BoardDisplay
