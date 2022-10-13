import { useState } from 'react'
import { Signin, Signup } from './pages/sign'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Signin></Signin>
      <Signup></Signup>
    </div>
  )
}

export default App
