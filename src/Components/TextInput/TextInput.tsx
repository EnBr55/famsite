import React from 'react'
import './TextInput.css'

type props = {
  placeholder: string
  callback(userInput: string): void
}

const TextInput: React.FC<props> = ({placeholder, callback}) => {
  const [text, setText] = React.useState('')
  return (
    <div className="text-input">
      <input 
        placeholder={placeholder}
        onChange={e => setText(e.target.value)}
        value={text}
        onKeyDown={e => {
          if (e.key === "Enter") {
            callback(text)
            setText('')
          }
        }}
      ></input>
    </div>
  )
}
    
export default TextInput