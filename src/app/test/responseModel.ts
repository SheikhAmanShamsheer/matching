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
        this.circleY = this.y+15
    }
    draw(context:CanvasRenderingContext2D){
        context?.beginPath();
        context?.arc(this.circleX,this.circleY,12,0,360);
        context?.stroke();
        context?.beginPath();
        context!.fillStyle = "black";
        context?.rect(this.x+0.5+20,this.y+0.5,278,34);
        context!.font = "20px Roboto";
        context?.fillText(this.text,this.x+25,this.y+20);
        context?.stroke();
    }
}