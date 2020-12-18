
const csv = require('csvtojson');
const { parse } = require('json2csv');

const FILES = ['homeless', 'room-all']

const DATA_PATH = __dirname + '/data/'

const cook1 = () => {

  FILES.forEach(filename => {
    const csvFilePath = DATA_PATH + `${filename}.csv`;
    csv()
      .fromFile(csvFilePath)
      .then((jsonObj) => {
        console.table(jsonObj);
        let rs;
        if (filename == 'homeless') {
          rs = jsonObj.map((d) => {
            return {
              zh: d['幢号'],
              fh: d['房号'],
              mj: d['面积（m²）'],
            }
          })

        } else {

          rs = jsonObj.map((d) => {
            return {
              ld: d['楼栋'],
              fh: d['房号'],
              tnmj: d['套内面积'].replace(' ㎡', ''),
              jzmj: d['建筑面积'].replace(' ㎡', ''),
              ce: d['所在层'],
              yt: d['规划用途'],
              zj: d['备案总价'],
              hx: d['户型'],
              zt: d['销售状态'],
            }
          })
        }

        require('fs').writeFileSync(DATA_PATH + `${filename}.json`, JSON.stringify(rs, null, 2))
      });
  });

}

const cook2 = () => {

  const homeList = require('./data/homeless.json');
  const roomList = require('./data/room-all.json').sort((a, b) => a.ld.localeCompare(b.ld));

  roomList.forEach((d) => {

    d.zh = d.ld.match(new RegExp('^春月金沙府([0-9]+)幢'))[1] + '幢'
    d.isHomeless = homeList.findIndex((h) => {
      return h.zh == d.zh && h.fh == d.fh;
    }) > -1;
    d.jjtn = Math.round(d.zj / d.tnmj).toFixed(0)
    d.jjjz = Math.round(d.zj / d.jzmj).toFixed(0)

  })

  // console.table(roomList)
  console.log("homeless : " + roomList.filter(r => r.isHomeless).length)
  console.log("total    : " + roomList.length)
  return roomList;
}

const cook3 = () => {
  const myData = cook2().map((d) => {
    return {
      "楼栋": d.ld,
      "房号": d.fh,
      "幢号": d.zh ,
      "套内面积": d.tnmj,
      "建筑面积": d.jzmj,
      "楼层": d.ce + '层',
      "用途": d.yt,
      "总价": d.zj,
      "户型": d.hx,
      "销售状态": d.zt,
      "均价套内": d.jjtn,
      "均价建筑": d.jjjz,
      "无房户": d.isHomeless ? '是' : '否',
      isHomeless: d.isHomeless,
    }
  });

  // console.table(myData)
  return myData;
}

const writeCSV = (myData) => {

  const fields = Object.keys(myData[0]);
  const opts = { fields };

  let csvContent
  try {
    csvContent = parse(myData, opts);
    // console.log(csv);
  } catch (err) {
    console.error(err);
  }
  require('fs').writeFileSync(DATA_PATH + `result.csv`, csvContent)
}
// cook1()
// cook2()

myData = cook3()

require('fs').writeFileSync(DATA_PATH + `result.json`, JSON.stringify(myData))
writeCSV(myData)
