import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseurl = "http://127.0.0.1:8000";
  httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})

  constructor(private http: HttpClient) {
   
    }


   

  getAllTopics(): Observable<any>{
    return this.http.get(this.baseurl+'/topics/',{headers : this.httpHeaders}) ;// pour collecter les données depuis notre site django avec Rest API

  }
  getAllComments():Observable<any>{
    return this.http.get(this.baseurl+'/comments/',{headers : this.httpHeaders});
}




}