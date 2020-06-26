import { Component ,OnInit } from '@angular/core';
import { ApiService } from './Services/api.service';

import { trigger,transition,useAnimation} from '@angular/animations';
import { rollIn, rollOut } from 'ng-animate';
import { Chart } from 'chart.js';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { TopicType , SupportType} from './types';
import { HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import {EventEmitterService} from './Services/event-emitter.service';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations : [
    trigger('rollOut', //Pour l'animation du scroll
      [transition('* => *',useAnimation(rollOut),{ params: { timings: 200 } }),

      ]),
  trigger('rollIn',[transition('* => *', useAnimation(rollIn),{ params: { timings: 200 } })

])
]
})
export class AppComponent implements OnInit {
  public graphql_support : SupportType[];
  public graphql_topics : TopicType[];
  public trendingSubreddits = new Map();
  baseurl = "http://127.0.0.1:8000";
  httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})
  Subreddits = [];
  Topics_array = [];
  topics_score = [];
  Scores = [];
  support_pos = [];
  support_neg = [];
  time = [];
 
  chart2;
  chart3;
  filtred = new Map();
  topics :any;
  comments = [{}];
  show = true;
  constructor(private api:ApiService,private http: HttpClient,private apollo: Apollo,private httpLink: HttpLink,private EventEmitterService:EventEmitterService) {
    apollo.create({
      link : httpLink.create({uri: 'http://127.0.0.1:8000/graphql'}),
      cache : new InMemoryCache()
    })
    this.getComments();
    this.getTopics();

  }
  

  get stateName(){ // pour annuler l'annimation une fois qu'on a passer vers l'autre contenue de notre SPA
    return this.show ? 'show' : 'hide'
  }
  toggle(){ // pour switcher l'animation entre sortire et rentrer
    this.show = !this.show;
    
  }
  toggle2(){ // pour envoyer l'etat vers deuxième component 
    this.EventEmitterService.onApiComponentButtonClick();
    console.log("emitted");
  }
  getList(){ // je l'ai pas trop utiliser par la suite on peut l'éliminer c'est ps grave
    return this.Topics_array;
  }

  onChange(deviceValue) { //Pour le sentiments analysis de chaque topic
    var totalNegativity =0;
    var totalPositivity = 0;
    if (deviceValue =="Select your topic"){ // Pour reset l'emplacement html et le rendre vide .
      document.getElementById("sentimentAnalysis").innerHTML = "";
      document.getElementById("resultSentiment").innerHTML  = "";
    }

    for (let entry of this.topics.slice(0,10)) {
      totalNegativity += entry.negativity;
      totalPositivity += entry.positivity;
      if (entry.body == deviceValue){
        document.getElementById("sentimentAnalysis").innerHTML = "You've choosed : "+deviceValue +" <br> <table class='table table-striped'> <thead><tr> <th scope='col'>Positivity</th> <th scope='col'>Negativity</th> </tr> </thead> <tbody> <tr>  <th scope='row'>"+entry.positivity+"</th> <td>"+entry.negativity+"</td> ";
       if (entry.positivity > entry.negativity){
        document.getElementById("resultSentiment").innerHTML  = "<center><img src='assets/images/happy.png' style='width: 50px'></center>"
       }
       if (entry.negativity >= entry.positivity){
        document.getElementById("resultSentiment").innerHTML  = "<center> <img src='assets/images/angry.png' style='width: 50px'> </center>"
       }
      }}
    if (totalNegativity > totalPositivity){
    document.getElementById("Todayresult").innerHTML = "Anyways today the most people are <font color='red'>NEGATIVE</font> you better go and review the most trending topic , they must be angry about something happened related to these topics , we advice you to continue the analysis with us the next thing we gonna do is <font color='#4DCCFF'>CLUSTERING</font> and it is the key to understand why exactly they're angry about. ";
    }
    if (totalNegativity <= totalPositivity){
      document.getElementById("Todayresult").innerHTML = "Anyways today the most people are <font color='green'>POSITIVE</font>";
      }

  }

  
  getTopics = () => {  // içi j'utilise Django Rest framework
   
    this.api.getAllTopics().subscribe(     // on s'abonne a l'observable pour rester à l'ecoute de nouveaux elements et on enregistre les informations concernant mes topics
    data => {
      this.topics = data;
      
      
      for (let entry of this.topics.slice(0,10)) {
        this.Topics_array.push(entry.body);
        this.topics_score.push(entry.score);  
      }
      
      
   
    
    },
    error => {
      console.log(error);
    }
    )
 
  }
  getComments = ()=> { 
    this.api.getAllComments().subscribe(  
    data => {
      this.comments = data;
    },
    error => {
      console.log(error);
    })
}

