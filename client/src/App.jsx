import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './Layout'
import HomePage from './pages/HomePage'
import Dashboard from './pages/Dashboard'
import  { Toaster } from 'react-hot-toast';
import { useContext } from 'react'
import { AuthContext } from './contextApi/AuthContext'
import { useEffect } from 'react'

const App = () => {
  
  const {isAuth,checkAuth,user} = useContext(AuthContext)


    useEffect(()=>{

      if(!user){
        checkAuth()
        console.log(isAuth)
      }

    },[user])

  return (
    <div className=''>
      <Toaster
  position="top-center"
  reverseOrder={false}
/>

        <Routes>
            <Route path='/' element={<Layout/>}>
                <Route index element={<HomePage/>}/>
                <Route path='/dashboard/:role' element={isAuth ? <Dashboard/> : <HomePage/>}/>
            </Route>

        </Routes>

    </div>
  )
}

export default App