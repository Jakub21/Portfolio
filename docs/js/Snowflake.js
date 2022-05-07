let app;

// Interactions
const I_MIN_ADD_INTERVAL = 75;
const I_MAX_SCROLL_VH_ACTIVE = 0.33;
const I_INACTIVE_MULT = 0.33;
// Environment
const S_ADD_CHANCE = 0.1;
const S_ADD_HEIGHT = -100;
const S_REM_OFFSET = 100;
const S_GRAVITY = 1;
const S_WIND_MIN = 0.4;
const S_WIND_LOW = 0.8;
const S_WIND_HGH = 1.4;
const S_WIND_MAX = 1.8;
const S_DELTA_MIN = -0.1;
const S_DELTA_MAX = 0.1;
const S_DELTA_SPREAD = 0.0001;
const S_DELTA_NUDGE = 0.00001;
const S_DELTA_ENFORCE = 0.00025;
// Flake appearance
const TRF_SCALE_MIN = 0.125;
const TRF_SCALE_MAX = 0.4;
const COLOR_FILL = [100, 100, 100];
const COLOR_FILL_SPECIAL = [255, 70, 100];
const COLOR_ALPHA_MIN = 100;
const COLOR_ALPHA_MAX = 200;
// Flake movement
const WEIGHT_BASE = 1;
const WEIGHT_SPREAD = 0.34;
const ROTATE_CCW_CHANCE = 0.15;
const ROTATION_BASE_SPEED = 0.01;
// Flake vertices generation;
const VRT_TWELVE_SIDES_CHANCE = 0; //0.15;
const VRT_IN_SIZE = 30;
const VRT_OUT_SIZE_MIN = 60;
const VRT_OUT_SIZE_SPREAD = 0;//60;
const VRT_X_SPREAD = 5;
const VRT_Y_SPREAD_THRESH = 50;
const VRT_Y_SPREAD_LOW = 7;
const VRT_Y_SPREAD_HI_A_CHANCE = 0.25;
const VRT_Y_SPREAD_HI_A = 14;
const VRT_Y_SPREAD_HI_B = 18;
const VRT_SLIM_THRESH = 50;
const VRT_SLIM_FACTOR = 0.5;
const VRT_TIP_OFFSET = 10;


let initSnowflakes = () => {
  app = new FlakesApp($.get('#Canvas'), $.get('#FPS'), 120);
  app.run();
}


