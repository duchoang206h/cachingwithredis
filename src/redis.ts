import { createClient,  } from 'redis';
export class Redis {
    private client : any;
    constructor(){
    }
    async initialize() {
        try {
            this.client =  await createClient();
            await this.client.connect();
            console.log("Redis is ok");
        } catch (error) {
            console.log(error);
            console.log("Redis error");
        }
    }
   async get(key:string){
        const value = await this.client.get(key); 
        return value; // return undefined if value not exist
    }
    async set(key: string, value:any): Promise<boolean> {
        try {
            await this.client.set(key,value);
            return true;
        } catch (error) {
            return false;
        }
    }
}
