import React from 'react'
import './TodoList.css'
import FirebaseRef from '../../firebase'
import Delete from '@material-ui/icons/Delete'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import TextInput from '../../Components/TextInput/TextInput'

type todo = {
  label: string
  checked: boolean
  dateAdded: number
  id: string
}

type props = {
  boardId: string
  moduleId: string
}

const TodoList: React.FC<props> = ({ boardId, moduleId }) => {
  const [todos, setTodos] = React.useState<todo[]>([])
  const [title, setTitle] = React.useState('')

  const ref = FirebaseRef.firestore()
    .collection('boards')
    .doc(boardId)
    .collection('modules')
    .doc(moduleId)
    .collection('data')

  React.useEffect(() => {
    FirebaseRef.firestore()
      .collection('boards')
      .doc(boardId)
      .collection('modules')
      .doc(moduleId)
      .get()
      .then((doc) => setTitle(doc.data()!.name || 'Todo List'))
    const unsubscribe = ref.onSnapshot((snapshot) => {
      const newTodos: todo[] = []
      snapshot.forEach((doc) => {
        newTodos.push({
          label: doc.data().label,
          checked: doc.data().checked,
          id: doc.id,
          dateAdded: doc.data().dateAdded
        })
      })
      setTodos(newTodos)
    })
    return unsubscribe
  }, [boardId, moduleId])

  const addNewTodo = (label: string) => {
    ref.add({
      label: label,
      checked: false,
      dateAdded: new Date().getTime(),
    })
  }

  const deleteTodo = (id: string) => {
    ref
      .doc(id)
      .delete()
      .catch((error) => {
        console.log('Error deleting doc: ' + error)
      })
  }

  const toggleTodo = (todo: todo) => {
    ref.doc(todo.id).set({
      ...todo,
      checked: !todo.checked,
    })
  }

  const sortByDate = (a: todo, b: todo) => {
   return (a.dateAdded > b.dateAdded) ? 1 : ((b.dateAdded > a.dateAdded) ? -1 : 0) 
  }

  return (
    <div className="TodoList">
      <h1>{title}</h1>
      {todos.sort(sortByDate).map((todo) => (
        <div className="todo" key={todo.id}>
          <div className="bin" onClick={() => deleteTodo(todo.id)}>
            <Delete />
          </div>
          <div className="label">{todo.label} </div>
          <div className="checkbox" onClick={() => toggleTodo(todo)}>
            {todo.checked ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
          </div>
        </div>
      ))}
      <div className="adding">
        <TextInput placeholder={'Todo label'} callback={addNewTodo} submitText={'Add'} />
      </div>
    </div>
  )
}

export default TodoList
