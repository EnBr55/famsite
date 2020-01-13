import React from 'react'
import './Todo.css'

type props = {
  label: string,
  checked: boolean,
  id: string
}

const Todo: React.FC<props> = ({ label, checked, id }) => {
  const toggleTodo = () => {
    console.log('toggled')
  }

  return (
    <div className='todo' onClick={() => {toggleTodo()}}>
      {label} <div className='checkbox'>{checked && <span>X</span>}</div>
    </div>
  )
}

export default Todo
