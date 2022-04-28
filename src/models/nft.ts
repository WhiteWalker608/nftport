import { ObjectId } from "mongodb";

/**
 * Nft
 */
export default class Nft{

    /**
     * Creates an instance of nft.
     * @param name name of the contract
     * @param contract_address contract Address
     * @param token_id 
     * @param chain 
     * @param metadata 
     * @param metadata_url 
     * @param file_url 
     * @param cached_file_url 
     * @param mint_date 
     * @param file_information 
     * @param updated_date 
     * @param [id] 
     */
    constructor(
        public name: string,
        public contract_address: string,
        public token_id: string,
        public chain: string,
        public metadata: Object,
        public metadata_url: string,
        public file_url: string,
        public cached_file_url: string,
        public mint_date: string,
        public file_information: Object,
        public updated_date: string,
        public id?: ObjectId) {}
}