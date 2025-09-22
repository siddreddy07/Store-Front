import React, { useContext, useEffect, useState } from "react";
import Userstable from "../components/Userstable";
import { FaTachometerAlt, FaUsers, FaStore, FaCog } from "react-icons/fa";
import Storetable from "../components/Storetable";
import StoreOwnerDashboard from "../components/storeowner/StoreOwnerDashboard";
import StoreTable from "../components/Storetable";
import { useParams } from "react-router-dom";
import { AuthContext } from "../contextApi/AuthContext";
import HomePage from "./HomePage";
import Admindash from "../components/Admindash";
import Settings from "../components/Settings";

const Dashboard = () => {

  const {user, setmenuoptions, menuoptions} = useContext(AuthContext)
  const [selectedoption, setselectedoption] = useState(menuoptions)


  useEffect(() => {
    if (menuoptions) {
      setselectedoption(menuoptions);
    }
  }, [menuoptions])



  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt /> },
    { name: "Users", icon: <FaUsers /> },
    { name: "Stores", icon: <FaStore /> },
    { name: "Settings", icon: <FaCog /> },
  ];

  const [userRole,setuserRole] = useState(null)

  const {role} = useParams()

  let visibleMenu=[]
useEffect(()=>{
  if(user.role === role) {
    setuserRole(user.role)
  }

},[user,role])

  console.log("Userrole",userRole)
  

  switch(userRole) {
    case "normal":
      visibleMenu = menuItems.filter(item=>item.name==="Stores" || item.name==="Settings")
      break
    
    case "admin":
      visibleMenu = menuItems
      break;

    case "store":
      visibleMenu= menuItems.filter(item=>item.name==="Dashboard" || item.name==="Settings")
      break

      default:
        visibleMenu=[]
  }

  console.log("User : ",user)

  return (
    
    <div className="w-full min-h-[80vh] bg-transparent p-2 sm:p-4 md:p-6">
      
      {
        user.role === role ?
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-2 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl p-3 sm:p-4 lg:p-4">
          
          <div className="hidden lg:block">
            <h2 className="font-bold text-white text-lg text-left mb-2">Menu</h2>
            <hr className="h-1 rounded-xl mb-3 bg-indigo-700/50" />
            <ul className="space-y-2 text-gray-200 text-sm">
              {visibleMenu.map((item, idx) => (
                <li onClick={()=> {setselectedoption(item.name)
                  setmenuoptions(item.name)
                }}
                  key={idx}
                  className={`${item.name === selectedoption ? 'bg-indigo-800/50':''} p-2 rounded-md cursor-pointer transition flex items-center gap-2`}
                >
                  {item.icon}
                  {item.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex lg:hidden justify-around text-white text-xl">
            {visibleMenu.map((item, idx) => (
              <div
                key={idx}
                onClick={()=> {setselectedoption(item.name)
                  setmenuoptions(item.name)}}
                className={`${item.name === selectedoption ? 'bg-indigo-800/50':''} p-2 rounded-md cursor-pointer transition flex items-center gap-2`}
              >
                {item.icon}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-10 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl lg:p-6 min-h-[400px]">
          {selectedoption === "Dashboard" && user.role === "store" && (
            <StoreOwnerDashboard />
          )}
          {selectedoption === "Dashboard" && user.role === 'admin' && (
            <Admindash/>
          )}
          {selectedoption === "Users" && user.role === "admin" && (
            <Userstable />
          )}
          {selectedoption === "Stores" && (
            <StoreTable />
          )}
          {selectedoption === "Settings" && (
            <div className="w-full h-full">
              <Settings/>
            </div>
          )}
          {!selectedoption && !menuoptions && (
            <div className="text-white text-center">
              <h2 className="text-2xl font-semibold mb-4">Welcome, {user.name}</h2>
              <p>Please select an option from the menu to get started.</p>
            </div>
          )}
        </div>
      </div>
    : <HomePage/>
      }
    </div>
  );
};

export default Dashboard;
