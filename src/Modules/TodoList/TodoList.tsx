import React from 'react'
import './TodoList.css'
import FirebaseRef from '../../firebase'
import Delete from '@material-ui/icons/Delete'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

type todo = {
  label: string
  checked: boolean
  id: string
}

type props = {
  boardId: string
  moduleId: string
}

const TodoList: React.FC<props> = ({ boardId, moduleId }) => {


  const [todos, setTodos] = React.useState<todo[]>([])

  const ref = 
    FirebaseRef.firestore()
    .collection('boards')
    .doc(boardId)
    .collection('modules')
    .doc(moduleId)
    .collection('data')

  React.useEffect(() => {
    const unsubscribe = 
      ref.onSnapshot( snapshot => {
        const newTodos: todo[] = []
        snapshot.forEach(doc => {
          newTodos.push({label: doc.data().label, checked: doc.data().checked, id: doc.id})
        }
      )
      setTodos(newTodos)
      })
    return unsubscribe

  }, [boardId, moduleId])

  const [newTodoName, setNewTodoName] = React.useState('')

  const addNewTodo = (label: string) => {
    ref.add({
      label: label,
      checked: false,
    })
  }

  const deleteTodo = (id: string) => {
    ref.doc(id).delete().catch(error => {
      console.log('Error deleting doc: '+error)
    })
  }

  const toggleTodo = (todo: todo) => {
    ref.doc(todo.id).set({
      ...todo,
      checked: !todo.checked
    })
  }

  return (
    <div className="TodoList" >
      {todos.map((todo) => (
      <div className="todo" key={todo.id}>
        <div className="bin" onClick={() => deleteTodo(todo.id)} >
          <Delete /> 
        </div>
        <div className="label">
          {todo.label}{' '}
        </div>
        <div className="checkbox" onClick={() => toggleTodo(todo)} >
          { todo.checked ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon /> } 
        </div>
      </div>
      ))}
      <div className="adding" >
        <input onChange={(e) => setNewTodoName(e.target.value)} />
        <button
          onClick={() => addNewTodo(newTodoName)}
        >
          Add
        </button>
      </div>
    </div>
  )
}

export default TodoList
