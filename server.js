const express = require('express');

const mongoose = require('mongoose');
const ShortUrl = require('./modals/shortUrl');

const app = express();

// mongoose.connect('mongodb://127.0.0.1/urlShortener',{
//     useNewUrlParser : true, UseUnifiedTopology: true
// })

const dbUrl = 'mongodb+srv://tom:tom1312@cluster0.che8ych.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(dbUrl, {
    useNewUrlParser : true,
    UseUnifiedTopology: true
})
.then(()=>{
    console.log("Connected to the db");
})
.catch(()=>{
    console.log("Conection failed");
});


app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async(req,res) => {
    const shortUrls = await ShortUrl.find()
       res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls',async (req,res) => {
   await ShortUrl.create({full: req.body.fullUrl })

   res.redirect('/')
})

app.get('/:shortUrl',async (req,res)=> { 
    const shortUrl = await ShortUrl.findOne({short: req.params.shortUrl })

    if(shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
    // shortUrl.save()

    shortUrl.save((err, data)=>{
        if(err){
            console.log(err);
            console.log("Has error")
        }
        else{
            res.status(200).send({'msg':'worked db'})
            console.log("itsworking");
        }
    })
    
    res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5000);