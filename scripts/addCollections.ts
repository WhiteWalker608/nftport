import { fetchNFTsFromContract } from "../src/indexer/index"
import { connectToDatabase } from "../src/services/database"

const collections = require('../collections.json')


connectToDatabase()
.then(async () => {
    for(const address of collections) {
        await fetchNFTsFromContract(address, "ethereum");
    }
})