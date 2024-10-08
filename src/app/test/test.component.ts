import { Component, OnInit, AfterViewInit, ElementRef, AfterContentChecked, AfterViewChecked } from '@angular/core';
import { stimulus } from './stimulusModel';
import { response } from './responseModel';
import { DataService } from '../shared/DataService';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})

export class TestComponent implements OnInit,AfterViewInit,AfterViewChecked{
  private canvasHeight = 50;
  private _question = new Map();
  private _answer = new Map();
  private index = 1;
  private ansIndex = 1;
  private canvasIncreaseFactor = 60;
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
  private oneToOneChecked = true;
  private manyToManyChecked = false;
  private deleteIds = new Array();
  private deleteIdsAns = new Array();
  private oldlist = new Array();
  private delete = 0;
  private deltedObject = new Array(2);
  private included = new Array();
  private numberOfTimes = new Map();
  private stimulusStartX = 10;
  private stimulusStartXCircle = 300+this.stimulusStartX;
  private stimulusStartY = 20;
  private responseStartX = 540;
  private responseStartY = 20;
  private decreaseY = 50;

  constructor(private elementRef:ElementRef,private dataService: DataService) {
    
  } 

  isDisabled(){
    console.log("checiking.....");
    return this.matchedPairs.size > 0;
  }

  ngAfterViewChecked(): void { // I Have used this because the ngAfterViewInit is called only once and when i return from save and preview it is not called
    console.log("checked");
    this.draw();
  }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.querySelector('canvas')
                                .addEventListener('mousedown', this.onMouseDown.bind(this));
    this.elementRef.nativeElement.querySelector('canvas')
                                .addEventListener('mousemove', this.onMouseMove.bind(this));
    const OneToOne = document.querySelector(`#OneToOne`) as HTMLInputElement;
    const ManyToMany = document.querySelector(`#ManyToMany`) as HTMLInputElement;

    OneToOne.addEventListener('click',()=>{
      this.oneToOneChecked = !this.oneToOneChecked;
      this.manyToManyChecked = !this.manyToManyChecked;
      this.reset();
    });

