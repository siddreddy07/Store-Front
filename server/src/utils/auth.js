

import jwt from 'jsonwebtoken'

export async function generatetoken (user,res) {

    try {
        const token = jwt.sign({id:user.id,role:user?.role ? user?.role:'store'},process.env.JWT_SECRET,{expiresIn:'2d'})
    
            res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 2 * 24 * 60 * 60 * 1000
            });
            console.log("Token Generation and set successfully!")
        return true
    } catch (error) {
        console.log("Error in token generation : ",error.message)
        return false

    }

}