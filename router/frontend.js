const router = require('express').Router()
const regc = require('../controller/regcontroller')
const multer = require('multer')
const nodemailer = require('nodemailer')

let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/upload')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

let upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 4 }
})

function handlelogin(req, res, next) {
    if (req.session.isAuth) {
        next()
    } else {
        res.redirect('/login')
    }

}

function handlerole(req, res, next) {
    if (req.session.role == 'pvt') {
        next()
    } else {
        res.send("you don't have rights to see this page")
    }
}


router.get('/', handlelogin, regc.homepage)
router.get('/reg', regc.regform)
router.post('/reg', regc.reginsert)
router.get('/login', regc.loginshow)
router.post('/login', regc.logincheck)
router.get('/logout', regc.logout)
router.get('/emailverify/:email', regc.emailverify)
router.get('/profile', handlelogin, regc.profile)
router.post('/profile', upload.single('img'), regc.profileupdate)
router.get('/testi', handlelogin, handlerole, regc.testi)
router.get('/changepassword', regc.changepasswordshow)
router.post('/changepassword', regc.changepassword)
router.get('/profiledetails/:id', handlelogin, handlerole, regc.profiledetailsfront)
router.get('/forgotpassword', regc.forgotshow)
router.post('/forgotpassword', regc.forgotdata)
router.get('/forgotmessage', regc.forgotmessage)
router.get('/changepassword/:email', regc.forgotlink)
router.post('/forgotpasswordnew/:email', regc.forgotpasswordupdate)

module.exports = router