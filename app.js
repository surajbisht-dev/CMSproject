const express=require('express')
const app=express()
app.use(express.urlencoded({extended:false}))
const frontendrouter=require('./router/frontend')
const adminrouter=require('./router/admin')
const mongoose=require('mongoose')
const session=require('express-session')
mongoose.connect('mongodb://127.0.0.1:27017/usermanagementsystem')


app.use(session({
    secret:'suraj',
    resave:false,
    saveUninitialized:false
}))
app.use(frontendrouter)
app.use('/admin',adminrouter)
app.use(express.static('public'))
app.set('view engine','ejs')
app.listen(5000,()=>{console.log('server is running')})