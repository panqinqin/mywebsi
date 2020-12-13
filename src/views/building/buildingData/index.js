import build5_1 from "../buildingData/5-01";
import build5_2 from "../buildingData/5-02";
import build5_3 from "../buildingData/5-03";
import build5_4 from "../buildingData/5-04";
import build5_5 from "../buildingData/5-05";
import build6_1 from "../buildingData/6-01";
import build6_2 from "../buildingData/6-02";
import build6_3 from "../buildingData/6-03";
import build6_4 from "../buildingData/6-04";
import build6_5 from "../buildingData/6-05";

let list = [build5_1, build5_2, build5_3, build5_4, build5_5, build6_1, build6_2, build6_3, build6_4, build6_5];
let newLIST = [];
list.map((item, index) => {
    let key = "";
    switch (index) {
        case 0: {
            key = '字段1';
            break
        }
        case 1: {
            key = '字段4';
            break
        }
        case 2: {
            key = '字段7';
            break
        }
        case 3: {
            key = '字段10';
            break
        }
        case 4: {
            key = '字段13';
            break
        }
        case 5: {
            key = '字段1';
            break
        }
        case 6: {
            key = '字段4';
            break
        }
        case 7: {
            key = '字段7';
            break
        }
        case 8: {
            key = '字段10';
            break
        }
        case 9: {
            key = '字段13';
            break
        }

    }
    for (let i = 0; i < item.length; i++) {
        if(item[i].用途.indexOf("住宅") === -1){continue}
        let obj = {
            building: index < 5 ? "5栋" : "6栋",
            floor: item[i].字段,
            number: item[i][key],
            price: item[i].单价 ? item[i].单价 : item[i].价格,
            area1: item[i].建筑面积,
            area2: item[i].户内面积,
            area3: item[i].分摊面积,
        }
        if(!obj.price){continue}
        obj.allprice = parseInt(parseFloat(obj.price) * parseFloat(obj.area1));
        obj.shoufu = parseInt(obj.allprice*0.3);
        newLIST.push(obj)
    }
});
export default newLIST;

