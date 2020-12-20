const tools = require('./tools')

// .sort((a, b) => a.ld.localeCompare(b.ld));

const GS = [
  [
    {
      name: '春月金沙府',
      pageEnd: 37,
    },
    {
      name: '春月金沙府-无房户',
      pageEnd: 19,
    },
  ],
  [
    {
      name: '江逸源境府',
      pageEnd: 59,
    },
    {
      name: '江逸源境府-无房户',
      pageEnd: 30,
    },
  ],
  [
    {
      name: '春熙潮鸣府',
      pageEnd: 56,
    },
    {
      name: '春熙潮鸣府-无房户',
      pageEnd: 0,
    },
  ],
]

GS.forEach((G)=>{
  tools.mergeRs(G[0], G[1])
})

