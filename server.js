import express from 'express'
import fetch from 'node-fetch'
import 'dotenv/config'

const app = express();
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended:true}));

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log('Server started');
})

app.get('/',(req,res)=>{
    res.render('index',{
        title:'Weather App',
        city:null,
        temp:null,
        desc:null
    });
})
app.post('/',async (req,res)=>{
    const city = req.body.city;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}`;
    
    try{
        await fetch(url)
         .then(res=>res.json())
         .then((data)=>{
             if(data.cod==='404'){
                 res.render('index',{title:'Enter valid city',city:data.message,temp:null,desc:null});
                console.log(data.message)
             }
             else{
                 var temperature = data.main.temp - 273.15;
                 res.render('index',{
                        title:`Weather of ${data.name}`,
                        city:data.name,
                        temp:`${temperature.toFixed(2)} °C`,
                        desc:data.weather[0].description
                    });
             }
         })
    }
    catch(err){
        console.log(err);
    }
})
app.use((req,res)=>{
    res.status(404).render('404')
})


// https://weather-app-by-hiro.herokuapp.com/ (app link)
// https://git.heroku.com/weather-app-by-hiro.git (second link)