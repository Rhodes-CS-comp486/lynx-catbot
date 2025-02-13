import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useEffect } from 'react'
import api from './api'

function App() {
  const [count, setCount] = useState(0)

  fetch('http://localhost:8000/api/test')
    .then(response => response.json())
    .then(data => console.log('Backend response:', data))
    .catch(error => console.error('Error:', error));

  return (
    <>
      <button >Test</button>
    </>
  )
}

export default App
