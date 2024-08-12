import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit{
  ngOnInit(): void {
    this.addQuestion();
    this.addAnswer();
  }
  private _question = new Map();
  private _answer = new Map();
  private index = 1;
  private ansIndex = 1;
  

  
  addQuestion(){ 
    this._question.set(this.index, "");
    let row = document.createElement('div');   
      row.className = `row-${this.index}`; 
      row.innerHTML = ` 
      <input type="text" id="input-${this.index}">
      <button id="btn-${this.index}" ">delete</button>
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
      this.draw(); 
  } 

  addAnswer(){ 
    this._answer.set(this.ansIndex, "");
    let row = document.createElement('div');   
      row.className = `row-${this.ansIndex}`; 
      row.innerHTML = ` 
        <input type="text" id="input-${this.ansIndex}">
        <button id="btn-${this.ansIndex}" ">delete</button>
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
      this.draw(); 
  }

  removeInput(id:string,which="question"){
    let numb = id.match(/\d/g);
    let temp = numb!.join("");
    let index = parseInt(temp);
    if(which == "answer"){
      let row = document.querySelector(`.answerInputField .row-${index}`)
      this._answer.delete(index);
      let mainDiv = document.querySelector('.answerInputField');
      mainDiv?.removeChild(row!);
    }else{
      let row = document.querySelector(`.questionInputField .row-${index}`)
      this._question.delete(index);
      let mainDiv = document.querySelector('.questionInputField');
      mainDiv?.removeChild(row!);
    }
    
    this.draw();
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
    c!.height = 600;
    this.drawCanvas(context);
    this.drawCanvasAns(context);
  }
  drawCanvas(context: CanvasRenderingContext2D | null | undefined){
    let x = 0;
    let y = 0;
    let arr = Array.from(this._question.values());
    for(let i=0;i<arr.length;i++){
      context!.fillStyle = "black";
      context?.rect(x+0.5,y+0.5,100,30);
      context?.fillText(arr[i],x+30,y+15);
      context?.stroke();
      context?.beginPath();
      context?.arc(x+120,y+15,12,0,360);
      context?.stroke();
      y += 40;
    }
  }
  drawCanvasAns(context: CanvasRenderingContext2D | null | undefined){
    let x = 300;
    let y = 0;
    let arr = Array.from(this._answer.values());
    for(let i=0;i<arr.length;i++){
      context!.fillStyle = "black";
      context?.rect(x+0.5,y+0.5,100,30);
      context?.fillText(arr[i],x+30,y+15);
      context?.stroke();
      context?.beginPath();
      context?.arc(x+120,y+15,12,0,360);
      context?.stroke();
      y += 40;
    }
  }
}
