import express, { Application, Request, Response, RequestHandler } from 'express';
import { Redis } from './redis';
import { Search, removeVietnameseTones } from './search'
const searchService = new Search();
const redis = new Redis();
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.get('/',( req, res)=>{
res.send('Caching with redis - first implementation');
})
app.post('/search',async ( req, res)=>{

    const keyword: string = removeVietnameseTones(req.body.keyword);
    console.log(keyword);
    if(!keyword) return res.status(500).json({msg:"Error"});
    const cachedResult = await redis.get(keyword);
  //  console.log(JSON.parse(cachedResult));
    if(!cachedResult){
        const result = await searchService.fetchVideo(keyword);
        redis.set(keyword,JSON.stringify(result));
        console.log("No caching with redis");
       return res.status(200).json(result)
    }
    console.log("Caching with redis");
   // console.log(JSON.parse(cachedResult));
    res.status(200).json(JSON.parse(cachedResult))
})
redis.initialize().then(()=>{
    app.listen(3000,()=>console.log("running at port 3000"));
})