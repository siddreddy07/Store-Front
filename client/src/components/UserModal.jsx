import React from "react";
import { FaStar } from "react-icons/fa";

const UserModal = ({ user, close }) => {
  if (!user) return null;

  const isStoreOwner = user.length>0 ? true : false;

  console.log("User in modal",isStoreOwner)

  return (
    <>
    {isStoreOwner ? 
    
    <div
      className="fixed inset-0 flex w-full items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      onClick={close}
    >
      {
        user.map((u,index)=>(
      <div key={index}
        className="bg-zinc-800 top-0 backdrop-blur-xl rounded-2xl p-6 w-80 text-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-3 text-white font-bold text-xl"
          onClick={close}
        >
          &times;
        </button>
        <div className="flex flex-col items-center gap-4">
          <img
            src="https://img.freepik.com/vector-gratis/ilustracion-compras-linea_53876-5906.jpg?semt=ais_hybrid&w=740"
            alt="Store"
            className="rounded-full w-40 h-40 border-2 border-white/30"
          />
          <h2 className="text-lg font-bold truncate w-64 text-center">{u.name}</h2>
          <p className="text-gray-300 truncate w-64 text-center">{u.address}</p>
          <p className="text-gray-300 truncate w-64 text-center">{u.email}</p>
          {isStoreOwner && (
            <div className="flex items-center gap-1 text-yellow-400">
              <FaStar /> {u.overallRating || 4.5} {/* example rating */}
            </div>
          )}
        </div>
      </div>
      
    ))
      }
    </div>
:''    
}
    </>
  );
};

export default UserModal;
