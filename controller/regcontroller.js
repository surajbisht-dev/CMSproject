const Reg = require('../models/reg')
const nodemailer = require('nodemailer')
const multer = require('multer')

exports.homepage = async(req, res) => {
    const username = req.session.username
    const record = await Reg.find()
        // console.log(record)
    res.render('index.ejs', { record, username: username })
}

exports.regform = (req, res) => {
    res.render('reg.ejs', { username: 'hello' })
}
exports.reginsert = async(req, res) => {
    const { email, pass } = req.body
    const emailcheck = await Reg.findOne({ email: email })
    if (emailcheck == null) {
        const record = new Reg({ email: email, password: pass })
        record.save()
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'www.surajbisht1@gmail.com', // generated ethereal user
                pass: 'tdfhfnvqsmunratw', // generated ethereal password
            },
        });
        let info = await transporter.sendMail({
            from: 'www.surajbisht1@gmail.com',
            to: email,
            subject: 'Email Verification',
            text: "Hello world?", // plain text body
            html: `<a href=http://localhost:5000/emailverify/${email}>Click to verify</a>`,
        });
        res.redirect('/login')
    } else {
        res.send('Email is already taken')
    }
}
exports.loginshow = (req, res) => {
    res.render('login.ejs', { username: 'hello', mess: '' })
}
exports.logincheck = async(req, res) => {
    const { email, pass } = req.body
    const record = await Reg.findOne({ email: email })

    if (record.status !== 'Suspended') {
        if (record !== null) {
            if (record.password == pass) {
                req.session.isAuth = true
                req.session.username = email
                req.session.role = record.role
                if (record.email == 'www.surajbisht1@gmail.com') {
                    res.redirect('/admin/dashboard')
                } else {
                    res.redirect('/')
                }

            } else {
                res.redirect('/login')
            }
        } else {
            res.redirect('/login')
        }
    } else {
        res.send("Your account is Suspended")
    }
}

exports.logout = (req, res) => {
    req.session.destroy()
    res.redirect('/login')
}
exports.adminlogin = (req, res) => {
    res.render('admin/login.ejs')
}
exports.adminloginchek = (req, res) => {
    // console.log(req.body)
}

exports.dashboard = (req, res) => {
    res.render('admin/dashboard.ejs')
}

exports.users = async(req, res) => {
    const record = await Reg.find()
    res.render('admin/users.ejs', { record })
}

exports.emailverify = async(req, res) => {
    const email = req.params.email
    const record = await Reg.findOne({ email: email })
    const id = record.id
    await Reg.findByIdAndUpdate(id, { status: 'Active', emailStatus: 'verified' })
    res.send('You have successfully verified your email')
}

exports.profile = async(req, res) => {
    const record = await Reg.findOne({ email: req.session.username })
        //  console.log(record)
    res.render('admin/profile.ejs', { record, username: req.session.username })
}

exports.profileupdate = async(req, res) => {
    const { fname, lname, mobile, aboutus } = req.body

    const username = req.session.username
    const record = await Reg.findOne({ email: username })
    const id = record.id
    if (req.file) {
        const filename = req.file.filename
        await Reg.findByIdAndUpdate(id, { firstName: fname, lastName: lname, mobile: mobile, img: filename, aboutus: aboutus })
    } else {
        await Reg.findByIdAndUpdate(id, { firstName: fname, lastName: lname, mobile: mobile, aboutus: aboutus })
    }
    res.redirect('/profile')
}

exports.userstatusupdate = async(req, res) => {
    const id = req.params.id
    const record = await Reg.findById(id)
    let currentstatus = null
    let currentemailstatus = null

    if (record.status == 'Active') {
        currentstatus = 'Suspended'
        currentemailstatus = 'not verified'
    } else {
        currentstatus = 'Active'
        currentemailstatus = 'verified'
    }
    await Reg.findByIdAndUpdate(id, { status: currentstatus, emailStatus: currentemailstatus })
    res.redirect('/admin/users')
}
exports.testi = (req, res) => {
    res.render('testi.ejs')
}

exports.userroleupdate = async(req, res) => {
    const id = req.params.id
    const record = await Reg.findById(id)
    let currentrole = null


    if (record.role == 'pvt') {
        currentrole = 'public'

    } else {
        currentrole = 'pvt'

    }
    await Reg.findByIdAndUpdate(id, { role: currentrole })
    res.redirect('/admin/users')
}
exports.changepasswordshow = (req, res) => {
    const username = req.session.username
    res.render('changepasswordform.ejs', { username })
}
exports.changepassword = async(req, res) => {
    const { cpass, npass } = req.body
    const username = req.session.username
    const record = await Reg.findOne({ email: username })
    if (record.password == cpass) {
        await Reg.findByIdAndUpdate(record.id, { password: npass })
        req.session.destroy()
        res.redirect('/login')
    } else {
        res.send('password not matched')
    }
}
exports.profiledetailsfront = async(req, res) => {
    const id = req.params.id
    const username = req.session.username
    const record = await Reg.findById(id)
    res.render('profiledetailsf.ejs', { record, username })
}
exports.forgotshow = (req, res) => {
    res.render('forgotform.ejs', { username: 'hello' })
}

exports.forgotlink = (req, res) => {
    const email = req.params.email
    res.render('forgotlink.ejs', { username: 'hello', email })
}

exports.forgotpasswordupdate = async(req, res) => {
    // console.log(req.params.email)
    // console.log(req.body)
    const email = req.params.email
    const record = await Reg.findOne({ email: email })
    const { npass } = req.body
    await Reg.findByIdAndUpdate(record.id, { password: npass })
    res.render('login.ejs', { mess: 'Your password has been changed. Please do fresh login.', username: 'hello' })

}

exports.forgotmessage = (req, res) => {
    res.send("Password change link sent to your email.")
}


exports.forgotdata = async(req, res) => {
    const { email } = req.body

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'www.surajbisht1@gmail.com', // generated ethereal user
            pass: 'tdfhfnvqsmunratw', // generated ethereal password
        },
    });
    let info = await transporter.sendMail({
        from: 'www.surajbisht1@gmail.com',
        to: email,
        subject: 'Password Change Link',
        text: "Hello world?", // plain text body
        html: `<a href=http://localhost:5000/changepassword/${email}>Click to verify</a>`,
    });
    res.send("Password link has been sent to your registered email id.")
}