import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/DataService';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit{
  private _answers = new Map();
  private _question = new Map();
  private matchedPairs = new Map();
  private deletedIds = new Array();
  private modelList = new Array();
  private questionIds = 1;
  private canvasHeight = 130;
  private oldlist = new Array();
  private stimulusStartX = 10;
  private stimulusStartXCircle = 300+this.stimulusStartX;
  private stimulusStartY = 20;
  private responseStartX = 540;
  private responseStartY = 20;


  constructor(private dataService: DataService){
    
  }
  ngOnInit(): void {
    let c = document.querySelector('.previewCanvas') as HTMLCanvasElement;
    console.log("c: ",c);
    let context = c?.getContext("2d");
    console.log("context: ",context);
    this._answers = this.dataService.getAnswer()
    this._question = this.dataService.getQuestion();
    this.matchedPairs = this.dataService.getMatchedPairs();
    this.deletedIds = this.dataService.getdeletedIds();
    this.modelList = this.dataService.getModelList();
    console.log(this._answers);
    console.log(this._question);
    console.log(this.matchedPairs);
    console.log(this.deletedIds);
    console.log(this.modelList);
    for(let i=0;i<this.modelList.length;i++){
      this.modelList[i].draw(context);
      console.log("drawing....");
    }
    
  }
}
   