export class stimulus{
    id:number=0;
    x:number=0;
    y:number=0;
    width:number=0;
    heigth:number=0;
    radius:number=0;
    circleX:number = 0;
    circleY:number = 0;
    text:string="";
    colored = 0;
    type="stimulus";
    constructor(id: number, x: number,y: number ,widht: number ,heigth: number ,radius: number,text:string){
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = widht;
        this.heigth = heigth;
        this.radius = radius;
        this.text = text;
        this.circleX = this.x+this.width+22;
        this.circleY = this.y+this.heigth/2;
    }
    draw(context:CanvasRenderingContext2D){
        this.settext();
        context.strokeStyle = "#0000001F";
        context?.rect(this.x,this.y,this.width,this.heigth);
        context.stroke();
        context!.font = "20px QuickSand";
        let t = this.text.split("\n");
        let y = this.y+this.heigth/2;
        let sy = this.y+this.heigth/2;
        let h = this.heigth;
        for(let i=0;i<t.length;i++){
          context.clearRect(this.x,this.y,this.width,h);
          context.beginPath();
          context.fillStyle = "white";
          context?.fillRect(this.x,this.y,this.width,h);
          context.strokeStyle = "#0000001F";
          context.rect(this.x,this.y,this.width,h)
          context.stroke();
          let s = sy;
          context.fillStyle = "black";
          for(let j=0;j<=i;j++){
            context?.fillText(t[j],this.x+10,s);
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

    // settext() {
    //     let max = 500;
    //     let fontSize = 20;
    //     let newText = "";
    //     let added = 0;
    //     let strArr = this.text.split(" ");
    //     for (let i = 0; i < strArr.length; i++) {
    //         let word = strArr[i];
    //         let wordWidth = word.length * fontSize;
    //         if (added + wordWidth < max) {
    //             newText += word + " ";
    //             added += wordWidth + fontSize;
    //         } else {
    //             if (wordWidth > max) {
    //                 let temp = "";
    //                 for (let j = 0; j < word.length; j++) {
    //                     added += fontSize;
    //                     if (added < max) {
    //                         temp += word[j];
    //                     } else {
    //                         newText += "\n" + temp;
    //                         temp = word[j];
    //                         added = fontSize;
    //                     }
    //                 }
    //                 newText += "\n" + temp + " ";
    //                 added = temp.length * fontSize + fontSize;
    //             } else {
    //                 newText += "\n" + word + " ";
    //                 added = wordWidth + fontSize;
    //             }
    //         }
    //     }
    
    //     this.text = newText.trim(); 
    // }

    // context.strokeStyle = "rgba(63,139,210,0.2)";
    //       context?.rect(this.x,this.y,this.width,this.heigth);
    //       context.stroke();
    //       context.strokeStyle = "black";
    
}