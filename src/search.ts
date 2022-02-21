import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
console.log(process.env.YOUTUBE_APIKEY);
class Video{
    constructor(public videoId:string,public title:string,public duration:number){}
}
export class Search{
    private apiKey = process.env.YOUTUBE_APIKEY;
    constructor(){

    }
    async fetchVideoId(keyword:string):Promise<string[]> {
        const YT_GET_VIDEOID: string = `https://www.googleapis.com/youtube/v3/search?q=${keyword}&maxResults=20&key=${this.apiKey}`;
        const ENCODE_YT_GET_VIDEOID = encodeURI(YT_GET_VIDEOID);
        const response = await axios.get(ENCODE_YT_GET_VIDEOID);
        const videoIdList = response.data.items.filter((v: any) =>v.id.videoId != undefined).map((v: any) => v.id.videoId);
        return videoIdList;
    }
    async fetchVideoInform(videoId:string):Promise<Video>{
        const YT_GET_VIDEO_DETAILS = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,status&id=${videoId}&key=${this.apiKey}`;
        const ENCODEYT_GET_VIDEO_DETAILS = encodeURI(YT_GET_VIDEO_DETAILS);
        const response = await axios.get(ENCODEYT_GET_VIDEO_DETAILS);
        const m = response.data.items[0].contentDetails.duration
        .replace(/PT/g, "")
        .replace(/M/g, ",")
        .replace(/S/g, "")
        .split(",");
        let video = new Video(videoId,response.data.items[0].snippet.title,Number(m[0] * 60) + Number(m[1]))
        return video;
    }
    async fetchVideo(keyword: string){
        const data = await this.fetchVideoId(keyword);
        const requests = data.map((videoId) => {
          return this.fetchVideoInform(videoId).then((result) => {
            return result;
          });
        });
        return Promise.all(requests);
    }
} 
export function removeVietnameseTones(str:string) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str = str.replace(/đ/g,"d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g," ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
    return str;
}