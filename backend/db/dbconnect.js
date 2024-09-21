const mongoose = require("mongoose")
const { modelSchema, vaultSchema } = require("./schema")

async function getConnection(){
    await mongoose.connect("mongodb+srv://125015014:panda@cluster0.huwpscz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    console.log("DB connected succesfully !!!!")
}

async function getModels(){
    const models = await modelSchema.find()
    return models
}

async function getModelsByWallet(wallet){
    const query = modelSchema.where({
        deployer: wallet
    })
    const result = await query.find()
    return result;
}

async function getVaultsByWallet(wallet){
    const query = vaultSchema.where({
        user: wallet
    })
    const result = await query.find()
    return result;
}

async function addModel(id, chain, asset, deployer, accuracy){
    const newModel = new modelSchema({
        _id: id,
        deployer: deployer,
        asset: asset,
        chain: chain,
        accuracy: accuracy
    })
    await newModel.save()
}

async function addVault(id, chain, user, models, weights){
    const newVault = new vaultSchema({
        _id: id,
        chain: chain,
        user: user,
        mlModels: models,
        weights: weights
    })
    await newVault.save()
}

module.exports =  {
    getConnection,
    getModels,
    getModelsByWallet,
    getVaultsByWallet,
    addModel,
    addVault
}