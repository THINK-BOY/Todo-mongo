const jwt=require('jsonwebtoken')

function authmiddleware(req,res,next){
    const token=req.headers.token;

    if(!token){
        res.status(401).json({
            message: "token not provided"
        })
        return
    }

    try{
        const decode=jwt.verify(token,"pass123")
        const username=decode.username;
        req.username=username;
        next();
    }catch(err){
        res.status(401).json({
            message: "invalid token"
        })
    }


}

module.exports={
    authmiddleware: authmiddleware
};