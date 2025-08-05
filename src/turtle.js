class Turtle {
  constructor(canvas) {
    this.ctx = canvas.getContext('2d');
    this.PIXEL_RATIO = window.devicePixelRatio || 1;
    this.canvas = canvas;
    this.reset();
  }

  reset() {
    this.recenter();
    this.direction = this.deg2rad(90); // facing "up"
    this.visible = true;
    this.pen = true; // when pen is true we draw, otherwise we move without drawing
    this.color = 'black';
  }

  deg2rad(degrees) {
    return (Math.PI / 180) * degrees;
  }

  recenter() {
    this.position = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
    };
  }

  forward(distance) {
    const start = this.position;
    this.position = {
      x: Math.cos(this.direction) * distance * this.PIXEL_RATIO + start.x,
      y: -Math.sin(this.direction) * distance * this.PIXEL_RATIO + start.y,
    };
    if (this.pen) {
      this.ctx.lineStyle = this.color;
      this.ctx.beginPath();
      this.ctx.moveTo(start.x, start.y);
      this.ctx.lineTo(this.position.x, this.position.y);
      this.ctx.stroke();
    }
  }

  turn(degrees) {
    this.direction += this.deg2rad(degrees);
  }

  penUp() {
    this.pen = false;
  }

  penDown() {
    this.pen = true;
  }

  clear() {
    this.ctx.save();
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
    this.reset();
    this.ctx.moveTo(this.position.x, this.position.y);
  }
}

export default Turtle;
