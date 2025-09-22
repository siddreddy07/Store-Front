
import { PrismaClient } from '@prisma/client'
import { raw } from '@prisma/client/runtime/library'
import bcrypt from 'bcrypt'



const prisma = new PrismaClient()



export const getAllStores = async(req,res)=>{

    try {

      const {search,sortField, sortOrder} = req.query

      console.log("Search : ",search)
       const currentUserId = req.user.id;
      const currentUserRole = req.user.role;

      let wherecondition = {}

      if (search) {
  const orConditions = [
    { name: { contains: search, mode: "insensitive" } },
    { address: { contains: search, mode: "insensitive" } },
  ];

  if (currentUserRole === "admin") {
    orConditions.push({ email: { contains: search, mode: "insensitive" } });
  }

  wherecondition = { OR: orConditions };
} else {
  wherecondition = {};
}

let orderBy = {createdAt:"desc"}

if(sortField && sortOrder && sortOrder !== "All"){
  orderBy = {[sortField]:sortOrder.toLowerCase()}
}


      const stores = await prisma.store.findMany({
        where:wherecondition,
        include:{ratings:true},
        orderBy
      })

      const result = stores.map(store=>{

        const totalRatings = store.ratings.length

        const sumRatings = store.ratings.reduce((sum,r)=>sum+r.rating,0)
        const overallRating = totalRatings > 0 ? sumRatings / totalRatings : 0;


        const userRatingobj = store.ratings.find(r=>r.userId === currentUserId)

        const userRating = userRatingobj ? userRatingobj.rating : null

        let storeData

        switch(currentUserRole){
          case "admin":
            storeData = {
              id: store.id,
            name: store.name,
            email: store.email,
            address: store.address,
            ratings: totalRatings,
            avgrating:overallRating
            }
            break

          case "normal":
            storeData={
              id: store.id,
            name: store.name,
            address: store.address,
            overallRating,
            userRating,
            }
            break

             default:
          storeData = {
            id: store.id,
            name: store.name,
            address: store.address,
          };
          break

        }

        return storeData

      })

       return res.json({ success: true, stores: result });


    } catch (error) {
      console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
    }

}


export const addOrUpdateRating = async (req, res) => {
  try {
    const { id } = req.user; 
    const { storeId, rating } = req.body;

    if (!storeId || !rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid store or rating value" });
    }

    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) {
      return res
        .status(404)
        .json({ success: false, message: "Store not found" });
    }

    const existingRating = await prisma.rating.findFirst({
      where: { userId:id, storeId },
    });

    let savedRating;

    if (existingRating) {
      savedRating = await prisma.rating.update({
        where: { id: existingRating.id },
        data: { rating },
      });
    } else {
      savedRating = await prisma.rating.create({
        data: { rating, storeId, userId:id },
      });
    }

    const allRatings = await prisma.rating.findMany({ where: { storeId } });
    const overallRating =
      allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

    return res.status(200).json({
      success: true,
      message: existingRating
        ? "Rating updated successfully"
        : "Rating added successfully",
      rating: savedRating,
      overallRating: overallRating.toFixed(1),
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};



export const addNewStore = async(req,res)=>{

    try {

        const {email,name,address,owneremail,password} = req.body

        let user;

        if(owneremail){
            const isuser = await prisma.user.findUnique({where:{email:owneremail}}) 
            if(!isuser) return res.status(401).json({success:false,message:'Try without owner email if not a user'})

         user = isuser
        }

        const isstoreavailabe = await prisma.store.findUnique({where:{email}})
        
        if(isstoreavailabe) return res.status(402).json({success:false,message:'Store with Email Already Exists'})

            const hashedpassword = await bcrypt.hash(password,10)

            const data = {
  name,
  password: hashedpassword,
  address,
  email,
};

if (user) {
  data.owner = { connect: { id: user.id } };
}

            const newStore = await prisma.store.create({data});


            return res.status(200).json({success:true,message:'Registered Successfully'})

    } catch (error) {
        console.log("error in addnewStore",error.message)
        return res.status(500).json({success:false,message:'Internal server error'})   
    }

}


export const getStoreDatawithUserRatings = async(req,res)=>{

    try {

      const {id} = req.user

      const {sortOrder} = req.query

      let orderBy = {createdAt:"desc"}

      if(sortOrder && sortOrder.toLowerCase() !== 'all'){
        orderBy={user:{name:sortOrder.toLowerCase()}}
      }

      const store = await prisma.store.findUnique({
        where:{id},
        include:{
          ratings:{
            include:{
              user:{
                select:{
                  id:true,
                  name:true
                }
              }
            },
            orderBy
          }
        }
      })

      if(!store) return res.status(404).json({success:false, message: "Store not found" });

      const ratings = store.ratings
      const overallRating = ratings.length > 0 ? ratings.reduce((sum,r) => sum + r.rating,0)/ratings.length : 0

      return res.status(200).json({success:true,message:'Store detials found',store,overallRating})


    } catch (error) {
      console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
    }

}




