import { useState } from 'react'
import { Signin } from './Sign/sign'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Signin></Signin>
    </div>
  )
}

export default App
