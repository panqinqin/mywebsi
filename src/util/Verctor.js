
class Verctor{
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    static add (a, b) {
        return new Verctor(a.x + b.x, a.y + b.y);
    };

    static sub(a, b) {
        return new Verctor(a.x - b.x, a.y - b.y);
    };

    static scale(v, s) {
        console.log(v,s)
        return v.clone().scale(s);
    };

    static random() {
        return new Verctor(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1
        );
    };
    set(x, y) {
        if (typeof x === 'object') {
            y = x.y;
            x = x.x;
        }
        this.x = x || 0;
        this.y = y || 0;
        return this;
    };

    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    };

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    };

    scale(s) {
        this.x *= s;
        this.y *= s;
        return this;
    };

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };

    lengthSq() {
        return this.x * this.x + this.y * this.y;
    };

    normalize() {
        let m = Math.sqrt(this.x * this.x + this.y * this.y);
        if (m) {
            this.x /= m;
            this.y /= m;
        }
        return this;
    };

    angle() {
        return Math.atan2(this.y, this.x);
    };

    angleTo(v) {
        let dx = v.x - this.x,
            dy = v.y - this.y;
        return Math.atan2(dy, dx);
    };

    distanceTo(v) {
        let dx = v.x - this.x,
            dy = v.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    };

    distanceToSq(v) {
        let dx = v.x - this.x,
            dy = v.y - this.y;
        return dx * dx + dy * dy;
    };

    lerp(v, t) {
        this.x += (v.x - this.x) * t;
        this.y += (v.y - this.y) * t;
        return this;
    };

    clone() {
        return new Verctor(this.x, this.y);
    };

    toString() {
        return '(x:' + this.x + ', y:' + this.y + ')';
    }

}

export default Verctor