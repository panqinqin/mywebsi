<template>
    <div style="padding: 20px">
        <div style="padding: 20px">
            搜索
        </div>
        <a-table :data-source="list" :pagination="false" :columns="columns" />
    </div>
</template>

<script>
    import list from "../building/buildingData/index"
    export default {
        name: "building",
        data(){
            this.list = list;
            let filters = [];
            for(let i=1;i<=33;i++){
                filters.push({
                    text:i + "层",
                    value:i + "层"
                })
            }
            return {
                columns:[
                    {
                        title: '楼栋',
                        dataIndex: 'building',
                        key: 'building',
                        filters: [
                            {
                                text: '5栋',
                                value: '5栋',
                            },
                            {
                                text: '6栋',
                                value: '6栋',
                            }
                        ],
                        onFilter: (value, record) => record.building.indexOf(value) === 0,
                    },
                    {
                        title: '楼层',
                        dataIndex: 'floor',
                        key: 'floor',
                        filters:filters,
                        onFilter: (value, record) => record.floor.indexOf(value) === 0,
                    },
                    {
                        title: '房号',
                        dataIndex: 'number',
                        key: 'number',
                    },
                    {
                        title: '单价',
                        dataIndex: 'price',
                        key: 'price',
                        defaultSortOrder: 'descend',
                        sorter: (a, b) => a.price - b.price,
                    },
                    {
                        title: '总价',
                        dataIndex: 'allprice',
                        key: 'allprice',
                        defaultSortOrder: 'descend',
                        sorter: (a, b) => a.price - b.price,
                    },
                    {
                        title: '首付',
                        dataIndex: 'shoufu',
                        key: 'shoufu',
                        defaultSortOrder: 'descend',
                        sorter: (a, b) => a.price - b.price,
                    },
                    {
                        title: '建筑面积',
                        dataIndex: 'area1',
                        key: 'area1',
                    },
                    {
                        title: '户内面积',
                        dataIndex: 'area2',
                        key: 'area2',
                    },
                    {
                        title: '分摊面积',
                        dataIndex: 'area3',
                        key: 'area3',
                    },
                ]

            }
        },
        mounted(){
        },
        methods:{

        }
    }
</script>

<style scoped>

</style>

