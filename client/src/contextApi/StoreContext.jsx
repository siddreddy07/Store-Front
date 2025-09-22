import axios from "axios";
import { createContext, useState } from "react";
import toast from "react-hot-toast";



export const StoreContext = createContext()

export const StoreProvider = ({children})=>{

    const [stores,setstores] = useState(null)


    const fetchstores = async(search = '',sortField,sortOrder)=>{

        try {

            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/store/get-all`,{params: { search: search,sortField,sortOrder }, withCredentials: true })
             if (res.data.success) {
      
      setstores(res.data.stores);
      return res.data.stores;
    } else {
      toast(res.data.message || "No Stores found!", {
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
            toast(res.data.message || "Unable to fetch Stores", {
        icon: "⚠️",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
        }

    }

    const addnewStore = async(formData)=>{

        try {

            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/store/add-store`,formData,{ withCredentials: true })
            
                    if (res.data.success) {
                    toast(res.data.message , {
        icon: "✅",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return true;
    } else {
      toast(res.data.message || "No Stores found!", {
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
            toast(res.data.message||error.message || "Unable to Add Store !", {
        icon: "⚠️",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
        }

    }

    return (
        <StoreContext.Provider value={{fetchstores,stores,setstores,addnewStore}}>
            {children}
        </StoreContext.Provider>
    )
}

