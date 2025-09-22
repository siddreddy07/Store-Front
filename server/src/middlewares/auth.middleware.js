import jwt from 'jsonwebtoken'


const JWT_SECRET = process.env.JWT_SECRET 


export const verifyToken = (req,res,next)=>{

    try {

        const {token} = req.cookies

        if(!token) return res.status(401).json({ message: "Not authorized" });

        const decode = jwt.verify(token,JWT_SECRET)
        req.user = decode
        next()

    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }

}