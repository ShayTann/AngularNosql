import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule ,HttpLink} from 'apollo-angular-link-http';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ClusteringComponent } from './components/clustering/clustering.component';
import { EventEmitterService } from './Services/event-emitter.service';
import { HighchartsChartComponent} from 'highcharts-angular';
import { SearchComponent } from './components/search/search.component';
@NgModule({
  declarations: [
    AppComponent,
    ClusteringComponent,
    HighchartsChartComponent,
    SearchComponent
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    HttpLinkModule,
    ApolloModule,
    NgSelectModule,
    FormsModule
    
  ],
  providers: [EventEmitterService],
  bootstrap: [AppComponent]
})
export class AppModule { 

}
