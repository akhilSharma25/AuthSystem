import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import VerifyEmail from './pages/VerifyEmail'
import ResetPass from './pages/ResetPass'
import { ToastContainer, toast } from 'react-toastify';


const App = () => {
  return (
    <div>
      <ToastContainer/>
<Routes>
  <Route path='/' element={<Home/>}/>
  <Route path='/login' element={<Login/>}/>
  <Route path='/email-verify' element={<VerifyEmail/>}/>
  <Route path='/reset-password' element={<ResetPass/>}/>
</Routes>
      
    </div>
  )
}

export default App