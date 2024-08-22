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
        context!.fillStyle = "black";
        context?.rect(this.x,this.y,this.width,this.heigth);
        context!.font = "20px Roboto";
        context?.fillText(this.text,this.x,this.y+this.heigth/2);
        context?.stroke();
        context?.beginPath();
        context?.arc(this.circleX,this.circleY,this.radius,0,360);
        context?.stroke();
    }
}