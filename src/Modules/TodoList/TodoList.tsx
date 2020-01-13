import React from 'react'
import './TodoList.css'
import Todo from '../Todo/Todo'

type todo = {
  label: string,
  checked: boolean,
  id: string
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = React.useState<todo[]>([{label: 'egg', checked: false, id: 'a83bak'}])
  
  let todoRender = []
  for (let todo of todos) {
    todoRender.push(
      <Todo label={todo.label} checked={todo.checked} id={todo.id}/>
    )
  }
  return (
    <div className='TodoList' style={{backgroundColor: 'red'}} >
      { todoRender }
    </div>
  )
}

export default TodoList
