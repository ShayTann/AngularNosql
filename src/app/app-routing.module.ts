import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ClusteringComponent} from './components/clustering/clustering.component';
import {SearchComponent} from './components/search/search.component'
const routes: Routes = [
  {path: 'clustering',component:ClusteringComponent},
  {path :'search',component:SearchComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes),

  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
