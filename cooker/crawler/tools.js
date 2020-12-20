const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const getPage = async (page, project, pageNum = 1) => {
  await page.goto(project.urlTemp + pageNum);

  await page.waitForSelector('table > thead')
  // 楼栋	房号	套内面积	建筑面积	所在层	规划用途	备案总价(元)	户型	销售状态
  const thead = await page.$('table > thead  ');
  const header = await thead.$$eval('tr > th', (rows) => {
    return rows.map((col) => {
      return col.textContent.trim();
    })
  })
  // console.table(header)

  const tbody = await page.$('table > tbody  ');
  let pageData = await tbody.$$eval('tr', (rows) => {
    return rows.map((row) => {
      return Array.from(row.children).map((col, i) => {
        return col.textContent.trim()
      })
    })

  })

  pageData = pageData.map((d) => {
    return header.reduce((ret, h, idx) => {
      ret[h] = d[idx]
      return ret
    }, {})
  })
  // console.table(pageData)
  return pageData
}

const getAllPages = async (page, project) => {
  const persist = (project, data, pages) => {
    require('fs').writeFileSync(`${__dirname}/${project.name}.${pages}.json`, JSON.stringify(data, null, 2))
  }
  const cleanupFile = (project, pages) => {
    require('fs').unlinkSync(`${__dirname}/${project.name}.${pages}.json`)
  }
  const getPreData = (project) => {
    const preFile = `${__dirname}/${project.name}.${project.pageStart}.json`
    const fs = require('fs')
    if (fs.existsSync(preFile)) {
      return require(preFile)
    } else {
      return []
    }
  }

  let total = getPreData(project);
  for (let i = project.pageStart + 1; i <= project.pageEnd; i++) {
    console.log(`=====Total ${total.length} Page [${i}] begin====`)
    const pd = await getPage(page, project, i)
    total = total.concat(pd)
    persist(project, total, i)
    //cleanupPreviousFile
    i > 1 && cleanupFile(project, i - 1)
    console.log(`=====Total ${total.length} Page [${i}] end====`)
    await wait(1000);
  }
}

const mergeRs = (projectA, projectB) => {
  const roomAllName = `${__dirname}/${projectA.name}.${projectA.pageEnd}.json`
  const roomLessName = `${__dirname}/${projectB.name}.${projectB.pageEnd}.json`

  let roomAll = require(roomAllName).map((d) => {
    return {
      ld: d['楼栋'],
      fh: d['房号'],
      tnmj: d['套内面积'].replace(' ㎡', ''),
      jzmj: d['建筑面积'].replace(' ㎡', ''),
      ce: d['所在层'],
      yt: d['规划用途'],
      zj: d['备案总价(元)'],
      hx: d['户型'],
      zt: d['销售状态'],
    }
  })
  const roomLess = require(roomLessName).map((d) => {
    return {
      zh: d['幢号'],
      fh: d['房号'],
      mj: d['面积（m²）'],
    }
  })


  roomAll.forEach((d) => {
    const getZH = (s) => s.split('幢')[0].match(new RegExp('(\\d+)'))[0]
    d.zh = getZH(d.ld) + '幢'
    d.isRoomless = roomLess.findIndex((h) => {
      return h.zh == d.zh && h.fh == d.fh;
    }) > -1;
    d.jjtn = Math.round(d.zj / d.tnmj).toFixed(0)
    d.jjjz = Math.round(d.zj / d.jzmj).toFixed(0)
    d.dfl = parseInt(100 * d.tnmj / d.jzmj) + '%'

  })
  roomAll = roomAll.map((d) => {
    return {
      楼栋: d.ld,
      房号: d.fh,
      幢号: d.zh,
      套内面积: d.tnmj,
      建筑面积: d.jzmj,
      得房率: d.dfl,
      楼层: d.ce,
      用途: d.yt,
      总价: d.zj,
      户型: d.hx,
      销售状态: d.zt,
      均价套内: d.jjtn,
      均价建筑: d.jjjz,
      无房户: d.isRoomless ? '是' : '否',
      isRoomless: d.isRoomless,
    };
  });
  require('fs').writeFileSync(`${__dirname}/${projectA.name}.merged.json`, JSON.stringify(roomAll, null, 2))
  return roomAll;

}

module.exports = {
  wait,
  getPage,
  getAllPages,
  mergeRs
}
