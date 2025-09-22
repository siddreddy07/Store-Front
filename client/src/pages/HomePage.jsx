import React from 'react'
import Login from '../components/Login'
import Signup from '../components/Signup'
import { useContext } from 'react'
import { AuthContext } from '../contextApi/AuthContext'

const HomePage = () => { 

  
    const {modal,setmodal} = useContext(AuthContext)

  return (
    <div className='flex items-center justify-center'>
        
        {
            modal == 'signup' ? 
            <Signup/>
              :
            <Login/>

        }
    </div>
  )
}

export default HomePage