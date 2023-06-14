import { useState,useEffect,createContext } from 'react'
import { Home } from './pages/home/home'
import {Routes,Route} from 'react-router-dom'
import { Questions } from './pages/question/question'
import { FinalScore } from './pages/finish/FinalScore'
import axios from 'axios'
import './App.css'

interface examQuestion{
  id:number;
  word:string;
}

export interface ExamContextInterface{
  Questions:examQuestion[];
  currentQuestion:number;
  score:number;
  progress:number;
  next:number;
}

export const  ExamContext = createContext()

function App() {
  const [exam, setExam] = useState<ExamContextInterface>({
    Questions:[],
    currentQuestion:0,
    score:0,
    progress:0,
    next:0
  });

  useEffect(()=>{
    axios.get('http://localhost:3000').then((res)=>{
     setExam((oldValue:ExamContextInterface)=>{
      return{
        ...oldValue,
        Questions:res.data,
        currentQuestion:res.data[0],
        progress:0,
        next:0
        
      }
    
     })
    })
},[])
  
  return (
    <>
    <ExamContext.Provider value={{exam,setExam}}>
    <Routes>
      <Route path="/"  element={ <Home/>}></Route>
      <Route path="/question/:id"  element={<Questions/> }></Route>
      <Route path="/finish"  element={ <FinalScore/>}></Route>
    </Routes> 
    </ExamContext.Provider>

     
     
    </>
  )
}

export default App
