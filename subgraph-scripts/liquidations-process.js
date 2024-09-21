import fs from "fs";

async function postFetch(dir) {
  fs.readFile(dir, function (err, content) {
    const data = JSON.parse(content);
    const header = [];
    for (let key in data[0]) {
      if (typeof data[0][key] != typeof {}) {
        header.push(key);
      } else {
        for (let innerKey in data[0][key]) {
          header.push(key + "-" + innerKey);
        }
      }
    }
    let csvstr = header.join(",") + "\n";
    for (let i of data) {
      csvstr +=
        i.amountUSD +
        "," +
        i.asset.name +
        "," +
        i.asset.symbol +
        "," +
        i.blockNumber +
        "," +
        i.id +
        "," +
        i.liquidatee.id +
        "," +
        i.liquidator.id +
        "," +
        i.market.id +
        "," +
        i.market.name +
        "," +
        i.market.protocol.name +
        "," +
        i.profitUSD +
        "," +
        i.timestamp +
        "\n";
    }
    fs.writeFile(
      `./liquidations/${data[0].market.protocol.name}.csv`,
      csvstr,
      (err) => {}
    );
    // console.log(header)
  });
}

if (!fs.existsSync("./liquidations")) {
  fs.mkdirSync("./liquidations");
}

const dir = ["Compound v2", "Compound III", "Aave v2", "Aave v3"];
for (let i of dir) {
  await postFetch(`${i}.json`);
}
