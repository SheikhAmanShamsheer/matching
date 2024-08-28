import { Injectable } from '@angular/core';
 
@Injectable({
  providedIn: 'root'
})
export class DataService {
    private questions = new Map();
    private answers = new Map();
    private deletedIds = new Array();
    private matchedPairs = new Map();
    private modelList = new Array();

    public setModelList(value: Array<any>){
      this.modelList = value;
    }

    public setQuestion(value: Map<any, any>){
      this.questions = value;
    }
    public setAnswer(value: Map<any, any>){
      this.answers = value;
    }

    public setdeletedIds(value: Array<any>){
      this.deletedIds = value;
    }
    
    public setMatchedPairs(value: Map<any, any>){
      this.matchedPairs = value;
    }

    public getModelList(){
      return this.modelList;
    }

    public getQuestion(){
      return this.questions;
    }

    public getAnswer(){
      return this.answers;
    }

    public getdeletedIds(){
      return this.deletedIds;
    }
    
    public getMatchedPairs(){
      return this.matchedPairs;
    }
}   
 