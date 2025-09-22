import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contextApi/AuthContext'
import axios from 'axios'

const Admindash = () => {

    const {user} = useContext(AuthContext)
    const [admindata, setadmindata] = useState(null)
    const [username, setUsername] = useState('')

    const formatNumber = (num) => {
        if (num === null || num === undefined) return '0';
        
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    useEffect(() => {
        if (user?.name) {
            setUsername(user.name)
        }
    }, [user])

    const fetchadmindata = async() => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/get-admin-data`, {
                withCredentials: true
            })

            if(res.data.success) {
                setadmindata(res.data)
            }
        } catch (error) {
            console.error("Error fetching admin data:", error)
            setadmindata(null)
        }
    }

    useEffect(() => {
        fetchadmindata()
    }, [])


  return (
    <div className='p-6 bg-transparent text-white'>

        <h1 className='text-3xl mb-4 -mt-4 text-center'>Hey 👋 Welcome {username}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        
        <div
          className="p-6 rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-lg"
          
        >
          <h2 className="text-xl font-semibold">Total number of users</h2>
          <p className="text-white font-bold text-2xl mt-2">
            {formatNumber(admindata?.totalUsers)}
          </p>
        </div>

        <div className="p-6 rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-lg text-center">
          <h2 className="text-xl font-semibold mb-2">Total number of stores</h2>
          <p className="text-3xl flex items-center justify-center font-bold text-indigo-400">
            {formatNumber(admindata?.totalStores)}
          </p>
        </div>
        <div className="p-6 rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-lg text-center">
          <h2 className="text-xl font-semibold mb-2">Total number of submitted ratings</h2>
          <p className="text-4xl flex items-center justify-center gap-2 font-bold text-indigo-400">
            {formatNumber(admindata?.totalRatings)} ⭐
          </p>
        </div>
      </div>

    </div>
  )
}

export default Admindash