//เป็น route ที่ทำงานร่วมกับ muiddleware LoginAuth

module.exports = (req, res) =>{
    const auth = req.auth
    res.json(auth)
}