export type TopicType = {
    subreddit : string;
    date : Date;
    score : any;
    allTopics : TopicType[]
    author : any;
    body : any;
}
export type SupportType = {
    allSupportevolutions : any;
    hour : string;
    positivity : number;
    negativity : number;
}
export type Query = {
    all_Topics : TopicType[];
    all_Support : SupportType[];
}


export class fetchedTopic {
    score : number;
    author : String;
    subreddit : String;
    body : any ;
    positivity : number;
    negativity : number;
    public fetchedTopic(num,aut,sub,body){
        this.score = num;
        this.author = aut;
        this.subreddit = sub;
        this.body = body;
        
    }
}






// export class TopicType {
//     subreddit : string;
//     score : Number;
//     getElement (subreddit : string){
//         return this.subreddit;
//     }
// }
