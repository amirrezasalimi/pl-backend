let PL;
export class Client {
    x = 0;
    mounted(_) {
        PL = _;
        console.log('Client mounted Moew😍');

        PL.ws.on('ping', () => {
            console.log('ping');
            this.x += 10
        })
    }
    update() {
        const d = PL.vis.getDrawDetail({
            x: (1024 / 2) + this.x,
            y: 100,
        });


        // draw circle on ctx
        PL.ctx.beginPath();
        PL.ctx.arc(d.x, d.y, 10 * d.r, 0, 2 * Math.PI);
        PL.ctx.fillStyle = 'blue';
        PL.ctx.fill();
        PL.ctx.closePath();

        // console.log(PL.ctx);
    }

}
