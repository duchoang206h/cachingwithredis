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
exports.removeVietnameseTones = exports.Search = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log(process.env.YOUTUBE_APIKEY);
class Video {
    constructor(videoId, title, duration) {
        this.videoId = videoId;
        this.title = title;
        this.duration = duration;
    }
}
class Search {
    constructor() {
        this.apiKey = process.env.YOUTUBE_APIKEY;
    }
    fetchVideoId(keyword) {
        return __awaiter(this, void 0, void 0, function* () {
            const YT_GET_VIDEOID = `https://www.googleapis.com/youtube/v3/search?q=${keyword}&maxResults=20&key=${this.apiKey}`;
            const ENCODE_YT_GET_VIDEOID = encodeURI(YT_GET_VIDEOID);
            const response = yield axios_1.default.get(ENCODE_YT_GET_VIDEOID);
            const videoIdList = response.data.items.filter((v) => v.id.videoId != undefined).map((v) => v.id.videoId);
            return videoIdList;
        });
    }
    fetchVideoInform(videoId) {
        return __awaiter(this, void 0, void 0, function* () {
            const YT_GET_VIDEO_DETAILS = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,status&id=${videoId}&key=${this.apiKey}`;
            const ENCODEYT_GET_VIDEO_DETAILS = encodeURI(YT_GET_VIDEO_DETAILS);
            const response = yield axios_1.default.get(ENCODEYT_GET_VIDEO_DETAILS);
            const m = response.data.items[0].contentDetails.duration
                .replace(/PT/g, "")
                .replace(/M/g, ",")
                .replace(/S/g, "")
                .split(",");
            let video = new Video(videoId, response.data.items[0].snippet.title, Number(m[0] * 60) + Number(m[1]));
            return video;
        });
    }
    fetchVideo(keyword) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.fetchVideoId(keyword);
            const requests = data.map((videoId) => {
                return this.fetchVideoInform(videoId).then((result) => {
                    return result;
                });
            });
            return Promise.all(requests);
        });
    }
}
exports.Search = Search;
function removeVietnameseTones(str) {
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "a");
    str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, "e");
    str = str.replace(/??|??|???|???|??/g, "i");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "o");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, "u");
    str = str.replace(/???|??|???|???|???/g, "y");
    str = str.replace(/??/g, "d");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "A");
    str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, "E");
    str = str.replace(/??|??|???|???|??/g, "I");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "O");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, "U");
    str = str.replace(/???|??|???|???|???/g, "Y");
    str = str.replace(/??/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // M???t v??i b??? encode coi c??c d???u m??, d???u ch??? nh?? m???t k?? t??? ri??ng bi???t n??n th??m hai d??ng n??y
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ?? ?? ?? ?? ??  huy???n, s???c, ng??, h???i, n???ng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ?? ?? ??  ??, ??, ??, ??, ??
    // Remove extra spaces
    // B??? c??c kho???ng tr???ng li???n nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    // B??? d???u c??u, k?? t??? ?????c bi???t
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    return str;
}
exports.removeVietnameseTones = removeVietnameseTones;
