import Verctor from "../util/Verctor.js"
class GravityPoint {
    static RADIUS_LIMIT = 65;
    static interferenceToPoint = true;
    constructor(x, y, radius, targets) {
        Verctor.call(this, x, y);
        this.radius = radius;
        this.currentRadius = radius * 0.5;

        this._targets = {
            particles: targets.particles || [],
            gravities: targets.gravities || []
        };
        this._speed = new Verctor();
    };
}
GravityPoint.prototype =(function(o) {
    let s = new Verctor(0, 0), p;
    for (p in o) s[p] = o[p];
    return s;
})(
    {
        gravity:       0.05,
        isMouseOver:   false,
        dragging:      false,
        destroyed:     false,
        _easeRadius:   0,
        _dragDistance: null,
        _collapsing:   false,

        hitTest: function(p) {
            return this.distanceTo(p) < this.radius;
        },

        startDrag: function(dragStartPoint) {
            this._dragDistance = Verctor.sub(dragStartPoint, this);
            this.dragging = true;
        },

        drag: function(dragToPoint) {
            this.x = dragToPoint.x - this._dragDistance.x;
            this.y = dragToPoint.y - this._dragDistance.y;
        },

        endDrag: function() {
            this._dragDistance = null;
            this.dragging = false;
        },

        addSpeed: function(d) {
            this._speed = this._speed.add(d);
        },

        collapse: function() {
            this.currentRadius *= 1.75;
            this._collapsing = true;
        },

        render: function(ctx) {
            if (this.destroyed) return;

            let particles = this._targets.particles,
                i, len;

            for (i = 0, len = particles.length; i < len; i++) {
                particles[i].addSpeed(Verctor.sub(this, particles[i]).normalize().scale(this.gravity));
            }

            this._easeRadius = (this._easeRadius + (this.radius - this.currentRadius) * 0.07) * 0.95;
            this.currentRadius += this._easeRadius;
            if (this.currentRadius < 0) this.currentRadius = 0;

            if (this._collapsing) {
                this.radius *= 0.75;
                if (this.currentRadius < 1) this.destroyed = true;
                this._draw(ctx);
                return;
            }

            let gravities = this._targets.gravities,
                g, absorp,
                area = this.radius * this.radius * Math.PI, garea;

            for (i = 0, len = gravities.length; i < len; i++) {
                g = gravities[i];

                if (g === this || g.destroyed) continue;

                if (
                    (this.currentRadius >= g.radius || this.dragging) &&
                    this.distanceTo(g) < (this.currentRadius + g.radius) * 0.85
                ) {
                    g.destroyed = true;
                    this.gravity += g.gravity;

                    absorp = Verctor.scale(g.radius / this.radius * 0.5);
                    this.addSpeed(absorp);

                    garea = g.radius * g.radius * Math.PI;
                    this.currentRadius = Math.sqrt((area + garea * 3) / Math.PI);
                    this.radius = Math.sqrt((area + garea) / Math.PI);
                }

                g.addSpeed(Verctor.sub(this, g).normalize().scale(this.gravity));
            }

            if (GravityPoint.interferenceToPoint && !this.dragging)
                this.add(this._speed);

            this._speed = new Verctor();

            if (this.currentRadius > GravityPoint.RADIUS_LIMIT) this.collapse();

            this._draw(ctx);
        },

        _draw: function(ctx) {
            let grd, r;

            ctx.save();

            grd = ctx.createRadialGradient(this.x, this.y, this.radius, this.x, this.y, this.radius * 5);
            grd.addColorStop(0, 'rgba(0, 0, 0, 0.1)');
            grd.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 5, 0, Math.PI * 2, false);
            ctx.fillStyle = grd;
            ctx.fill();

            r = Math.random() * this.currentRadius * 0.7 + this.currentRadius * 0.3;
            grd = ctx.createRadialGradient(this.x, this.y, r, this.x, this.y, this.currentRadius);
            grd.addColorStop(0, 'rgba(0, 0, 0, 1)');
            grd.addColorStop(1, Math.random() < 0.2 ? 'rgba(255, 196, 0, 0.15)' : 'rgba(103, 181, 191, 0.75)');
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2, false);
            ctx.fillStyle = grd;
            ctx.fill();
            ctx.restore();
        }
    });
export default GravityPoint