    ManyToMany.addEventListener('click',()=>{
      this.manyToManyChecked = !this.manyToManyChecked;
      this.oneToOneChecked = !this.oneToOneChecked;
      this.reset();
    });
  }


  ngOnInit(): void {
    this.addQuestion();
    this.addAnswer();
  }

  

  reset(){
    this.matchedPairs = new Map();
    this.startPoint = new Array(3);
    this.endPoint = new Array(3);
    this.modelList = new Array();
    this.included = new Array();
    this.numberOfTimes = new Map();
    this.drawing = 0;
    this.draw();
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
          console.log("start: ",this.startPoint);
          const exists = this.included.some(subArr => 
            subArr.length === this.startPoint.length && 
            subArr.every((val: any, index: number) => val === this.startPoint[index])
          );          
          if((this.oneToOneChecked && !exists)){
            this.drawing = 1;
            this.matchedPairs.set(this.startPoint,this.startPoint);
            this.included.push([...this.startPoint]);
            this.draw();
            break;
          }else if(this.manyToManyChecked && this.numberOfTimes.get(JSON.stringify(this.startPoint))==undefined ? 0 < Math.min(this._question.size,this._answer.size) : this.numberOfTimes.get(JSON.stringify(this.startPoint))  < Math.min(this._question.size,this._answer.size )){
            this.drawing = 1;
            this.matchedPairs.set(this.startPoint,this.startPoint);
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
              this.included.push(this.endPoint);
              this.matchedPairs.set(this.startPoint,this.endPoint);
              this.startPoint = new Array(3);
              this.endPoint = new Array(3);
              this.isMoving = 0;
              this.draw();
              break;
            }else if(this.manyToManyChecked && this.numberOfTimes.get(JSON.stringify(this.endPoint))==undefined ? 0 < Math.min(this._question.size,this._answer.size) : this.numberOfTimes.get(JSON.stringify(this.endPoint))  < Math.min(this._question.size,this._answer.size )){
              this.drawing = 0;
              console.log("end: ",this.endPoint);
              this.included.push(this.endPoint);
              this.matchedPairs.set(this.startPoint,this.endPoint);
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
      this.matchedPairs.set(this.startPoint,[x,y]);
      this.draw();
    }
  }
  
  addQuestion(){ 
    this._question.set(this.index, " ");
    let row = document.createElement('div');   
    row.className = `row-${this.index}`; 
    row.style.display = "flex";
    row.style.marginBottom = "12px";
    row.innerHTML = ` 
      <textarea type="textarea" id="input-${this.index}" style="width:278px;padding:5px; height:34px; font-size:20px;resize:none;scrollbar-width: none;line-height:1; border: 2px solid #0000001F"></textarea>
      <button id="btn-${this.index}" style="border: none;
                                            background: none;
                                            cursor: pointer;
                                            margin: 0;
                                            padding: 0;
                                            margin-left:5px;
                                            color: #1F7A54;">
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
    this.canvasHeight += this.canvasIncreaseFactor;
    this.draw(); 
  } 

  addAnswer(){ 
    this._answer.set(this.ansIndex, " ");
    let row = document.createElement('div');  
    row.style.display = "flex"; 
    row.className = `row-${this.ansIndex}`; 
    row.style.marginBottom = "12px";
    row.innerHTML = ` 
      <textarea type="text" id="input-${this.ansIndex}" style="width:278px;padding:5px; height:34px;resize:none;  font-size:20px;scrollbar-width: none;line-height:1; border: 2px solid #0000001F"></textarea>
      <button id="btn-${this.ansIndex}" style="border: none;
                                                background: none;
                                                cursor: pointer;
                                                margin: 0;
                                                padding: 0;
                                                margin-left:5px;
                                                color:#1F7A54;" >
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
    this.canvasHeight += this.canvasIncreaseFactor;
    this.draw(); 
  }

  removeIncluded(target:number[]){
    const index = this.included.findIndex(subArr => 
      subArr.length === target.length && 
      subArr.every((val: number, index: number) => val === target[index])
    );
    this.included.splice(index,index);
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
    this.canvasHeight -= this.canvasIncreaseFactor;
    this.draw();
  }

  updateStartAndEnd(){
    if(this.deltedObject[1] == "stimulus"){
      for(let [k,v] of this.matchedPairs){
        if((k[0] == this.stimulusStartXCircle && k[2] == this.deltedObject[0]) || (v[0] == this.stimulusStartXCircle && v[2] == this.deltedObject[0])){
          this.matchedPairs.delete(k);
          this.removeIncluded(k);
          this.removeIncluded(v);
          if(this.manyToManyChecked){
            this.numberOfTimes.set(JSON.stringify(k),this.numberOfTimes.get(JSON.stringify(k))-1);
            this.numberOfTimes.set(JSON.stringify(v),this.numberOfTimes.get(JSON.stringify(v))-1);
          }
        }
      }
    }else{
      for(let [k,v] of this.matchedPairs){
        if((k[0] == this.responseStartX && k[2] == this.deltedObject[0]) || (v[0] == this.responseStartX && v[2] == this.deltedObject[0])){
          this.matchedPairs.delete(k);
          this.removeIncluded(k);
          this.removeIncluded(v);
          if(this.manyToManyChecked){
            this.numberOfTimes.set(JSON.stringify(k),this.numberOfTimes.get(JSON.stringify(k))-1);
            this.numberOfTimes.set(JSON.stringify(v),this.numberOfTimes.get(JSON.stringify(v))-1);
          }
        }
      }
    }
    let newlyAdded = new Map();
    if(this.deltedObject[1] == "stimulus"){
      for(let [k,v] of this.matchedPairs){
        if((k[0] == this.stimulusStartXCircle && k[2] > this.deltedObject[0] && newlyAdded.get(k) == undefined)){
          this.matchedPairs.delete(k);
          this.removeIncluded(k);
          let key = [k[0],k[1]-this.decreaseY,k[2]];
          if(this.manyToManyChecked){
            this.numberOfTimes.set(JSON.stringify(key),this.numberOfTimes.get(JSON.stringify(k))-1);
            this.numberOfTimes.set(JSON.stringify(v),this.numberOfTimes.get(JSON.stringify(v))-1);
            this.numberOfTimes.delete(k);
          }
          this.matchedPairs.set(key,v);
          this.included.push(key);
          newlyAdded.set(key,v);
        }else if(v[0] == this.stimulusStartXCircle && v[2] > this.deltedObject[0] && newlyAdded.get(k) == undefined){
          this.matchedPairs.delete(k);
          this.removeIncluded(v);
          let value = [v[0],v[1]-this.decreaseY,v[2]];
          if(this.manyToManyChecked){
            this.numberOfTimes.set(JSON.stringify(k),this.numberOfTimes.get(JSON.stringify(k))-1);
            this.numberOfTimes.set(JSON.stringify(value),this.numberOfTimes.get(JSON.stringify(v))-1);
            this.numberOfTimes.delete(v);
          }
          this.matchedPairs.set(k,value);
          this.included.push(value);
          newlyAdded.set(k,value);
        }
      }
    }else{
      for(let [k,v] of this.matchedPairs){
        if((k[0] == this.responseStartX && k[2] > this.deltedObject[0] && newlyAdded.get(k) == undefined)){
          this.matchedPairs.delete(k);
          this.removeIncluded(k);
          let key = [k[0],k[1]-this.decreaseY,k[2]];
          if(this.manyToManyChecked){
            this.numberOfTimes.set(JSON.stringify(key),this.numberOfTimes.get(JSON.stringify(k))-1);
            this.numberOfTimes.set(JSON.stringify(v),this.numberOfTimes.get(JSON.stringify(v))-1);
            this.numberOfTimes.delete(k);
          }
          this.matchedPairs.set(key,v);
          this.included.push(key);
          newlyAdded.set(key,v);
        }else if(v[0] == this.responseStartX && v[2] > this.deltedObject[0] && newlyAdded.get(k) == undefined){
          this.matchedPairs.delete(k);
          this.removeIncluded(v);
          let value = [v[0],v[1]-this.decreaseY,v[2]];
          if(this.manyToManyChecked){
            this.numberOfTimes.set(JSON.stringify(k),this.numberOfTimes.get(JSON.stringify(k))-1);
            this.numberOfTimes.set(JSON.stringify(value),this.numberOfTimes.get(JSON.stringify(v))-1);
            this.numberOfTimes.delete(v);
          }
          this.matchedPairs.set(k,value);
          this.included.push(value);
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
    c!.width = 849
    c!.height = this.canvasHeight;
    c!.style.width = "849px";
    c!.style.height = `${this.canvasHeight}px`
    let context = c?.getContext("2d");
    this.oldlist = this.modelList;
    let h = this.drawCanvas(context);
    this.drawCanvasAns(context);
    if(this.delete){
      this.updateStartAndEnd();
      this.delete = 0;
    }
    this.drawConnections(context);
  }

  drawCanvas(context: CanvasRenderingContext2D | null | undefined){
    let x = this.stimulusStartX;
    let y = this.stimulusStartY;
    this.questionIds = 1;
    this.modelList = [];
    let h = 0;
    let arr = Array.from(this._question.values());
    for(let i=0;i<arr.length;i++){
      while(this.deleteIds.includes(this.questionIds)){
        this.questionIds++;
      }
      let s = new stimulus(this.questionIds,x,y,this.width,this.heigth,this.radius,arr[i]);
      h = s.draw(context!);
      console.log("the new height: ",h);
      this.modelList.push(s);
      this.questionIds++;
      y += this.decreaseY;
      // if(h == 34){
      //   y += 50;
      // }else{
      //   y += h;
      // }
    }
    // return h;
  }

  drawCanvasAns(context: CanvasRenderingContext2D | null | undefined,extra:number=0){
    let x = this.responseStartX;
    let y = this.responseStartY;
    if(extra == 34) extra = 0;
    else extra = extra-34;
    let arr = Array.from(this._answer.values());
    this.ansIds = 1;
    for(let i=0;i<arr.length;i++){
      while(this.deleteIdsAns.includes(this.ansIds)){
        this.ansIds++;
      }
      let r = new response(this.ansIds,x,y,this.width,this.heigth,this.radius,arr[i]);
      let h = r.draw(context!);
      this.modelList.push(r);
      this.ansIds++;
      y += this.decreaseY;
      // if(h == 34){
      //   y += 50;
      // }else{
      //   y += h;
      // }
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

  setDataForPreview(){
    this.dataService.setQuestion(this._question)
    this.dataService.setAnswer(this._answer);
    this.dataService.setdeletedIds(this.deleteIds);
    this.dataService.setMatchedPairs(this.matchedPairs);
    this.dataService.setModelList(this.modelList);
  }

  
}
