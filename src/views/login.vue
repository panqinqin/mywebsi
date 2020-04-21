<template>
    <div class="main">
        <canvas id="c"></canvas>
    </div>
</template>

<script>
    import * as dat from 'dat.gui';
    import Verctor from "../util/Verctor";
    import GravityPoint from "../util/gravityPoint";
    import Particle from "../util/Particle"

    export default {
        name: "login",
        data() {
            return {
                // Configs
                BACKGROUND_COLOR: 'rgba(11, 51, 56, 1)',
                PARTICLE_RADIUS: 1,
                G_POINT_RADIUS: 10,

                // lets
                canvas: null,
                context: null,
                bufferCvs: null,
                bufferCtx: null,
                screenWidth: null,
                screenHeight: null,
                mouse: new Verctor(),
                gravities: [],
                particles: [],
                grad: null,
                gui: null,
                control: null,
                item: null
            }
        },
        mounted() {
            /**
             * requestAnimationFrame
             */
            window.requestAnimationFrame = this.getRequestAnimationFrame();
            this.init()
        },
        beforeDestroy() {
            this.gui.destroy();
        },
        methods: {
            init() {
                // GUI Control
                this.control = {
                    particleNum: 188
                };

                // Init
                this.canvas = document.getElementById('c');
                this.bufferCvs = document.createElement('canvas');

                window.addEventListener('resize', this.resize, false);
                this.resize(null);

                this.addParticle(this.control.particleNum);

                this.canvas.addEventListener('mousemove', this.mouseMove, false);
                this.canvas.addEventListener('mousedown', this.mouseDown, false);
                this.canvas.addEventListener('mouseup', this.mouseUp, false);

                this.mouseDown({clientX:this.screenWidth/3 , clientY:this.screenHeight/2 });
                // GUI

                // this.gui = new dat.GUI();
                // this.item = this.gui.add(this.control, 'particleNum', 0, 500).step(1).name('Particle Num').onChange(() => {
                //     let n = (this.control.particleNum | 0) - this.particles.length;
                //     if (n > 0)
                //         this.addParticle(n);
                //     else if (n < 0)
                //         this.removeParticle(-n);
                // });
                // this.gui.add(GravityPoint, 'interferenceToPoint').name('Interference Between Point');
                // this.gui.close();

                // Start Update

                this.loop();

            },
            loop() {
                let i, len, g, p;

                this.context.save();
                this.context.fillStyle = this.BACKGROUND_COLOR;
                this.context.fillRect(0, 0, this.screenWidth, this.screenHeight);
                this.context.fillStyle = this.grad;
                this.context.fillRect(0, 0, this.screenWidth, this.screenHeight);
                this.context.restore();

                for (i = 0, len = this.gravities.length; i < len; i++) {
                    g = this.gravities[i];
                    if (g.dragging) g.drag(this.mouse);
                    g.render(this.context);
                    if (g.destroyed) {
                        this.gravities.splice(i, 1);
                        len--;
                        i--;
                    }
                }

                this.bufferCtx.save();
                this.bufferCtx.globalCompositeOperation = 'destination-out';
                this.bufferCtx.globalAlpha = 0.35;
                this.bufferCtx.fillRect(0, 0, this.screenWidth, this.screenHeight);
                this.bufferCtx.restore();

                // パーティクルをバッファに描画
                // for (i = 0, len = particles.length; i < len; i++) {
                //     particles[i].render(bufferCtx);
                // }
                len = this.particles.length;
                this.bufferCtx.save();
                this.bufferCtx.fillStyle = this.bufferCtx.strokeStyle = '#fff';
                this.bufferCtx.lineCap = this.bufferCtx.lineJoin = 'round';
                this.bufferCtx.lineWidth = this.PARTICLE_RADIUS * 2;
                this.bufferCtx.beginPath();
                for (i = 0; i < len; i++) {
                    p = this.particles[i];
                    p.update();
                    this.bufferCtx.moveTo(p.x, p.y);
                    this.bufferCtx.lineTo(p._latest.x, p._latest.y);
                }
                this.bufferCtx.stroke();
                this.bufferCtx.beginPath();
                for (i = 0; i < len; i++) {
                    p = this.particles[i];
                    this.bufferCtx.moveTo(p.x, p.y);
                    this.bufferCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
                }
                this.bufferCtx.fill();
                this.bufferCtx.restore();

                // バッファをキャンバスに描画
                this.context.drawImage(this.bufferCvs, 0, 0);

                requestAnimationFrame(this.loop);
            },
            // Event Listeners
            resize() {
                this.screenWidth = this.canvas.width = window.innerWidth;
                this.screenHeight = this.canvas.height = window.innerHeight;
                this.bufferCvs.width = this.screenWidth;
                this.bufferCvs.height = this.screenHeight;
                this.context = this.canvas.getContext('2d');
                this.bufferCtx = this.bufferCvs.getContext('2d');

                let cx = this.canvas.width * 0.5,
                    cy = this.canvas.height * 0.5;

                this.grad = this.context.createRadialGradient(cx, cy, 0, cx, cy, Math.sqrt(cx * cx + cy * cy));
                this.grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
                this.grad.addColorStop(1, 'rgba(0, 0, 0, 0.35)');
            },

            mouseMove(e) {
                this.mouse.set(e.clientX, e.clientY);

                let i, g, hit = false;
                for (i = this.gravities.length - 1; i >= 0; i--) {
                    g = this.gravities[i];
                    if ((!hit && g.hitTest(this.mouse)) || g.dragging)
                        g.isMouseOver = hit = true;
                    else
                        g.isMouseOver = false;
                }

                this.canvas.style.cursor = hit ? 'pointer' : 'default';
            },

            mouseDown(e) {
                for (let i = this.gravities.length - 1; i >= 0; i--) {
                    if (this.gravities[i].isMouseOver) {
                        this.gravities[i].startDrag(this.mouse);
                        return;
                    }
                }
                this.gravities.push(new GravityPoint(e.clientX, e.clientY, this.G_POINT_RADIUS, {
                    particles: this.particles,
                    gravities: this.gravities
                }));
            },

            mouseUp() {
                for (let i = 0, len = this.gravities.length; i < len; i++) {
                    if (this.gravities[i].dragging) {
                        this.gravities[i].endDrag();
                        break;
                    }
                }
            },
            //function
            //添加粒子
            addParticle(num) {
                let i, p;
                for (i = 0; i < num; i++) {
                    p = new Particle(
                        Math.floor(Math.random() * this.screenWidth - this.PARTICLE_RADIUS * 2) + 1 + this.PARTICLE_RADIUS,
                        Math.floor(Math.random() * this.screenHeight - this.PARTICLE_RADIUS * 2) + 1 + this.PARTICLE_RADIUS,
                        this.PARTICLE_RADIUS
                    );
                    p.addSpeed(Verctor.random());
                    this.particles.push(p);
                }
            },
            removeParticle(num) {
                if (this.particles.length < num) num = this.particles.length;
                for (let i = 0; i < num; i++) {
                    this.particles.pop();
                }
            },
            getRequestAnimationFrame() {
                return window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.oRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||
                    function (callback) {
                        window.setTimeout(callback, 1000 / 60);
                    };
            }
        }
    }
</script>

<style scoped>
    canvas {
        width: 100%;
        height: 100%;
    }

    .main {
        width: 100%;
        height: 100%;
    }
</style>