import axios from "axios";
import fs from "fs";

const subgraphs = [
  "C2zniPn45RnLDGzVeGZCx2Sw3GXrbc9gL4ZfL8B8Em2j",
  "JCNWRypm7FYwV8fx5HhzZPSFaMxgkPuw4TnR3Gpi81zk",
  "AwoxEZbiWLvv6e3QdvdMZw4WDURdGbvPfHmZRc8Dpfz9",
  "4TbqVA8p2DoBd5qDbPMwmDZv3CsJjWtxo8nVSqF2tA9a",
];

async function getLiquidations(i) {
  const URL = `https://gateway-arbitrum.network.thegraph.com/api/93e42fe0e5c0851890daed9b381a9906/subgraphs/id/${i}`;
  const query = `
        query($start_time: Int){
            positions(first:1000, orderBy: timestampOpened, orderDirection: asc, where:{timestampOpened_gt: $start_time}){
    account{
      id
    }
    market{
      id
      name
      protocol{
        name
    }
    }
    blockNumberOpened
    timestampOpened
    blockNumberClosed
    timestampClosed
    side
    asset{
      symbol
      decimals
      lastPriceUSD
      _iavsTokenType
    }
    balance
    principal
    isCollateral
    isIsolated
    snapshots{
      balance
      principal
      balanceUSD
    }
  }
        }
    `;

  let start_time = 0;
  let hisoricalData = [];
  let counter = 1;
  while (start_time != -1) {
    let data = await axios.post(URL, {
      query: query,
      variables: {
        start_time: start_time,
      },
    });
    data = data.data.data;
    hisoricalData = [...hisoricalData, ...data.positions];
    start_time =
      data.positions.length != 0
        ? parseInt(data.positions[data.positions.length - 1].timestampOpened)
        : -1;
    console.log(`Pooled data round no :- ${counter++}`);
  }
  fs.writeFile(
    `./${hisoricalData[0].market.protocol.name}.json`,
    JSON.stringify(hisoricalData, null, 2),
    (err) => {}
  );
  console.log(`${hisoricalData[0].market.protocol.name} fetched ...`);
}

for (let subgraph of subgraphs) {
  const markets = await getLiquidations(subgraph);
}
