<template>
    <div class="canvasBox">
        <!--          创建一个stage-->
        <v-stage ref="stage" :config="{width: 1000, height: 600}">
            <v-layer ref="layer">
                <!--       自定义形状       -->
                <v-shape v-for="(el,index) in shapes" :config="el" :key="index + 'shape'"/>
                <v-line v-for="(item,index) in lines" :config="item" :key="index + 'line'"/>
                <v-circle @dragmove="dragmove(el)" @mouseout="mouseout(el)" @mouseover="mouseover(el)" v-for="(el,index) in anchors" :config="el" :key="index+ 'circle'" />
            </v-layer>
        </v-stage>
    </div>
</template>

<script>
    export default {
        name: "konva",
        data() {
            return {
                anchors: [],
                shapes: [],
                points:[],
                lines: [],
                stageSize: {
                    width: 1000,
                    height: 600
                }
            }
        },
        created(){
            this.creatPoint_n({endId:"22",startId:"44",linePoints:[[10,10],[800,400]]},4)
        },
        methods: {
            dragmove(el){
                this.updateDottedLines({endId:"22",startId:"44"},true);
            },
            mouseover(el){
                document.body.style.cursor = 'pointer';
                el.strokeWidth = 4;
            },
            mouseout(el){
                document.body.style.cursor = 'default';
                el.strokeWidth = 2;
            },
            //根据入口，出口点位创建n个等间距的点位
            creatPoint_n(line,num){
                let start = line.linePoints[0];
                let end = line.linePoints[1];
                const pointNum = num;
                if(!num){num = 2}
                let range_row = parseInt((end[0] - start[0])/(num-1));
                let range_col = parseInt((end[1] - start[1])/(num-1));
                while (num > 2) {
                    num--;
                    let newPoint = [start[0] + range_row*(pointNum - num),start[1] + range_col*(pointNum - num)];
                    line.linePoints.splice(line.linePoints.length - 1,0,newPoint);
                }

                //生成每段的辅助点位
                this.createAuxiliaryPoint(line)
            },
            createAuxiliaryPoint(line){
                let startId = line.startId+ "" + line.endId;
                let _this = this,lines = [];
                for (let i=0;i<line.linePoints.length-1;i++){
                    let point = line.linePoints[i];
                    let point_next = line.linePoints[i+1];
                    let center = [(point[0] + point_next[0])/2,(point[1] + point_next[1])/2];
                    //生成点位
                    if(i === 0){
                        this.buildAnchor(point[0],point[1],"Build"+i+"anchor" + startId,startId);
                    }
                    if(i === line.linePoints.length-2){
                        this.buildAnchor(point_next[0],point_next[1],"Build"+i+"anchor_end"+ startId,startId);
                    }else{
                        this.buildAnchorMerge(point_next[0],point_next[1],"Build"+i+"anchor_end"+ startId,startId);
                    }
                    this.buildControl(center[0]-20,center[1]-30,"Point"+i+"anchor1"+ startId,startId);
                    this.buildControl(center[0]+20,center[1] + 30,"Point"+i+"anchor2"+ startId,startId);
                    //画贝塞尔曲线
                    this.shapes.push({
                        stroke: 'red',
                        strokeWidth: 2,
                        lineId:startId,
                        sceneFunc: (ctx, shape) => {
                            let layer = _this.$refs.layer.getNode();
                            ctx.beginPath();
                            if(i === 0){
                                ctx.moveTo(layer.findOne("#Build"+i+"anchor"+ startId).x(), layer.findOne("#Build"+i+"anchor"+ startId).y());
                            }else{
                                ctx.moveTo(layer.findOne("#Build"+(i-1)+"anchor_end"+ startId).x(), layer.findOne("#Build"+(i-1)+"anchor_end"+ startId).y());
                            }
                            ctx.bezierCurveTo(
                                layer.findOne("#Point"+i+"anchor1"+ startId).x(),
                                layer.findOne("#Point"+i+"anchor1"+ startId).y(),
                                layer.findOne("#Point"+i+"anchor2"+ startId).x(),
                                layer.findOne("#Point"+i+"anchor2"+ startId).y(),
                                layer.findOne("#Build"+i+"anchor_end"+ startId).x(),
                                layer.findOne("#Build"+i+"anchor_end"+ startId).y(),
                            );
                            ctx.fillStrokeShape(shape);
                        }
                    });
                    //创建辅助线
                    this.lines.push({
                        dash: [10, 10, 0, 10],
                        strokeWidth: 2,
                        stroke: '#2973FF',
                        lineCap: 'round',
                        id: 'PointLine' + i + "" + startId,
                        lineId:startId,
                        points: [0, 0],
                    });
                }
                this.$nextTick(()=>{
                    this.updateDottedLines(line)
                })
            },
            updateDottedLines(line,flag){
                let startId = line.startId+ "" + line.endId;
                let layer = this.$refs.layer.getNode();
                let startIndex = -1;
                this.lines.map((item,i) => {
                    if( startIndex === -1){startIndex = i}
                    let bezierLinePath = layer.findOne("#" + item.id);
                    let start = [];
                    let index = i-startIndex;
                    if(index === 0){
                        start.push(layer.findOne("#Build"+ index +"anchor"+ startId).x());
                        start.push(layer.findOne("#Build"+ index +"anchor"+ startId).y())
                    }else{
                        start.push(layer.findOne("#Build"+ (index-1) +"anchor_end"+ startId).x());
                        start.push(layer.findOne("#Build"+ (index-1) +"anchor_end"+ startId).y())
                    }
                    let point = [
                        start[0],start[1],
                        layer.findOne("#Point"+index+"anchor1"+ startId).x(),
                        layer.findOne("#Point"+index+"anchor1"+ startId).y(),
                        layer.findOne("#Point"+index+"anchor2"+ startId).x(),
                        layer.findOne("#Point"+index+"anchor2"+ startId).y(),
                        layer.findOne("#Build"+index+"anchor_end"+ startId).x(),
                        layer.findOne("#Build"+index+"anchor_end"+ startId).y(),
                    ];
                    bezierLinePath.points(point);
                });
            },

            //创建轨迹出入口的点
            buildAnchor(x, y,id,lineId) {
                this.anchors.push({
                    x: x,
                    y: y,
                    id:id,
                    lineId:lineId,
                    radius: 5,
                    stroke: '#b5d4ff',
                    fill: '#388aff',
                    strokeWidth: 0,
                    draggable: true,
                });
            },
            //创建合并的点，即中间共用点位
            buildAnchorMerge(x, y,id,lineId) {
                this.anchors.push({
                    x: x,
                    y: y,
                    id:id,
                    lineId:lineId,
                    radius: 5,
                    stroke: 'green',
                    fill: 'green',
                    strokeWidth: 2,
                    draggable: true,
                });
            },
            //创建贝塞尔曲线辅助移动点位
            buildControl(x, y,id,lineId) {
                this.anchors.push({
                    x: x,
                    y: y,
                    id:id,
                    lineId:lineId,
                    radius: 5,
                    stroke: '#2973FF',
                    fill: '#2973FF',
                    strokeWidth: 2,
                    draggable: true,
                });
            },
        }
    }
</script>

<style scoped>

</style>