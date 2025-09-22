import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contextApi/AuthContext'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const { user,checkAuth ,setmenuoptions} = useContext(AuthContext);
    const [openmodal, setopenmodal] = useState(false);
    const [loggedinuser,setloggedinuser] = useState(user?.name || '')

    const navigate = useNavigate()

    useEffect(() => {
        if (user?.name) {
            setloggedinuser(user.name);
        }
    }, [user]);

    const [formData, setFormData] = useState({
        associatedEmail: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
console.log("User :",user)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear existing errors for this field
        setErrors(prev => ({
            ...prev,
            [name]: undefined // Clear the error for the current field
        }));

        if (value) { 
            if (name === 'associatedEmail') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    setErrors(prev => ({
                        ...prev,
                        associatedEmail: 'Please enter a valid email address'
                    }));
                }
            }

            if (name === 'newPassword') {
                const hasUpperCase = /[A-Z]/.test(value);
                const hasSpecialChar = /[!@#$%^&*]/.test(value);
                const isValidLength = value.length >= 8 && value.length <= 16;

                if (!isValidLength) {
                    setErrors(prev => ({
                        ...prev,
                        newPassword: 'Password must be between 8-16 characters'
                    }));
                } else if (!hasUpperCase) {
                    setErrors(prev => ({
                        ...prev,
                        newPassword: 'Password must contain at least one uppercase letter'
                    }));
                } else if (!hasSpecialChar) {
                    setErrors(prev => ({
                        ...prev,
                        newPassword: 'Password must contain at least one special character'
                    }));
                }

                // Check confirm password match if it exists
                if (formData.confirmPassword) {
                    if (value !== formData.confirmPassword) {
                        setErrors(prev => ({
                            ...prev,
                            confirmPassword: 'Passwords do not match'
                        }));
                    } else {
                        setErrors(prev => ({
                            ...prev,
                            confirmPassword: undefined
                        }));
                    }
                }
            }

            if (name === 'confirmPassword') {
                if (value !== formData.newPassword) {
                    setErrors(prev => ({
                        ...prev,
                        confirmPassword: 'Passwords do not match'
                    }));
                }
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Only check for empty fields on submit
        if (!formData.associatedEmail) {
            newErrors.associatedEmail = 'Email is required';
        }
        if (!formData.newPassword) {
            newErrors.newPassword = 'New password is required';
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        }

        return newErrors;
    };


    const handlelogout = async()=>{
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,{withCredentials:true})

        
        if(res.data.success){

               toast(res.data.message || "Logout Successfull!", {
        icon: "❕",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });   
            setmenuoptions(null)
            navigate('/')
        }

        else{
                  toast(res.data.message || "Unable To Logout!", {
        icon: "❓",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
        }
        

    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/change-password`,formData,{withCredentials:true})

        if(res.data.success){

               toast(res.data.message || "Password Changed successfully!", {
        icon: "🔐",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
            setFormData({
                associatedEmail: '',
                newPassword: '',
                confirmPassword: ''
            });
            
        }

        else{
               toast(res.data.message || "Unable to Change Password", {
        icon: "⚠️",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
        }
        
        setopenmodal(false);
    };

    return (
        <>
            <div className='flex items-center flex-col gap-4 w-full h-full text-white justify-center'>
                <h1 className='text-3xl font-semibold'>Hi 👋 {loggedinuser}</h1>
                <h1 className='text-3xl font-normal'>User Portal</h1>
                <button 
                    onClick={() => setopenmodal(true)} 
                    className='bg-indigo-700 px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-indigo-600 transition'
                >
                    Change Password
                </button>
                <button 
                    onClick={() => handlelogout(true)} 
                    className='bg-zinc-900 px-4 py-2 rounded-lg text-red-600 font-semibold cursor-pointer hover:bg-zinc-900 transition'
                >
                    Logout
                </button>
            </div>

            {openmodal && (
                <>
                    <div 
                        className="fixed inset-0 bg-white/5 backdrop-blur-xl z-40"
                        onClick={() => setopenmodal(false)}
                    />

                    <div className="fixed top-60 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 rounded-2xl bg-zinc-800 backdrop-blur-xl border border-white/20 shadow-2xl z-50">
                        <h3 className="text-xl font-semibold text-white mb-4">Update Password</h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Associated Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-1">
                                    Associated Email
                                </label>
                                <input
                                    type="email"
                                    name="associatedEmail"
                                    value={formData.associatedEmail}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter your email"
                                />
                                {errors.associatedEmail && (
                                    <p className="mt-1 text-sm text-red-400">{errors.associatedEmail}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-1">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter new password"
                                />
                                {errors.newPassword && (
                                    <p className="mt-1 text-sm text-red-400">{errors.newPassword}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-1">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Confirm new password"
                                />
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setopenmodal(false)}
                                    className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                                >
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </>
    );
}

export default Settings