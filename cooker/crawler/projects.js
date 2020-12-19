const tools = require('./tools')


const G1 = [
  {
    name: '江逸源境府',
    pageEnd: 59,
  },
  {
    name: '江逸源境府-无房户',
    pageEnd: 30,
  },
]
const G2 = [
  {
    name: '春月金沙府',
    pageEnd: 37,
  },
  {
    name: '春月金沙府-无房户',
    pageEnd: 19,
  },
]

// .sort((a, b) => a.ld.localeCompare(b.ld));

tools.mergeRs(G1[0], G1[1])
tools.mergeRs(G2[0], G2[1])
