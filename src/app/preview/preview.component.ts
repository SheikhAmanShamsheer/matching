import { Component, OnInit, ElementRef } from '@angular/core';
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
  private canvasHeight = 130;
  private _answer = new Map();
  private radius = 12;
  private drawing = 0;
  private startPoint = new Array(3);
  private endPoint = new Array(3);
  private isMoving = 0;  
  private oneToOneChecked = true;
  private manyToManyChecked = false;
  private included = new Array();
  private numberOfTimes = new Map();
  private checkMatchedPairs = new Map();

  constructor(private dataService: DataService,private elementRef:ElementRef){
    
  }
  ngOnInit(): void {
    this._answers = this.dataService.getAnswer()
    this._question = this.dataService.getQuestion();
    this.matchedPairs = this.dataService.getMatchedPairs();
    this.deletedIds = this.dataService.getdeletedIds();
    this.modelList = this.dataService.getModelList();
    let c = document.querySelector('.previewCanvas') as HTMLCanvasElement;
    let context = c?.getContext("2d");
    c!.width = 849;
    c!.style.width = "849px"
    let changed = this.canvasHeight + 20*Math.max(this._answers.size,this._question.size);
    if(changed < this.canvasHeight) c!.height = this.canvasHeight;
    else c!.height = changed;
    this.drawCanvas(context);
    
  }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.querySelector('canvas')
                                .addEventListener('mousedown', this.onMouseDown.bind(this));
    this.elementRef.nativeElement.querySelector('canvas')
                                .addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  onMouseDown(e: any) {
    e.preventDefault();
    let c = document.querySelector('canvas');
    let ctx = c?.getContext("2d");
    const rect = c?.getBoundingClientRect();
    let x = e.clientX-rect?.left!;
    let y = e.clientY-rect?.top!;
    for(let i=0;i<this.modelList.length;i++){
      let d = Math.sqrt(((x-this.modelList[i].circleX)**2)+((y-this.modelList[i].circleY)**2));
      if(d < this.modelList[i].radius){
        if(this.drawing === 0){
          this.startPoint[0] = this.modelList[i].circleX;
          this.startPoint[1] = this.modelList[i].circleY;
          this.startPoint[2] = this.modelList[i].id;
          const exists = this.included.some(subArr => 
            subArr.length === this.startPoint.length && 
            subArr.every((val: any, index: number) => val === this.startPoint[index])
          );          
          if((this.oneToOneChecked && !exists)){
            this.drawing = 1;
            this.checkMatchedPairs.set(this.startPoint,this.startPoint);
            this.included.push([...this.startPoint]);
            this.draw();
            break;
          }else if(this.manyToManyChecked && this.numberOfTimes.get(JSON.stringify(this.startPoint))==undefined ? 0 < Math.min(this._question.size,this._answer.size) : this.numberOfTimes.get(JSON.stringify(this.startPoint))  < Math.min(this._question.size,this._answer.size )){
            this.drawing = 1;
            this.checkMatchedPairs.set(this.startPoint,this.startPoint);
            this.included.push([...this.startPoint]);
            this.numberOfTimes.set(JSON.stringify(this.startPoint),this.numberOfTimes.get(JSON.stringify(this.startPoint))==undefined ? 1 : this.numberOfTimes.get(JSON.stringify(this.startPoint))+1);
            this.draw();
            break;
          }else{
            break;
          }
        }else if(this.drawing === 1){
          if(this.modelList[i].circleX != this.startPoint[0]){
            this.endPoint[0] = this.modelList[i].circleX;
            this.endPoint[1] = this.modelList[i].circleY;
            this.endPoint[2] = this.modelList[i].id;
            const exists = this.included.some(subArr => 
              subArr.length === this.endPoint.length && 
              subArr.every((val: any, index: number) => val === this.endPoint[index])
            );          
            if(this.oneToOneChecked && !exists){
              this.drawing = 0;
              this.included.push(this.endPoint);
              this.checkMatchedPairs.set(this.startPoint,this.endPoint);
              this.startPoint = new Array(3);
              this.endPoint = new Array(3);
              this.isMoving = 0;
              this.draw();
              break;
            }else if(this.manyToManyChecked && this.numberOfTimes.get(JSON.stringify(this.endPoint))==undefined ? 0 < Math.min(this._question.size,this._answer.size) : this.numberOfTimes.get(JSON.stringify(this.endPoint))  < Math.min(this._question.size,this._answer.size )){
              this.drawing = 0;
              this.included.push(this.endPoint);
              this.checkMatchedPairs.set(this.startPoint,this.endPoint);
              this.numberOfTimes.set(JSON.stringify(this.endPoint),this.numberOfTimes.get(JSON.stringify(this.endPoint))==undefined ? 1 : this.numberOfTimes.get(JSON.stringify(this.endPoint))+1);
              this.startPoint = new Array(3);
              this.endPoint = new Array(3);
              this.isMoving = 0;
              this.draw();
              break;
            } else{
              break;
            }
          }
          
        }
      }else{
      }
    }
  }

  onMouseMove(e: any) {
    if(this.drawing === 1) {
      this.isMoving = 1;
      let c = document.querySelector('canvas');
      const rect = c?.getBoundingClientRect();
      let x = e.clientX-rect!.left;
      let y = e.clientY-rect!.top;
      this.checkMatchedPairs.set(this.startPoint,[x,y]);
      this.draw();
    }
  }

  draw(){
    let c = document.querySelector('canvas');
    let context = c?.getContext("2d");
    c!.width = 849
    c!.height = this.canvasHeight + 20*Math.max(this._answers.size,this._question.size);;
    c!.style.width = "849px";
    this.drawCanvas(context);
    this.drawConnections(context);

  }

  drawCanvas(context: CanvasRenderingContext2D | null | undefined){
    for(let i=0;i<this.modelList.length;i++){
      this.modelList[i].draw(context);
    }
  }

  drawConnections(context:  CanvasRenderingContext2D | null | undefined){
    let arr : any = Array.from(this.checkMatchedPairs);
    for(let i=0;i<arr.length;i++){
      let firstPoint = arr[i][0];
      let secondPoint = arr[i][1];
      this.drawCircle(context,firstPoint[0],firstPoint[1]);
      if(!this.isMoving || i != arr.length-1){
        this.drawCircle(context,secondPoint[0],secondPoint[1]);
      }
      this.drawLine(context,firstPoint[0],firstPoint[1],secondPoint[0],secondPoint[1]);
    }
  }

  drawCheckedConnections(context:  CanvasRenderingContext2D | null | undefined,arr: Array<any>,color="blue"){
    for(let i=0;i<arr.length;i++){
      let firstPoint = arr[i][0];
      let secondPoint = arr[i][1];
      this.drawCircle(context,firstPoint[0],firstPoint[1],color)
      this.drawCircle(context,secondPoint[0],secondPoint[1],color)
      this.drawLine(context,firstPoint[0],firstPoint[1],secondPoint[0],secondPoint[1],color);
    }
  }

  drawCircle(context:  CanvasRenderingContext2D | null | undefined,x:number,y:number,color="blue"){
    context?.beginPath();
    context?.arc(x,y,this.radius,0,360);
    context!.fillStyle = color // #1F7A54
    context?.fill();
  }

  drawLine(context:  CanvasRenderingContext2D | null | undefined,x1:number,y1:number,x2:number,y2:number,color="blue"){
    context!.beginPath();
    if(color == "red") context?.setLineDash([10,15])
    context!.moveTo(x1, y1);
    context!.lineTo(x2, y2);
    context!.strokeStyle = color; // #1F7A54
    context!.lineWidth = 2;
    context!.stroke();
    if(color == "red") context!.setLineDash([])
  }

  check(){
    let original = Array.from(this.matchedPairs);
    let answer = Array.from(this.checkMatchedPairs);
    let ogIndex = new Array();
    let ogArr = new Array();
    for(let i=0;i<original.length;i++){
      let temp = new Array(2);
      let temp1 = new Array(2);
      if(original[i][0][0] > original[i][1][0]){
        temp[0] = original[i][1][2];
        temp[1] = original[i][0][2];
        temp1[0] = original[i][1];
        temp1[1] = original[i][0];
      }else{
        temp[0] = original[i][0][2];
        temp[1] = original[i][1][2];
        temp1[0] = original[i][0];
        temp1[1] = original[i][1];
      }
      ogIndex.push(temp);
      ogArr.push(temp1);
    }
    let ansIndex = new Array();
    let ansArr = new Array();
    for(let i=0;i<answer.length;i++){
      let temp = new Array(2);
      let temp1 = new Array(2);
      if(answer[i][0][0] > answer[i][1][0]){
        temp[0] = answer[i][1][2];
        temp[1] = answer[i][0][2];
        temp1[0] = answer[i][1];
        temp1[1] = answer[i][0];
      }else{
        temp[0] = answer[i][0][2];
        temp[1] = answer[i][1][2];
        temp1[0] = answer[i][0];
        temp1[1] = answer[i][1];
      }
      ansIndex.push(temp);
      ansArr.push(temp1);
    }

    ogIndex.sort(function(a,b) {
      return a[0]-b[0];
    });
    ogArr.sort(function(a,b) {
      return a[0][2]-b[0][2];
    });

    ansIndex.sort(function(a,b) {
      return a[0]-b[0];
    });
    ansArr.sort(function(a,b) {
      return a[0][2]-b[0][2];
    });
    let right = new Array();
    let wrong = new Array();
    for(let i=0;i<ogArr.length;i++){
      if(JSON.stringify(ansArr[i]) != JSON.stringify(ogArr[i])){
        wrong.push(ansArr[i]); // (rigth,wrong)
      }else{
        right.push(ansArr[i]); // (rigth,wrong)
      }
    }
    let c = document.querySelector('canvas');
    let context = c?.getContext("2d");
    context?.clearRect(0,0,c!.width,c!.height);
    this.reset();
    this.drawCanvas(context);
    this.drawCheckedConnections(context,wrong,"red");
    this.drawCheckedConnections(context,right,"#1F7A54");
  }

  reset(){
    this.startPoint = new Array(3);
    this.endPoint = new Array(3);
    this.included = new Array();
    this.numberOfTimes = new Map();
    this.drawing = 0;
    this.checkMatchedPairs = new Map();
    this.draw();
  }
}