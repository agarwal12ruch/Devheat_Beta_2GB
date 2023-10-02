import express from "express"
import hbs from "hbs"
import path from "path"
const app = express()
import collection from "mongodb"    

const port = process.env.PORT || 3000


app.use(express.json())

app.use(express.urlencoded({ extended: false }))



app.set('view engine', 'hbs')




app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/', (req, res) => {
    res.render('login')
})

app.post('/signup', async (req, res) => {
    

    const data = {
        name: req.body.Username,
        password: req.body.Password
    }

    const checking = await collection.findOne({ Userame: req.body.Username })

   try{
    if (checking.Username === req.body.Username && checking.Password===req.body.Password) {
        res.send("user details already exists")
    }
    else{
        await collection.insertMany([data])
    }
   }
   catch{
    res.send("wrong inputs")
   }

    res.status(201).render("home", {
        naming: req.body.Username
    })
})


app.post('/login', async (req, res) => {

    try {
        const check = await collection.findOne({ Username: req.body.Username })

        if (check.Password === req.body.Password) {
            res.status(201).render("home", { naming: `${req.body.Password}+${req.body.Username}` })
        }

        else {
            res.send("incorrect password")
        }


    } 
    
    catch (e) {

        res.send("wrong details")
    
    }


})



app.listen(port, () => {
    console.log('port connected');
})