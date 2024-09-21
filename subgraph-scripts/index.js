import axios from "axios";
import fs from "fs";

const subgraphs = [
  "C2zniPn45RnLDGzVeGZCx2Sw3GXrbc9gL4ZfL8B8Em2j",
  "JCNWRypm7FYwV8fx5HhzZPSFaMxgkPuw4TnR3Gpi81zk",
  "AwoxEZbiWLvv6e3QdvdMZw4WDURdGbvPfHmZRc8Dpfz9",
  "4TbqVA8p2DoBd5qDbPMwmDZv3CsJjWtxo8nVSqF2tA9a",
];

async function getMarkets(URL) {
  const getMarketsQuery = `
        {
            lendingProtocols(first:100){
                markets{
                    id
                    createdTimestamp
                }
            }
        }
    `;
  const data = await axios.post(URL, { query: getMarketsQuery });
  return data.data.data.lendingProtocols[0].markets;
}

async function fetchHistoricalData(URL, marketData) {
  const query = `
        query($market_id: String, $entities: Int, $start_time: Int){
            marketHourlySnapshots(first:$entities, orderBy: timestamp, orderDirection: asc, where:{timestamp_gt: $start_time, market_:{id: $market_id}}){
                blockNumber
                timestamp
                market{
                id
                name
                inputToken{
                    symbol
                }
                protocol{
                    name
                }         
                }
                rates{
                rate
                side
                }
                totalValueLockedUSD
                totalBorrowBalanceUSD
                totalDepositBalanceUSD
                hourlyBorrowUSD
                hourlyDepositUSD
                hourlyWithdrawUSD
                hourlyRepayUSD
            }
        }
    `;
  let start_time = 0;
  let hisoricalData = [];
  while (start_time != -1) {
    let data = await axios.post(URL, {
      query: query,
      variables: {
        market_id: marketData.id,
        entities: 1000,
        start_time: start_time,
      },
    });
    data = data.data.data;
    hisoricalData = [...hisoricalData, ...data.marketHourlySnapshots];
    start_time =
      data.marketHourlySnapshots.length != 0
        ? parseInt(
            data.marketHourlySnapshots[data.marketHourlySnapshots.length - 1]
              .timestamp
          )
        : -1;
  }
  try {
    if (!fs.existsSync(hisoricalData[0].market.protocol.name)) {
      fs.mkdirSync(hisoricalData[0].market.protocol.name);
    }
    fs.writeFile(
      `./${hisoricalData[0].market.protocol.name}/${hisoricalData[0].market.name}-${hisoricalData[0].market.id}.json`,
      JSON.stringify(hisoricalData, null, 2),
      (err) => {}
    );
    console.log(`${hisoricalData[0].market.name} fetched ...`);
  } catch (error) {
    console.log("Error :- ", error);
  }
}

for (let subgraph of subgraphs) {
  const URL = `https://gateway.thegraph.com/api/93e42fe0e5c0851890daed9b381a9906/subgraphs/id/${subgraph}`;
  const markets = await getMarkets(URL);
  for (let i of markets) {
    await fetchHistoricalData(URL, i);
  }
}
