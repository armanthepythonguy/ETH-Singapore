const mongoose = require("mongoose")

const ModelSchema = new mongoose.Schema({
    _id: String,
    chain: String,
    asset: String,
    deployer: String,
    accuracy: Number
})
const modelSchema = mongoose.model("Model", ModelSchema)

const VaultSchema = new mongoose.Schema({
    _id: String,
    chain: String,
    user: String,
    mlModels: [String],
    weightage: [Number],
    amount: String
})

const vaultSchema = mongoose.model("Vault", VaultSchema)

module.exports = {
    modelSchema,
    vaultSchema
}