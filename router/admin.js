const router = require('express').Router()
const regc = require('../controller/regcontroller')




router.get('/', regc.adminlogin)

router.get('/dashboard', regc.dashboard)
router.get('/users', regc.users)
router.get('/userstatusupdate/:id', regc.userstatusupdate)
router.get('/userroleupdate/:id', regc.userroleupdate)

module.exports = router