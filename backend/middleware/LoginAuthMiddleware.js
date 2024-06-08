module.exports = (req, res, next) =>{

    //สร้างตัวแปรส่งไปให้ callback การทำงานหลัก
    // req.misha = "Misha มาจาก Middleware"

    if (req.session.user) {

        //สร้างตัวแปรที่ชื่อว่า auth
        req.auth = {valid: true, username:req.session.user}
    }
    else{
        console.log(req.session.user)
        req.auth = {valid:false}
    }
    
    next();
}