import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { rollIn, rollOut } from 'ng-animate';
import { trigger,transition,useAnimation} from '@angular/animations';
import { AppComponent } from '../../app.component';
import { EventEmitterService } from '../../Services/event-emitter.service'; 
@Component({
  selector: 'app-clustering',
  templateUrl: './clustering.component.html',
  styleUrls: ['./clustering.component.scss'],
  animations : [
    trigger('rollOut', //Pour l'animation du scroll
      [transition('* => *',useAnimation(rollOut),{ params: { timings: 200 } }),

      ]),
  trigger('rollIn',[transition('* => *', useAnimation(rollIn),{ params: { timings: 200 } })

])
]
})
export class ClusteringComponent implements OnInit {
  Topics=[];
  FullInfos = [{}];
  show = true;
  constructor(private appcomponent : AppComponent, private api:ApiService,private eventEmitterService: EventEmitterService) {
    this.Topics = appcomponent.getList();
    this.getTopics();
    
   }
   get stateName(){ // pour annuler l'annimation une fois qu'on a passer vers l'autre contenue de notre SPA
    return this.show ? 'show' : 'hide'
  }
   toggle2(){
    console.log("worked");
    this.show = !this.show;
    
  }
   onChange(deviceValue) {  
    
    for (let entry of this.FullInfos.slice(0,10)) {
      if(entry.body == deviceValue){
        document.getElementById("clusted1").innerHTML = "You've choosed : "+deviceValue +" <br> <table class='table table-striped'> <thead><tr> <th scope='col'>Groupe 1</th> <th scope='col'>Groupe2</th> </tr> </thead> <tbody> <tr>  <th scope='row'>"+entry.clustering1+"</th> <td>"+entry.clustering2+"</td> ";
      }
    }
    }
    getTopics = () => {  // içi j'utilise Django Rest framework
   
    this.api.getAllTopics().subscribe(     // on s'abonne a l'observable pour rester à l'ecoute de nouveaux elements et on enregistre les informations concernant mes topics
    data => {
      this.FullInfos = data;
     
    },
    error => {
      console.log(error);
    }
    )
 
  }

  ngOnInit(): void {
     this.eventEmitterService.invokeApiComponentFunction.subscribe(() => {    
      this.toggle2();    
      });
    }
  

}