public getSupport = () =>{   // j'utilise graphql pour récuperer les valeurs pour chaque heure (positivity , negativity)
  this.apollo.query({
    query: gql`query {
      allSupportevolutions {
        hour
        positivity
        negativity
      }
     
    }
    
    
    
    `
  }).subscribe(result => {
    this.graphql_support = result.data as SupportType[];

    for (var key in this.graphql_support.allSupportevolutions){
        this.support_pos.push(this.graphql_support.allSupportevolutions[key].positivity)
        this.support_neg.push(this.graphql_support.allSupportevolutions[key].negativity)
        this.time.push(this.graphql_support.allSupportevolutions[key].hour)
        

        
    }

    // HIghCharts
    this.LineHighCharts(this.time,this.support_pos,this.support_neg);

  })

}

public getSubreddits = () =>{
  this.apollo.query({
    query: gql`query getTopics{
      allTopics {
        subreddit
        date
        score
        body
        clustering1
        clustering2
      }
     
    }
    
    `
  }).subscribe(result => {
    this.graphql_topics = result.data as TopicType[]; // là j'ai le graphql_topics qui contient toutes les topics je dois les regrouper en subreddits
    
    for (var key in this.graphql_topics.allTopics){ // je vais parcourire notre list
      if (this.trendingSubreddits.has(this.graphql_topics.allTopics[key].subreddit)){ // si le subreddit est deja dans ma liste trendingSubreddits je vais augmenter le score 
        var tmpscore = Number.parseInt(this.trendingSubreddits.get(this.graphql_topics.allTopics[key].subreddit)) + Number.parseInt(this.graphql_topics.allTopics[key].score) ;
        this.trendingSubreddits.delete(this.graphql_topics.allTopics[key].subreddit);
        this.trendingSubreddits.set(this.graphql_topics.allTopics[key].subreddit,tmpscore);
        
      }
      else{ // s'il n'éxiste pas c'est à dire une nouvelle subreddit qui fait le buzz je l'ajoute dans ma Map()
    this.trendingSubreddits.set(this.graphql_topics.allTopics[key].subreddit,this.graphql_topics.allTopics[key].score);

      }
  
    }
 
    
  for (let entry of this.trendingSubreddits.entries()) {  // Là je vais stocker la valeur de ma map dans deux array afin de les afficher dans mon graphe après
      this.Subreddits.push(entry[0]);
      this.Scores.push(entry[1]);
  }

 // HighCharts

  this.barSubreddits(this.Subreddits,this.Scores);
  


// Chart JS
  this.chart2.data.labels=this.Topics_array;
  this.chart2.data.datasets[0].data=this.topics_score;
  this.chart2.update();

    return this.graphql_topics; // içi je renvois la list des topic en cas si j'ai besoin de les récupérer après je vais appelle à cette fonction tout simplement
  })
  
}


  ngOnInit(){
    var trending_realtime= this.getSubreddits(); // dans cette variable j'ai le dernier résultat à propos de tops subredits
    this.getSupport();
    // les lignes après c'est just déclaration des charts 
    
    
    this.chart2 = new Chart('canvas2',{
      type : 'pie',
      label :'Score real-time',
      option: {
        responsive : true,
        title : {
          display : true,
          text : 'RealTime Trending Reddit'
        },
      },
      data:{
        labels: [],
        datasets : [
          {
            type: 'pie', 
            label:'Trending Subreddits by their score ',
            data : [1],
            backgroundColor : ['#3F3FBF','#50FFEB','#AF58FF0','#FFEE32','#FF20B8','#9DFFA9','#560000','#6E26B2','#0F5D20','#B69588'],
            fill : false
          }
        ]
      }
    });

  }
  
  // En utilisant highcharts

  barSubreddits(subreddits,scores) {
    Highcharts.chart('barChart', {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Top Trending subreddits'
      },
      xAxis: {
        categories: subreddits,
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Score',
          align: 'high'
        },
      },
      tooltip: {
        valueSuffix: ' Score'
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      },
      series: [{
        type: undefined,
        name: 'Score de subreddit',
        data: scores
      }]
    });
  }
  LineHighCharts(xValues,data1,data2){
    Highcharts.chart('lineChart', {
      chart: {
          type: 'line'
      },
      title: {
          text: 'Evolution of negativity and positivity in the day'
      },
      subtitle: {
          text: 'Reddit emotions today :'
      },
      xAxis: {
          categories: xValues
      },
      yAxis: {
          title: {
              text: ''
          }
      },
      plotOptions: {
          line: {
              dataLabels: {
                  enabled: true
              },
              enableMouseTracking: false
          }
      },
      series: [{
          name: 'Positivity',
          data: data1
      }, {
          name: 'Negativity',
          data: data2
      }]
  });
  }
}
 
