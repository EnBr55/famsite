import React from 'react'
import './TextInput.css'

type props = {
  placeholder: string
  onChange?(newValue: string): void
  callback?(userInput: string): void
  submitText?: string | JSX.Element
}

const handleResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  e.target.style.height = 'inherit'
  e.target.style.height = `${e.target.scrollHeight / 1.3}px`
}

const TextInput: React.FC<props> = ({placeholder, callback, onChange, submitText}) => {
  const [text, setText] = React.useState('')
  const [expanded, setExpanded] = React.useState(false)
  return (
    <div className="text-input">
      <textarea 
        className="text-input-field"
        placeholder={placeholder}
        onFocus={e => setExpanded(true)}
        onBlur={e => setExpanded(false)}
        style={{width: expanded ? '100%' : '50%'}}
        onChange={e => {
          setText(e.target.value)
          onChange && onChange(e.target.value)
          handleResize(e)
        }}
        value={text}
        onKeyDown={e => {
          if (e.key === "Enter" && callback) {
            callback(text)
            setText('')
          }
        }}
      ></textarea>
      { submitText && <button className="text-input-button"
        onClick={() => {
          callback && callback(text)
          setText('')
        }}
      >{submitText}</button>}
    </div>
  )
}
    
export default TextInput