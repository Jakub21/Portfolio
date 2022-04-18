const FPS = 100;
let ci, meter;
let flakes=[], wind=2, windChange=0;

let init = () => {
  let canvas = $.get('#Canvas');
  MOUSE = new oci.Vector(0, 0);
  canvas.on('mousemove', (evt) => {MOUSE.x = evt.x; MOUSE.y = evt.y});
  ci = new oci.CanvasInterface(canvas.elm);
  meter = new FpsMeter();
  setInterval(() => {
    ci.update();
    meter.tick();
    // ci.view.zoom = Math.min(ci.canvas.width/(1920*2), ci.canvas.height/1080*2);
    if (Math.random() < 0.2) addNewFlake();
    updateWind();
    flakes.forEach((flake) => {
      flake.move();
      // flake.checkPointed();
      if (flake.pos.y < ci.canvas.height + 100 ||
        flake.pos.x < ci.canvas.width + 100) return;
      flake.remove();
      flakes.splice(flakes.indexOf(flake), 1);
    });
  }, 1e3/FPS);
  setInterval(() => {$.get('#FPS').prop({innerText: `FPS: ${Math.round(meter.get())}`})});
}

let updateWind = () => {
  if (windChange < -0.1) { windChange += .001; }
  if (windChange < -0.05) { windChange += .00001; }
  if (windChange > 0.05) { windChange -= .00001; }
  if (windChange > 0.1) { windChange -= .001; }
  if (wind < 0.5) { windChange += .001; }
  if (wind < 1.0) { windChange += .00001; }
  if (wind > 3.5) { windChange -= .00001; }
  if (wind > 5.0) { windChange -= .001; }
  windChange += Math.random() * .00002 - .00001;
  wind += windChange;
}

let addNewFlake = () => {
  let value = Math.random();
  let w = ci.canvas.width;
  let flake = new Flake(ci, new oci.Vector(Math.random()*w*2 -w, -100), value);
  flakes.push(flake);
}

class Flake extends oci.elm.RadialPolygon {
  constructor(ci, pos, value) {
    let sixSided = Math.random() > 0.15;
    let sides = 6;
    let vertices = [];
    let max = Math.random() * 40 + 60;
    for (let x = 30; x<=max; x+=5) {
      let spread = (x < 50)? 7 : ((Math.random() > .25)? 14 : 18);
      let y = Math.random()*spread + (spread+1);
      if (x > 50) y *= 0.5;
      vertices.push([x, y]);
    }
    let mirror = ([x, y]) => {return [x, -y]};
    vertices = oci.Vector.Array([...vertices, [max+10, 0], ...vertices.map(mirror).reverse()].reverse());
    super(ci, pos, sides, vertices, 1/value);
    this.tex.fill = new oci.Color(180, 200, 230, 255-(255*value));
    // this.tex.outline = new oci.Color(200, 230, 250, 255-(255*value));
    // this.tex.lineWidth = 3;
    this.trf.scale = 0.25;
    this.value = value;
    this.weight = 1 + value * 0.25 - 0.125;
    this.rotationRate = 1/value;
    this.rotationDir = Math.random() < 0.1? -1 : 1;
  }
  move() {
    this.pos.y += 1.5 / this.weight;
    this.pos.x += wind / (this.weight**3);
    this.trf.rotate += this.rotationDir * 0.01 * this.rotationRate;
    this.rotationRate = (wind/this.weight + this.rotationRate) / 2;
  }
  // draw(ctx) {
  //   super.draw(ctx);
  //   this.getBoxAbs().draw(ctx);
  // }
  // checkPointed() {
  //   if (this.intersects(MOUSE)) {
  //     this.tex.fill = new oci.Color(180, 200, 255);
  //   } else {
  //     this.tex.fill = new oci.Color(180, 200, 230, 255-(255*this.value));
  //   }
  // }
}

class FpsMeter {
  constructor(deltas=20) {
    this.maxDeltasLength = deltas;
    this.lastTickTime = Date.now();
    this.deltas = [];
  }
  tick() {
    var now = Date.now();
    var delta = now - this.lastTickTime;
    this.lastTickTime = now;
    this.deltas.push(delta);
    if (this.deltas.length > this.maxDeltasLength) this.deltas.shift();
  }
  get() {
    var average = 0;
    for (var delta of this.deltas) average += delta;
    return 1000 / (average / this.deltas.length);
  }
}
