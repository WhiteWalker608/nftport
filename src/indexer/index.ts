import axios from "axios";
import { allowedNodeEnvironmentFlags } from "process";

import config = require('../config/config.json')

async function fetchNFTsFromContract(contractAddress: string, chain: string) {
    const res = await axios.get(config.NftFetchApi, {
        headers: {
            'Authorization': config.AuthorizationKey,
            'Content-Type': 'application/json'
        },
        params:{
            'chain': chain,
            'include': 'all',
        }
    })

    
}