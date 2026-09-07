import { useState, useEffect } from 'react'
import { loadLibrary, startReading, finishedReading, removeBook,saveLibrary } from './storage.js'
import Home from './pages/Home.jsx'
import Library  from './pages/Library.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import RootLayout  from './layouts/RootLayout.jsx';

function App(){
  const [library, setLibrary] = useState(loadLibrary)
    useEffect(()=>{
      saveLibrary(library);
    },[library])

console.log(library)
return( 
<BrowserRouter>
  <div>
<Routes>
    <Route path='/' element = {<RootLayout library={library} setLibrary={setLibrary}/>}>
      <Route index element={<Home/>} />
      <Route path='library' element={<Library
      setLibrary={setLibrary}
      library={library} onRemove={(id) => 
        setLibrary(removeBook(library,id))} 
        onStartReading={(id) => 
        setLibrary(startReading(library,id))} 
        onFinishReading={(id) => 
        setLibrary(finishedReading(library,id))} />} />
    </Route>  
</Routes>

  </div>
</BrowserRouter>
)

}
export default App



