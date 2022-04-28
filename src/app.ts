import express from 'express';
import { collections, connectToDatabase } from "./services/database"
import Nft from "./models/nft";
import { findNftsWithContractAddressAndTokenId, findNftsWithContractAddress, findNftsWithName, fetchNFTsFromContract } from "./indexer/index"
const app = express();
const port = 3000;


/**
 * Gets nfts from name
 * @param req 
 * @param res 
 */
async function getNftsFromName(req, res) {
    if(req.query.name && req.query.chain) {
        try{
            const nfts = await findNftsWithName(req.query.name, req.query.chain);
            res.status(200).send(nfts);
        } catch (error){
            res.status(500).send(error);
        }
    } else{
        res.sendStatus(404);
    }
}

/**
 * Gets nfts from contract address
 * @param req 
 * @param res 
 */
async function getNftsFromContractAddress(req, res) {
    if(req.query.contractAddress && req.query.chain) {
        try{
            
            if(req.query.tokenId) {
                const singleNft = await findNftsWithContractAddressAndTokenId(req.query.contractAddress, req.query.tokenId, req.query.chain);
                res.status(200).send(singleNft);
            } else {
                const nfts = await findNftsWithContractAddress(req.query.contractAddress, req.query.chain);
                res.status(200).send(nfts);
            }
        } catch (error){
            res.status(500).send(error);
        }
    } else{
        res.sendStatus(404);
    }
}

/**
 * Adds collection
 * @param req 
 * @param res 
 */
async function addCollection(req, res) {
//console.log("req: ", req);
    if(!isAuthorized(req.query.key as string)) {
        res.sendStatus(400);
    }
    else if(req.query.contractAddress && req.query.chain) {
        try{
            res.status(200).send("fetching started");
            await fetchNFTsFromContract(req.query.contractAddress as string, req.query.chain as string);
        } catch(error){
            res.status(500).send(error);
        }
    } else{
        res.sendStatus(400);
    }
}


connectToDatabase()
.then(()=>{
    app.get('/name', getNftsFromName);
    
    app.get('/contractAddress', getNftsFromContractAddress);
    
    app.get('/addCollection', addCollection);

    app.listen(port, () => {
        return console.log(`Express is listening at http://localhost:${port}`);
      });
}).catch((error:Error)=> {
    console.error("Database connection failed", error);
    process.exit();
});


/**
 * Determines whether authorized is
 * @param key 
 * @returns authorized 
 */
function isAuthorized(key: string): Boolean {
    return true;
}