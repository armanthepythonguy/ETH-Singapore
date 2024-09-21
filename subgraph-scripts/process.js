import fs from "fs";

async function postFetch(dir) {
  fs.readdir(dir + "/", function (err, filenames) {
    filenames.forEach((filename) => {
      console.log(filename);
      if (!filename.includes(".csv")) {
        fs.readFile(dir + "/" + filename, "utf-8", function (err, content) {
          const data = JSON.parse(content);
          const header = [];
          for (let key in data[0]) {
            if (typeof data[0][key] != typeof {}) {
              header.push(key);
            } else if (key != "rates") {
              for (let innerKey in data[0][key]) {
                header.push(innerKey);
              }
            }
          }
          let csvstr = header.join(",") + ",lenderRate," + "borrowRate" + "\n";
          for (let i of data) {
            let borrowRate = i.rates.filter(
              (rate, index) => rate.side === "BORROWER"
            );
            borrowRate = borrowRate.length != 0 ? borrowRate[0].rate : null;
            let supplyRate = i.rates.filter((rate) => rate.side === "LENDER");
            supplyRate = supplyRate.length != 0 ? supplyRate[0].rate : null;
            csvstr +=
              i.blockNumber +
              "," +
              i.hourlyBorrowUSD +
              "," +
              i.hourlyDepositUSD +
              "," +
              i.hourlyRepayUSD +
              "," +
              i.hourlyWithdrawUSD +
              "," +
              i.market.id +
              "," +
              i.market.inputToken.symbol +
              "," +
              i.market.name +
              "," +
              i.market.protocol.name +
              "," +
              i.timestamp +
              "," +
              i.totalBorrowBalanceUSD +
              "," +
              i.totalDepositBalanceUSD +
              "," +
              i.totalValueLockedUSD +
              "," +
              supplyRate +
              "," +
              borrowRate +
              "\n";
          }
          fs.writeFile(`./data/${dir}/${filename}.csv`, csvstr, (err) => {});
        });
      }
    });
  });
}

if (!fs.existsSync("./data")) {
  fs.mkdirSync("./data");
}

const dir = ["Compound v2", "Compound III", "Aave v2", "Aave v3"];
for (let i of dir) {
  if (!fs.existsSync(`./data/${i}`)) {
    fs.mkdirSync(`./data/${i}`);
  }
  await postFetch(i);
}
