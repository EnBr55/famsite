import React from 'react'
import './TodoList.css'
import FirebaseRef from '../../firebase'

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

  const toggleTodo = (todo: todo) => {
    ref.doc(todo.id).set({
      ...todo,
      checked: !todo.checked
    })
  }

  return (
    <div className="TodoList" style={{ backgroundColor: 'red' }}>
      {todos.map((todo) => (
      <div className="todo" onClick={() => toggleTodo(todo)} key={todo.id}>
          {todo.label}{' '}
          <div className="checkbox">{todo.checked && <span>X</span>}</div>
        </div>
      ))}

      <input onChange={(e) => setNewTodoName(e.target.value)} />
      <button
        onClick={() => addNewTodo(newTodoName)}
      >
        Add
      </button>
    </div>
  )
}

export default TodoList
