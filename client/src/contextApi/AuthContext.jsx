import { useState, useEffect } from "react";
import { createContext } from "react";
import axios from 'axios'

import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";


export const AuthContext = createContext()

export const AuthProvider = ({children}) => {

    const [isAuth,setisAuth] = useState(false)
    const [user, setUser] = useState(null);
    const [modal,setmodal] = useState('login')
    const [menuoptions,setmenuoptions] = useState(() => {
        return localStorage.getItem('menuOption') || null;
    })

    useEffect(() => {
        if (menuoptions) {
            localStorage.setItem('menuOption', menuoptions);
        }
    }, [menuoptions]);

    useEffect(() => {
        checkAuth();
    }, [])



    const navigate = useNavigate()


    const checkAuth = async()=>{

        try {

            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, { withCredentials: true })

            setisAuth(true)
            setUser(res.data.user)
            
          if(res.data.user.role === 'admin') setmenuoptions("Dashboard")
          else if(res.data.user.role === 'normal') setmenuoptions("Stores")
            else {
          setmenuoptions('Dashboard')}

        } catch (error) {
        setisAuth(false);
        setUser(null);
        console.log("Error :",error.message)
        }

    }


    const loginUser = async(formData)=>{
        try {

           const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
      formData,
      { withCredentials: true }
    );

    if (res.data.success) {
      
      setUser(res.data.user);
      setisAuth(true);
      checkAuth()
      toast(res.data.message || "Login successful!", {
        icon: "✅",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });


      return true;
    } else {
      toast(res.data.message || "Login failed!", {
        icon: "⚠️",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });

      return false;
    }

        } catch (error) {
          console.error("Login failed:", error.message);

    toast(
      error?.response?.data?.message ||
        error.message ||
        "Something went wrong!",
      {
        icon: "⚠️",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      }
    );

    return false;
        }
    }


    const registerUser = async (formData) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
      formData,
      { withCredentials: true }
    );

    if (res.data.success) {
      
      setUser(res.data.user); 
      setisAuth(true);

      toast(res.data.message || "Registration successful!", {
        icon: "✅",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });

      return true;
    } else {
      toast(res.data.message || "Registration failed!", {
        icon: "⚠️",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });

      return false;
    }
  } catch (error) {
    console.error("Registration failed:", error);

    toast(
      error?.response?.data?.message ||
        error.message ||
        "Something went wrong!",
      {
        icon: "⚠️",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      }
    );

    return false;
  }
    };

    return (
        <AuthContext.Provider value={{isAuth,user,checkAuth,modal,setmodal,setmenuoptions,menuoptions,registerUser,loginUser}}>
            {children}
        </AuthContext.Provider>
    )

}