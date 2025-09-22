import { PrismaClient } from '@prisma/client'

import bcrypt from 'bcrypt'
import { generatetoken } from '../utils/auth.js'



const prisma = new PrismaClient()

export const registerUser = async(req,res)=>{

    try {

        const {name,email,password,address} = req.body

        const existingUser = await prisma.user.findUnique({where:{email}})

        if(existingUser) return res.status(400).json({success:false,message:'user already exists'})

        const hashedPass = await bcrypt.hash(password,10)
        
        const  user = await prisma.user.create({
            data:{name,email,password:hashedPass,address}
        })

        const safeUser = {
  name: user.name,
  id: user.id,
  email:user.email,
  role: user.role,
  address: user.address,
};

        console.log("User Registered Successfully",user.id)

        const isgenerated = await generatetoken(user,res)
        if(isgenerated){
            return res.status(201).json({success:true,user:safeUser,message:"User registered Successfully !"})
        }

        return res.status(401).json({success:false,message:'Error during Token Generation . Try Again Later'})

    } catch (error) {
        console.log("Error in register controller : ",error.message)
            return res.status(500).json({success:false,message:'Internal Server Error',error:error.message})
    }

}


export const checkauth = async(req,res)=>{

    try {
        
        const {id,role} = req.user
        

        let isuser

        if(role.toLowerCase() === 'store'){
            isuser = await prisma.store.findUnique({where:{id}})
        }

        else{
            isuser = await prisma.user.findUnique({where:{id}})
        } 

        if(!isuser) return res.status(401).json({success:false,message:'Not Authorized'})

            const safeuser = {id:isuser.id,name:isuser.name,email:isuser.email,role : role.toLowerCase() === 'store' ? 'store' : isuser.role}

            return res.status(200).json({success:true,message:'Authorized',user:safeuser})

    } catch (error) {

        console.log("Error in CheckUserAuth",error.message)
        return res.status(500).json({success:false,message:'Internal Server error'})

    }

}


export const changepass = async(req,res)=>{

  try {
    
        const {id,role} = req.user

        console.log("id:",id)

        const{ associatedEmail , newPassword} = req.body
        console.log(associatedEmail)
        console.log(newPassword)
        
                  let isuser
                  let updateduser

       if(!id || !associatedEmail || !newPassword) return res.status(401).json({success:false,message:'All Fields are required !'})


        if(role != 'store'){;
             isuser = await prisma.user.findUnique({where:{id,email:associatedEmail}})
             if(!isuser) return res.status(404).json({success:false,message:'Unable to find user'})
              
                const hashedPass = await bcrypt.hash(newPassword,10)

                 updateduser = await prisma.user.update({where:{id,email:associatedEmail},data:{password:hashedPass}})

          }
          else{
            isuser = await prisma.store.findUnique({where:{id,email:associatedEmail}})
             if(!isuser) return res.status(404).json({success:false,message:'Unable to find Store owner'})
              
                const hashedPass = await bcrypt.hash(newPassword,10)
                updateduser = await prisma.user.update({where:{id,email:associatedEmail},data:{password:hashedPass}})
            }

            return res.status(200).json({success:true,message:'Password Updated Successfully!'})



  } catch (error) {
    console.log("Error in Chng Pass : ",error.message)
    return res.status(500).json({success:false,message:'Internal Server Error'})
  }


}



export const loginUser = async(req,res)=>{

    try {

        const {email,password,role} = req.body


        if(!email || !password) return res.status(401).json({success:false,message:'All fields are required'})

            let isuser

            if(role.toLowerCase() === 'store'){
                    isuser = await prisma.store.findUnique({where:{email}})
            }
            else{
                isuser = await prisma.user.findUnique({where:{email}})
            }

            if(!isuser) return res.status(402).json({success:false,message:'No user found!'})
        console.log("userrole",isuser.role)

        if(role != 'store' ? role.toLowerCase() != isuser.role : '') return res.status(401).json({success:false,message:'Error in Role specified credentials'})

        const ispassword = bcrypt.compare(password,isuser.password)
        
        if(!ispassword) return res.status(403).json({success:false,message:'Credentials Error'})

        const isgenerated = await generatetoken(isuser,res)

        if(isgenerated){
            const safeuser = {
            id:isuser.id,
            email:isuser.email,
            role : role.toLowerCase() === 'store' ? 'store' : isuser.role
        }
            return res.status(201).json({success:true,message:"Login Successfull !",user:safeuser})
        }

        

        return res.status(400).json({success:false,message:'Error during Token Generation . Try Again Later'})


        
    } catch (error) {
        console.log("Error in Login controller : ",error.message)
    return res.status(500).json({success:false,message:'Internal Server Error',error:error.message})
    }

}



export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true, 
      secure: false,
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};



export const getAllUsers = async (req, res) => {
  try {
    const { search, role, sortField, sortOrder } = req.query;

    let whereCondition = {};
    if (search) {
      whereCondition.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
      ];
    }
    if (role) {
      whereCondition.role = role;
    }

    let orderBy = { createdAt: "desc" };
    if (sortField && sortOrder && sortOrder !== "All") {
      orderBy = { [sortField]: sortOrder.toLowerCase() };
    }

    const users = await prisma.user.findMany({
      where: whereCondition,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        stores: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
            ownerId: true,
            ratings: { select: { rating: true } },
          },
        },
      },
      orderBy,
    });

    const usersWithStoreInfo = users.map((user) => {
      const stores = user.stores.map((store) => {
        const total = store.ratings.reduce((acc, r) => acc + r.rating, 0);
        const avg = store.ratings.length ? total / store.ratings.length : 0;

        return {
          id: store.id,
          name: store.name,
          email: store.email,
          address: store.address,
          overallRating: avg,
          isOwner: store.ownerId === user.id,
        };
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        stores,
      };
    });

    return res.status(200).json({ success: true, users: usersWithStoreInfo });
  } catch (error) {
    console.log("Error in getAllUsers:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAdminDashboardStats  = async (req,res)=>{

  try {

      const totalUsers = await prisma.user.count()
          const totalStores = await prisma.store.count();
    const totalRatings = await prisma.rating.count();

      return res.status(200).json({
      success: true,
      totalUsers,
      totalStores,
      totalRatings,
    });

  } catch (error) {
     console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }

}


export const addnewUser = async(req,res)=>{

    try {

      const {id,role} = req.user

      if(!id || !role || role != 'admin') return res.status(401).json({success:false,message:'Not Authorized'})

        const {name,email,address,password} = req.body

        const existingUser = await prisma.user.findUnique({where:{email}})

        if(existingUser) return res.status(400).json({success:false,message:'user already exists'})

        const hashedPass = await bcrypt.hash(password,10)
        
        const  user = await prisma.user.create({
            data:{name,email,address,password:hashedPass}
        })

        console.log("User Registered Successfully",user.id)

            return res.status(201).json({success:true,message:"User registered Successfully !"})
    
    } catch (error) {
        console.log("Error in register controller : ",error.message)
            return res.status(500).json({success:false,message:'Internal Server Error',error:error.message})
    }

}