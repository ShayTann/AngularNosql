import { Injectable,EventEmitter } from '@angular/core';
import {Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {
  invokeApiComponentFunction = new EventEmitter();
  subsVar = Subscription;
  constructor() { }
  onApiComponentButtonClick(){
    this.invokeApiComponentFunction.emit();
  }
}
