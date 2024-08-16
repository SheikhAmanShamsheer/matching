import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { stimulus } from './stimulusModel';
import { response } from './responseModel';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit,AfterViewInit{

  private canvasWidth = 50;
  private _question = new Map();
  private _answer = new Map();
  private index = 1;
  private ansIndex = 1;
  private canvasIncreaseFactor = 40;
  private width = 278;
  private heigth = 34;
  private radius = 12;
  private modelList = new Array();
  private drawing = 0;
  private startPoint = new Array(3);
  private endPoint = new Array(3);
  private ansIds = 1;
  private questionIds = 1;
  private matchedPairs = new Map();
  private isMoving = 0;  
  
  private deleteIds = new Array();
  private deleteIdsAns = new Array();
  private oldlist = new Array();
  private delete = 0;
  private deltedObject = new Array(2);

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.querySelector('canvas')
                                .addEventListener('mousedown', this.onMouseDown.bind(this));
    this.elementRef.nativeElement.querySelector('canvas')
                                .addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  constructor(private elementRef:ElementRef) {} 

  ngOnInit(): void {
    this.addQuestion();
    this.addAnswer();
    // this.oneToOne.addEventListener('input', (event) => {
    //   console.log(this.oneToOne.checked);
    // });
  }

  reset(){
    this.matchedPairs = new Map();
    this.startPoint = new Array(3);
    this.endPoint = new Array(3);
    this.modelList = new Array();
    this.draw();
  }

  onMouseDown(e: any) {
    e.preventDefault();
    let c = document.querySelector('canvas');
    const rect = c?.getBoundingClientRect();
    let x = e.clientX-rect?.left!;
    let y = e.clientY-rect?.top!;
    for(let i=0;i<this.modelList.length;i++){
      let d = Math.sqrt(((x-this.modelList[i].circleX)**2)+((y-this.modelList[i].circleY)**2));
      if(d < this.modelList[i].radius){
        if(this.drawing === 0){
          this.drawing = 1;
          this.startPoint[0] = this.modelList[i].circleX;
          this.startPoint[1] = this.modelList[i].circleY;
          this.startPoint[2] = this.modelList[i].id;
          console.log("start: ",this.startPoint);
          this.matchedPairs.set(this.startPoint,this.startPoint);
          this.draw();
        }else if(this.drawing === 1){
          if(this.modelList[i].circleX != this.startPoint[0]){
            this.drawing = 0;
            this.endPoint[0] = this.modelList[i].circleX;
            this.endPoint[1] = this.modelList[i].circleY;
            this.endPoint[2] = this.modelList[i].id;
            console.log("end: ",this.endPoint);
            this.matchedPairs.set(this.startPoint,this.endPoint);
            this.startPoint = new Array(3);
            this.endPoint = new Array(3);
            this.isMoving = 0;
            this.draw();
            break;
          }
          
        }
      }else{
        // console.log("outside");
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
      this.matchedPairs.set(this.startPoint,[x,y]);
      this.draw();
    }
  }
  
  addQuestion(){ 
    this._question.set(this.index, "");
    let row = document.createElement('div');   
      row.className = `row-${this.index}`; 
      row.style.display = "flex";
      row.style.marginBottom = "12px";
      row.innerHTML = ` 
        <input type="textarea" id="input-${this.index}" style="width:278px; height:34px">
        <button id="btn-${this.index}" style="border: none;
                                              background: none;
                                              cursor: pointer;
                                              margin: 0;
                                              padding: 0;
                                              margin-left:5px;
                                              color:blue;">
          <span class="material-icons" >delete</span>
        </button>
      `; 
      const inputElement = row.querySelector(`#input-${this.index}`) as HTMLInputElement;
      inputElement.addEventListener('input', (event) => {
        this.handleInputChange(event, inputElement.id);
      });
      const btnElement = row.querySelector(`#btn-${this.index}`) as HTMLInputElement;
      btnElement.addEventListener('click', (event) => {
        if(this._question.size > 1) this.removeInput(btnElement.id);
      });
      document.querySelector('.questionInputField')!.appendChild(row);
      this.index++;
      this.canvasWidth += this.canvasIncreaseFactor;
      this.draw(); 
  } 

  addAnswer(){ 
    this._answer.set(this.ansIndex, "");
    let row = document.createElement('div');  
    row.style.display = "flex"; 
    row.className = `row-${this.ansIndex}`; 
    row.style.marginBottom = "12px";
    row.innerHTML = ` 
      <input type="text" id="input-${this.ansIndex}" style="width:278px; height:34px">
      <button id="btn-${this.ansIndex}" style="border: none;
                                                background: none;
                                                cursor: pointer;
                                                margin: 0;
                                                padding: 0;
                                                margin-left:5px;
                                                color:blue;" >
      <span class="material-icons span" >delete</span></button>
    `;
      const inputElement = row.querySelector(`#input-${this.ansIndex}`) as HTMLInputElement;
      inputElement.addEventListener('input', (event) => {
        this.handleInputChange(event, inputElement.id,"answer");
      });
      const btnElement = row.querySelector(`#btn-${this.ansIndex}`) as HTMLInputElement;
      btnElement.addEventListener('click', (event) => {
        if(this._answer.size > 1) this.removeInput(btnElement.id,"answer");
      });
      document.querySelector('.answerInputField')!.appendChild(row);  
      this.ansIndex++;
      this.canvasWidth += this.canvasIncreaseFactor;
      this.draw(); 
  }

  removeInput(id:string,which="question"){
    let numb = id.match(/\d/g);
    let temp = numb!.join("");
    let index = parseInt(temp);
    this.delete = 1;
    if(which == "answer"){
      let row = document.querySelector(`.answerInputField .row-${index}`)
      this._answer.delete(index);
      let mainDiv = document.querySelector('.answerInputField');
      mainDiv?.removeChild(row!);
      this.deleteIdsAns.push(index);
      this.deltedObject[0] = index;
      this.deltedObject[1] = "response";
    }else{
      let row = document.querySelector(`.questionInputField .row-${index}`)
      this._question.delete(index);
      let mainDiv = document.querySelector('.questionInputField');
      mainDiv?.removeChild(row!);
      this.deleteIds.push(index);
      this.deltedObject[0] = index;
      this.deltedObject[1] = "stimulus";
    }
    this.canvasWidth -= this.canvasIncreaseFactor;

    this.draw();
  }

  updateStartAndEnd(){
    console.log("old: ",this.oldlist);
    console.log("new: ",this.modelList);
    console.log("pairs: ",this.matchedPairs);
    console.log("deleted One: ",this.deltedObject);
    if(this.deltedObject[1] == "stimulus"){
      for(let [k,v] of this.matchedPairs){
        if((k[0] == 300 && k[2] == this.deltedObject[0]) || (v[0] == 300 && v[2] == this.deltedObject[0])){
          this.matchedPairs.delete(k);
        }
      }
    }else{
      for(let [k,v] of this.matchedPairs){
        if((k[0] == 500 && k[2] == this.deltedObject[0]) || (v[0] == 500 && v[2] == this.deltedObject[0])){
          this.matchedPairs.delete(k);
        }
      }
    }
    let newlyAdded = new Map();
    if(this.deltedObject[1] == "stimulus"){
      for(let [k,v] of this.matchedPairs){
        if((k[0] == 300 && k[2] > this.deltedObject[0] && newlyAdded.get(k) == undefined)){
          this.matchedPairs.delete(k);
          let key = [k[0],k[1]-40,k[2]];
          this.matchedPairs.set(key,v);
          newlyAdded.set(key,v);
        }else if(v[0] == 300 && v[2] > this.deltedObject[0] && newlyAdded.get(k) == undefined){
          console.log("down");
          this.matchedPairs.delete(k);
          let value = [v[0],v[1]-40,v[2]];
          this.matchedPairs.set(k,value);
          newlyAdded.set(k,value);
        }
      }
    }else{
      for(let [k,v] of this.matchedPairs){
        if((k[0] == 500 && k[2] > this.deltedObject[0] && newlyAdded.get(k) == undefined)){
          this.matchedPairs.delete(k);
          let key = [k[0],k[1]-40,k[2]];
          this.matchedPairs.set(key,v);
          newlyAdded.set(key,v);
        }else if(v[0] == 500 && v[2] > this.deltedObject[0] && newlyAdded.get(k) == undefined){
          this.matchedPairs.delete(k);
          let value = [v[0],v[1]-40,v[2]];
          this.matchedPairs.set(k,value);
          newlyAdded.set(k,value);
        }
      }
    }
  }

  
  

  handleInputChange(event: Event, index: string,which="question"){
    let numb = index.match(/\d/g);
    let temp = numb!.join("");
    let id = parseInt(temp);
    const inputValue = (event.target as HTMLInputElement).value;
    if(which == "answer"){
      this._answer.set(id,inputValue);
    }else{
      this._question.set(id,inputValue);
    }
    this.draw();
  }


  draw(){
    let c = document.querySelector('canvas');
    let context = c?.getContext("2d");
    context?.clearRect(0,0,c!.width,c!.height);
    c!.width = window.innerWidth;
    c!.height = this.canvasWidth;
    this.oldlist = this.modelList;
    this.drawCanvas(context);
    this.drawCanvasAns(context);
    if(this.delete){
      this.updateStartAndEnd();
      this.delete = 0;
    }
    this.drawConnections(context);
  }
  drawCanvas(context: CanvasRenderingContext2D | null | undefined){
    let x = 0;
    let y = 10;
    this.questionIds = 1;
    this.modelList = [];
    let arr = Array.from(this._question.values());
    for(let i=0;i<arr.length;i++){
      while(this.deleteIds.includes(this.questionIds)){
        this.questionIds++;
      }
      let s = new stimulus(this.questionIds,x,y,this.width,this.heigth,this.radius,arr[i]);
      s.draw(context!);
      this.modelList.push(s);
      this.questionIds++;
      y += 40;
    }
  }

  drawCanvasAns(context: CanvasRenderingContext2D | null | undefined){
    let x = 500;
    let y = 10;
    let arr = Array.from(this._answer.values());
    this.ansIds = 1;
    for(let i=0;i<arr.length;i++){
      while(this.deleteIdsAns.includes(this.ansIds)){
        this.ansIds++;
      }
      let r = new response(this.ansIds,x,y,this.width,this.heigth,this.radius,arr[i]);
      r.draw(context!);
      this.modelList.push(r);
      this.ansIds++;
      y += 40;
    }
  }

  drawConnections(context:  CanvasRenderingContext2D | null | undefined){
    let arr : any = Array.from(this.matchedPairs);
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
    context!.fillStyle = "blue"
    context?.fill();
  }

  drawLine(context:  CanvasRenderingContext2D | null | undefined,x1:number,y1:number,x2:number,y2:number){
    context!.beginPath();
    context!.moveTo(x1, y1);
    context!.lineTo(x2, y2);
    context!.strokeStyle = "blue";
    context!.lineWidth = 2;
    context!.stroke();
  }

  
}
