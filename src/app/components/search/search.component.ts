import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../Services/api.service';
import {fetchedTopic} from '../../types';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  tmpname : String;
  fetchedTopics : Array<fetchedTopic> ;
  public show = false;
  count = 0;
  public empty = false;
  constructor(private api:ApiService) { 

  }
  fetchWord(){
    this.fetchedTopics = [];
    this.count = 0;
    
    this.api.getAllTopics().subscribe(     // on s'abonne a l'observable pour rester à l'ecoute de nouveaux elements et on enregistre les informations concernant mes topics
    data => {
      
      for (let entry of data) {
       
        if (entry.body.toLowerCase().includes(this.tmpname.toLowerCase())){
          this.show = true;
          this.empty = false;
          let tmptopic: fetchedTopic  = new fetchedTopic();
          tmptopic.body = entry.body;
          tmptopic.author = entry.author;
          tmptopic.score = entry.score;
          tmptopic.subreddit = entry.subreddit;
          tmptopic.positivity = entry.positivity;
          tmptopic.negativity = entry.negativity;
          this.fetchedTopics.push(tmptopic);
          this.count ++;
        }
      }
      if (this.count == 0){
        this.empty = true;
      }

    

  })

}

reset(){
  this.show=false;
}


  ngOnInit(): void {
  }

}
