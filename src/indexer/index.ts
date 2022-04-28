import axios from "axios";
import * as dotenv from "dotenv";
import { allowedNodeEnvironmentFlags } from "process";
import config = require('../config/config.json')
import { ObjectId } from "mongodb";
import { collections } from "../services/database";
import Nft from "../models/nft";

dotenv.config();

/**
 * Process a single nft
 * @description insert or updates(if already exists) the given nft into the database
 * @param name name of the contract
 * @param nft nft data
 */
async function processNFT(name: string, nft: any) {
    const nftObj = nft as Nft;
    nftObj.name = name;
    try {
        let result;

        // first check if the nft already exists in the database 
        const query = {token_id: nftObj.token_id}
        const existingNft = (await collections[nftObj.chain].findOne(query)) as Nft;
        if(existingNft) { // if exists, then update
            console.log("NFT Already present. updating")
            const updateQuery = {_id: existingNft.id}
            result = await collections[nftObj.chain].updateOne(query, { $set: nftObj});
        } else { // else insert
            result = await collections[nftObj.chain].insertOne(nftObj);
        }
        result 
        ? console.log(`susscessfully inserted nft with id ${nftObj.token_id}`)
        : console.log(`error in inserting nft ${name}`); 
    } catch (error){
        console.log(`error in processing nft ${name} ${error}`);
    }

}
/**
 * Fetchs nfts from contract
 * @description fetches the nft from the nftPortApi and insert them in the database. Support querying for single page and multiple pages
 * @param contractAddress 
 * @param chain 
 * @param [pageNumber] 
 * @param [singlePage] 
 * @returns  
 */
export async function fetchNFTsFromContract(contractAddress: string, chain: string, pageNumber: number = 1, singlePage: boolean = false) {
    const res = await axios.get(config.NftFetchApi + contractAddress, {
        headers: {
            'Authorization': process.env.NFTPORT_AUTH_KEY,
            'Content-Type': 'application/json'
        },
        params:{
            'chain': chain,
            'include': 'all',
        }
    });
    if(res.status != 200){
        console.log(`non 200 status ${res.status}`);
        return Promise.reject("failure");
    } else {
        if(res.data && res.data.nfts && res.data.nfts.length > 0) {
            for(const nft of res.data.nfts) {
                await processNFT(res.data.contract.name, nft);
            }

            // if more nfts are there then call recusrively
            if(!singlePage && (res.data.total > (config.pageSize * (pageNumber - 1) + res.data.nfts.length))) {
                await fetchNFTsFromContract(contractAddress, chain, pageNumber+1);
                return Promise.resolve("sucess");
            } else {
                return Promise.resolve("success");
            }
        } else {
            return Promise.reject("failure");
        }
    }
}

/**
 * Finds nfts with name
 * @param name 
 * @param chain 
 * @returns  
 */
export async function findNftsWithName(name: string, chain: string) {
    const query = {name: name};
    const nfts = (await collections[chain].find(query).toArray()) as Nft[];
    return nfts;
}

/**
 * Finds nfts with contract address
 * @param contractAddress 
 * @param chain 
 * @returns  
 */
export async function findNftsWithContractAddress(contractAddress: string, chain: string) {
    const query = {contract_address: contractAddress};
    const nfts = (await collections[chain].find(query).toArray()) as Nft[];
    return nfts;
}


/**
 * Finds nfts with contract address and token id
 * @param contractAddress 
 * @param tokenId 
 * @param chain 
 * @returns  
 */
export async function findNftsWithContractAddressAndTokenId(contractAddress: string, tokenId: string, chain: string) {
    const query = {contract_address: contractAddress, token_id: tokenId};
    const nfts = (await collections[chain].findOne(query)) as Nft;
    return nfts;
}