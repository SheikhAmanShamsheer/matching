export class response{
    id:number=0;
    x:number = 0;
    y:number = 0;
    width:number = 0;
    heigth:number = 0;
    radius:number = 0;
    circleX:number = 0;
    circleY:number = 0;
    text:string="";
    type="response";
    constructor(id:number, x: number,y: number ,widht: number ,heigth: number ,radius: number,text:string){
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = widht;
        this.heigth = heigth;
        this.radius = radius;
        this.text = text;
        this.circleX = this.x;
        this.circleY = this.y+15;
    }
    // draw(context:CanvasRenderingContext2D){
    //     context?.beginPath();
    //     context?.arc(this.circleX+0.5,this.circleY+0.5,12,0,360);
    //     context?.stroke();
    //     context?.beginPath();
    //     context!.fillStyle = "black";
    //     context?.rect(this.x+20,this.y,this.width,this.heigth);
    //     context!.font = "20px Roboto";
    //     context?.fillText(this.text,this.x+22,this.y+this.heigth/2);
    //     context?.stroke();
    // }
    draw(context:CanvasRenderingContext2D){
        this.settext();
        context.strokeStyle = "#0000001F";
        context?.rect(this.x+20,this.y,this.width,this.heigth);
        context.stroke();
        context!.font = "20px QuickSand";
        let t = this.text.split("\n");
        let y = this.y+this.heigth/2;
        let sy = this.y+this.heigth/2;
        let h = this.heigth;
        for(let i=0;i<t.length;i++){
          context.clearRect(this.x+20,this.y,this.width,h);
          context.beginPath();
          context.fillStyle = "white";
          context?.fillRect(this.x+20,this.y,this.width,h);
          context.strokeStyle = "#0000001F";
          context?.rect(this.x+20,this.y,this.width,h);
          context.stroke();
          let s = sy;
          context.fillStyle = "black";
          for(let j=0;j<=i;j++){
            context?.fillText(t[j],this.x+22,s);
            s += 20;
            // if(j == i) break;
          }
          if(t.length > 1) h += 20;
        }
        context?.beginPath();
        context.strokeStyle  = "#1F7A54";
        context?.arc(this.circleX,this.circleY,this.radius,0,360);
        context?.stroke();
    }
    settext(){
        let max = 460;
        let fontSize = 20;
        let newText = "";
        let added = 0;
        let strArr = this.text.split(" ");
        for(let i=0;i<strArr.length;i++){
          added += strArr[i].length*fontSize;
          if(added < max){
            newText += strArr[i] + " ";
          }else{
            if(strArr[i].length*fontSize > max){
              added = 0;
              let temp = "";
              for(let j=0;j<strArr[i].length;j++){
                added += fontSize;
                if(added < max){
                  temp += strArr[i][j];
                }else{
                  added = 0;
                  if(newText.length == 0){
                    newText += temp + " ";
                  }else{
                    newText += "\n" + temp + " ";
                  }
                  temp = "";
                }
              }
              if(temp.length > 0){
                newText += "\n" + temp + " ";
                added = temp.length*fontSize;
              }
            }else{
              newText += "\n" + strArr[i] + " ";
              added = strArr[i].length*fontSize;
            }
          }
        } 
        // console.log(newText);
        this.text = newText;
    }

}