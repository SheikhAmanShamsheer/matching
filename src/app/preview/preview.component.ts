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
    console.log("c: ",c);
    let context = c?.getContext("2d");
    console.log("context: ",context);
    c!.width = 849;
    c!.style.width = "849px"
    let changed = this.canvasHeight + 20*Math.max(this._answers.size,this._question.size);
    if(changed < this.canvasHeight) c!.height = this.canvasHeight;
    else c!.height = changed;
    console.log(this._answers);
    console.log(this._question);
    console.log(this.matchedPairs);
    console.log(this.deletedIds);
    console.log("model List: ",this.modelList);
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
    console.log("c: ",c);
    let ctx = c?.getContext("2d");
    const rect = c?.getBoundingClientRect();
    let x = e.clientX-rect?.left!;
    let y = e.clientY-rect?.top!;
    console.log("clicked here: ",x,y);
    console.log("modelList: ",this.modelList);
    for(let i=0;i<this.modelList.length;i++){
      let d = Math.sqrt(((x-this.modelList[i].circleX)**2)+((y-this.modelList[i].circleY)**2));
      if(d < this.modelList[i].radius){
        if(this.drawing === 0){
          this.startPoint[0] = this.modelList[i].circleX;
          this.startPoint[1] = this.modelList[i].circleY;
          this.startPoint[2] = this.modelList[i].id;
          console.log("start: ",this.startPoint);
          const exists = this.included.some(subArr => 
            subArr.length === this.startPoint.length && 
            subArr.every((val: any, index: number) => val === this.startPoint[index])
          );          
          console.log(exists,this.numberOfTimes.get(JSON.stringify(this.startPoint)),Math.min(this._question.size,this._answer.size));
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
            console.log("added: ",this.numberOfTimes);
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
              console.log("end: ",this.endPoint);
              this.included.push(this.endPoint);
              this.checkMatchedPairs.set(this.startPoint,this.endPoint);
              this.startPoint = new Array(3);
              this.endPoint = new Array(3);
              this.isMoving = 0;
              this.draw();
              break;
            }else if(this.manyToManyChecked && this.numberOfTimes.get(JSON.stringify(this.endPoint))==undefined ? 0 < Math.min(this._question.size,this._answer.size) : this.numberOfTimes.get(JSON.stringify(this.endPoint))  < Math.min(this._question.size,this._answer.size )){
              console.log("inside else");
              this.drawing = 0;
              console.log("end: ",this.endPoint);
              this.included.push(this.endPoint);
              this.checkMatchedPairs.set(this.startPoint,this.endPoint);
              this.numberOfTimes.set(JSON.stringify(this.endPoint),this.numberOfTimes.get(JSON.stringify(this.endPoint))==undefined ? 1 : this.numberOfTimes.get(JSON.stringify(this.endPoint))+1);
              console.log("added end: ",this.numberOfTimes);
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
        console.log("outside")
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

  drawCircle(context:  CanvasRenderingContext2D | null | undefined,x:number,y:number){
    context?.beginPath();
    context?.arc(x,y,this.radius,0,360);
    context!.fillStyle = "#1F7A54"
    context?.fill();
  }

  drawLine(context:  CanvasRenderingContext2D | null | undefined,x1:number,y1:number,x2:number,y2:number){
    context!.beginPath();
    context!.moveTo(x1, y1);
    context!.lineTo(x2, y2);
    context!.strokeStyle = "#1F7A54";
    context!.lineWidth = 2;
    context!.stroke();
  }


  check(){
    console.log("original: ",Array.from(this.matchedPairs));
    console.log("answer: ",Array.from(this.checkMatchedPairs));
    let original = Array.from(this.matchedPairs);
    let answer = Array.from(this.checkMatchedPairs);
    let wrong = false;
    original.sort(function(a,b) {
      return a[0]-b[0]
    });
    answer.sort(function(a,b) {
      return a[0]-b[0]
    });
    console.log("original: ",original);
    console.log("answer: ",answer);
    
    if(JSON.stringify(original) == JSON.stringify(answer)){
      alert("matching are right");
    }else{
      alert("matching are wrong");
    }
    // for(let i=0;i<original.length;i++){
    //   for(let j=0;j<answer.length;j++){
    //     if(original[i] == answer[j]){

    //     }
    //   }
    // }

    // if(wrong == true){
    //   alert("matching are wrong");
    // }else{
    //   alert("matching are right");
    // }
  }
}
   