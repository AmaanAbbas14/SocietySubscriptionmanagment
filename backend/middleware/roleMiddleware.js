const roleMiddleware = (role)=>{

    return (req,res,next)=>{
   
     // Allow ADMINs to access USER routes natively
     if(role === "USER" && req.user.role === "ADMIN") {
         return next();
     }

     if(req.user.role !== role){
      return res.status(403).json({
       message:"Forbidden"
      });
     }
   
     next();
   
    };
   
   };
   
   module.exports = roleMiddleware;