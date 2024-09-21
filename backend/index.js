const express = require('express')
var cors = require('cors')
const { getConnection, getModelsByWallet, getModels, getVaultsByWallet, addVault, addModel } = require('./db/dbconnect')
const app = express()
app.use(cors())
app.use(express.json())
const port = 3001

app.get("/models", async(req, res) => {
    const models = await getModels();
    res.send(models);
})

app.get("/models/:wallet", async(req,res) => {
    const models = await getModelsByWallet(req.params.wallet);
    res.send(models);
})

app.get("/vaults/:wallet", async(req, res) => {
    const vaults = await getVaultsByWallet(req.params.wallet);
    res.send(vaults);
})

app.post("/vaults", async(req, res) => {
    await addVault(req.body.id, req.body.chain, req.body.user, req.body.models, req.body.weights, req.body.amount);
    res.send({"confirmation": true})
})

app.post("/models", async(req, res) => {
    await addModel(req.body.id,req.body.chain,req.body.asset,req.body.deployer,req.body.accuracy);
    res.send({"confirmation": true})
})

app.listen(port, async () => {
    await getConnection();
    console.log(`Backend listening on port ${port}`)
})