class FlakesApp extends oci.CanvasInterface {
  constructor(canvas, fpsElement, targetFps=60) {
    super(canvas.elm);
    this.fps = targetFps;
    this.meter = new FpsMeter();
    this.fpsElement = fpsElement;
    this.flakes = [];
    this.updateActive();
    $.get('body').on('click', (evt) => {
      if (!this.active) return;
      this.addManualFlake(new oci.Vector(evt.x, evt.y));
    });
    $.get('body').on('mousemove', (evt) => {
      if (!evt.buttons) return;
      this.addManualFlake(new oci.Vector(evt.x, evt.y));
    });
    new $.DomiObject(window).on('scroll', () => {
      this.updateActive();
    });
  }
  addManualFlake(pos) {
    if (!this.active) return;
    let now = Date.now()
    if ((now - this.lastAdded) < I_MIN_ADD_INTERVAL) return;
    this.lastAdded = now;
    let value = Math.random() * 0.75;
    let flake = new Flake(this, pos, value);
    flake.tex.fill = new oci.Color(...COLOR_FILL_SPECIAL, flake.tex.fill.a);
    this.flakes.push(flake);
  }
  updateActive() {
    let frac = window.scrollY / window.innerHeight;
    this.active = frac < I_MAX_SCROLL_VH_ACTIVE;
    new $.DomiObject(this.canvas)._s.setAdded('Inactive', !this.active);
  }
  run() {
    super.update();
    for (let y=S_ADD_HEIGHT; y<this.canvas.height; y++) {
      this.addRandomFlake(y);
    }
    this.wind = (S_WIND_LOW + S_WIND_HGH) / 2;
    this.windDelta = (S_DELTA_MIN + S_DELTA_MAX) / 2;
    this.interval = setInterval(() => {this.update();}, 1e3/this.fps);
  }
  update() {
    super.update();
    this.updateWind();
    let velocity = new oci.Vector(this.wind, S_GRAVITY);
    if (!this.active) velocity.mult(I_INACTIVE_MULT);
    this.flakes.forEach((flake) => {
      flake.move(velocity);
      if (flake.pos.y > this.canvas.height + S_REM_OFFSET) {
        this.remove(flake);
      }
    });
    this.addRandomFlake(S_ADD_HEIGHT);
    this.meter.tick();
    // this.fpsElement.prop(
    //   {innerText: `FPS: ${Math.round(this.meter.get())}`});
  }
  remove(flake) {
    flake.remove();
    this.flakes.splice(this.flakes.indexOf(flake), 1);
  }
  updateWind() {
    this.windDelta += Math.random() * S_DELTA_SPREAD * 2 - S_DELTA_SPREAD;
    if (this.wind < S_WIND_MIN && this.windDelta < 0) {this.windDelta += S_DELTA_ENFORCE;}
    else if (this.wind < S_WIND_LOW && this.windDelta < 0) {this.windDelta += S_DELTA_NUDGE;}
    else if (this.wind > S_WIND_MAX && this.windDelta > 0) {this.windDelta -= S_DELTA_ENFORCE;}
    else if (this.wind > S_WIND_HGH && this.windDelta > 0) {this.windDelta -= S_DELTA_NUDGE;}
    if (this.windDelta < S_DELTA_MIN) {this.windDelta += S_DELTA_ENFORCE;}
    if (this.windDelta > S_DELTA_MAX) {this.windDelta -= S_DELTA_ENFORCE;}
    this.wind += this.windDelta;
  }
  addRandomFlake(y) {
    let chance = this.active? S_ADD_CHANCE : S_ADD_CHANCE * I_INACTIVE_MULT;
    if (Math.random() >= chance) return;
    let flakeValue = Math.random();
    let width = this.canvas.width;
    let x = (Math.random() * width * 2) - width;
    let flake = new Flake(this, new oci.Vector(x, y), Math.random());
    this.flakes.push(flake);
  }
}


class Flake extends oci.elm.RadialPolygon {
  constructor(ci, pos, value) {
    let {sides, vertices} = Flake._generateVertices();
    super(ci, pos, sides, vertices, 1/value);
    let alpha = COLOR_ALPHA_MAX - ((COLOR_ALPHA_MAX-COLOR_ALPHA_MIN)*value);
    this.tex.fill = new oci.Color(...COLOR_FILL, alpha);
    this.weight = WEIGHT_BASE + (value * WEIGHT_SPREAD - WEIGHT_SPREAD/2);
    this.trf.scale = TRF_SCALE_MAX - ((TRF_SCALE_MAX-TRF_SCALE_MIN)*value);
    this.value = value;
    this.rotation = 1 / value;
    this.rotDirection = (Math.random() < ROTATE_CCW_CHANCE)? -1 : 1;
  }
  move(velocity) {
    this.pos.add(velocity.copy().mult(1/this.weight));
    this.rotation = velocity.x / this.weight;
    this.trf.rotate += this.rotation * this.rotDirection * ROTATION_BASE_SPEED;
  }
  static _generateVertices() {
    const twelveSides = Math.random() < VRT_TWELVE_SIDES_CHANCE;
    const sides = twelveSides? 12: 6;
    const size = Math.random() * VRT_OUT_SIZE_SPREAD + VRT_OUT_SIZE_MIN;
    let vertices = [];
    for (let x=VRT_IN_SIZE; x<size; x+=VRT_X_SPREAD) {
      const ySpread = (x < VRT_Y_SPREAD_THRESH)?
        VRT_Y_SPREAD_LOW : ((Math.random() < VRT_Y_SPREAD_HI_A_CHANCE)?
          VRT_Y_SPREAD_HI_A : VRT_Y_SPREAD_HI_B);
      let y = 1 + ySpread + Math.random() * ySpread;
      if (x > VRT_SLIM_THRESH) y *= VRT_SLIM_FACTOR;
      vertices.push([x, y]);
    }
    let mirror = ([x, y]) => {return [x, -y]};
    vertices = oci.Vector.Array([...vertices, [size+VRT_TIP_OFFSET, 0],
      ...vertices.map(mirror).reverse()].reverse());
    return {sides, vertices};
  }
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
