"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const redis_1 = require("./redis");
const search_1 = require("./search");
const searchService = new search_1.Search();
const redis = new redis_1.Redis();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.get('/', (req, res) => {
    res.send('Caching with redis - first implementation');
});
app.post('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const keyword = (0, search_1.removeVietnameseTones)(req.body.keyword);
    console.log(keyword);
    if (!keyword)
        return res.status(500).json({ msg: "Error" });
    const cachedResult = yield redis.get(keyword);
    //  console.log(JSON.parse(cachedResult));
    if (!cachedResult) {
        const result = yield searchService.fetchVideo(keyword);
        redis.set(keyword, JSON.stringify(result));
        console.log("No caching with redis");
        return res.status(200).json(result);
    }
    console.log("Caching with redis");
    // console.log(JSON.parse(cachedResult));
    res.status(200).json(JSON.parse(cachedResult));
}));
redis.initialize().then(() => {
    app.listen(3000, () => console.log("running at port 3000"));
});
