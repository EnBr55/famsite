import React from 'react'
import './TextInput.css'

type props = {
  placeholder: string
  callback(userInput: string): void
  submitText?: string | JSX.Element
}

const TextInput: React.FC<props> = ({placeholder, callback, submitText}) => {
  const [text, setText] = React.useState('')
  return (
    <div className="text-input">
      <textarea 
        className="text-input-field"
        placeholder={placeholder}
        onChange={e => setText(e.target.value)}
        value={text}
        onKeyDown={e => {
          if (e.key === "Enter") {
            callback(text)
            setText('')
          }
        }}
      ></textarea>
      { submitText && <button className="text-input-button"
        onClick={() => {
          callback(text)
          setText('')
        }}
      >{submitText}</button>}
    </div>
  )
}
    
export default TextInput