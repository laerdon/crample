import { useState } from 'react'
import './App.css'
import './output.css';

import {NextUIProvider} from "@nextui-org/react";

import {Button} from "@nextui-org/button";


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <NextUIProvider>
    <div>
        <h1 className="text-3xl font-bold underline">Vite + React</h1>
        <div className="card">
            <Button onClick={() => setCount((count) => count + 1)}>
            count is {count}
            </Button>
            <p>
            Edit <code>src/App.tsx</code> and save to test HMR
            </p>
        </div>
        <p className="read-the-docs">
            Click on the Vite and React logos to learn more
        </p>
        <Button>Press me</Button>
    </div>
    </NextUIProvider>
    </>
  )
}

export default App
