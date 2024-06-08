require('dotenv').config()
const port = process.env.PORT

const express = require("express")
const expressSession = require('express-session')
const cookieParser = require('cookie-parser')
const multer = require('multer')
const cors = require('cors');

const app = express()

const upload = multer();

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
  }));

app.use(express.json())

app.use(cookieParser())

app.use(expressSession({
  secret: 'Misha Necron',
  cookie: {
    secure:false,
    //cookie นาน 3 ชั่วโมง
    maxAge:1000*60*60*1
  }
}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // Replace with your React app's domain
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next()
});

//GET CONTROLLER
const homeController = require('./controllers/SystemAndAuth/homeController')
const logoutController = require('./controllers/SystemAndAuth/logoutController')
const fetchSpecificUserInfoController = require('./controllers/UserInfo/fetchSpecificUserInfoController')
const adminController = require('./controllers/Admin/adminController')
const arrayBasicInfoController = require('./controllers/EbookInfo/arrayBasicInfoController')
const selectBasicInfoController = require('./controllers/EbookInfo/selectBasicInfoController')
const arrayFilterInfoController = require('./controllers/EbookInfo/arrayFilterInfoController')
const arrayBasicInfo_resultController = require('./controllers/EbookInfo/arrayBasicInfo_resultController')
const fetchEmailController = require('./controllers/UserInfo/fetchEmailController')
const arrayWatchListInfoController = require('./controllers/EbookInfo/arrayWatchListInfoController')
const arrayGenreController = require('./controllers/EbookInfo/arrayGenreController')
const arrayAuthorController = require('./controllers/EbookInfo/arrayAuthorController')
const otherDataController = require('./controllers/EbookInfo/otherDataController')
const fetchCommentController = require('./controllers/EbookUserInfo/fetchCommentController')
const pdfController = require('./controllers/EbookInfo/pdfController')

//POST CONTROLLER
const registerUserController = require('./controllers/SystemAndAuth/registerUserController')
const loginUserController = require('./controllers/SystemAndAuth/loginUserController')
const createEbookController = require('./controllers/Admin/createEbookController')
const createCommentController = require('./controllers/SystemAndAuth/createCommentController')
const createToWatchListController = require('./controllers/EbookUserInfo/createToWatchListController')

//DELETE CONTROLLER
const deleteEbookController = require('./controllers/Admin/deleteEbookController')
const deleteCommentController = require('./controllers/EbookUserInfo/deleteCommentController')
const deleteWatchListController = require('./controllers/SystemAndAuth/deleteWatchListController')

//PUT CONTROLLER
const updateEbookController = require('./controllers/Admin/updateEbookController')
const updateProfileController = require('./controllers/SystemAndAuth/updateProfileController')


//Middleware
const LoginAuthMiddleware = require('./middleware/LoginAuthMiddleware')

//GET route

//Ebook data
app.get("/api/array_basic_info", arrayBasicInfoController)
app.get("/api/select_basic_info", selectBasicInfoController)
app.get("/api/array_filter_info", arrayFilterInfoController)
app.get("/api/array_basic_info_watch_list", arrayWatchListInfoController)
app.get('/api/other_data', otherDataController)
app.get('/api/test_pdf', pdfController)
app.get("/api/array_basic_info_result", arrayBasicInfo_resultController)

//user data
app.get("/api/user_specific_info", fetchSpecificUserInfoController)
app.get("/api/email", fetchEmailController)

// EbookUser data
app.get("/api/comment", fetchCommentController)

//System
app.get("/", LoginAuthMiddleware, homeController)
app.get("/api/logout", logoutController)

//Admin
app.get("/api/admin", adminController)
app.get("/api/array_genre", arrayGenreController)
app.get("/api/array_author", arrayAuthorController)
// app.get("/api/admin/user_table", userTableController)

//POST route
app.post("/api/user/register", registerUserController)
app.post("/api/user/login", loginUserController)
app.post("/api/admin/createEbook", upload.fields([
    { name: 'ebookImage', maxCount: 1 }, // Expect single image upload
    { name: 'ebookFile', maxCount: 24 } // Expect up to 24 video uploads
]), createEbookController)

app.post("/api/user/createComment", createCommentController)
app.post("/api/user/to_watch_list", createToWatchListController)

//DELETE route
app.delete("/api/admin/deleteEbook/:title", deleteEbookController)
app.delete("/api/user/comment/:comment_id",deleteCommentController)
app.delete("/api/user/delete_watch_list/:title",deleteWatchListController)

//UPDATE route
app.put("/api/admin/updateEbook", upload.fields([
    { name: 'ebookImage', maxCount: 1 },
    { name: 'ebookFile', maxCount: 24 } 
]), updateEbookController)
app.put("/api/user/update_user_profile", upload.fields([
    { name: 'image', maxCount: 1 }, // Expect single image upload
]), updateProfileController)

app.listen(port, () => console.log(`backend running on port ${port}`))