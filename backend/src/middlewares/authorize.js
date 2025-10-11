//This middleware check roles to see if it's allowe to enter to a module
export const authorize =(...roles) =>{
    return(req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({ message: 'Access denied'})
        }

        next()
    }
}