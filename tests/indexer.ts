import { expect } from 'chai';
import { findNftsWithContractAddressAndTokenId, findNftsWithContractAddress, findNftsWithName, fetchNFTsFromContract } from "../src/indexer/index"
import { collections, connectToDatabase } from "../src/services/database"

describe('indexer tests', ()=> {
    beforeEach(async ()=> {
        await connectToDatabase();
        await collections.ethereum.deleteMany({});
    })
    it('check getting nfts from single Page', async ()=> {
        const message = await fetchNFTsFromContract("0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d","ethereum", 1, true);
        expect(message).to.equal("success");
    });

    it('check finding nfts with name', async() => {
        await fetchNFTsFromContract("0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d","ethereum", 1, true);
        const nfts = await findNftsWithName("BoredApeYachtClub", "ethereum");
        expect(nfts.length).to.equal(50);
    });

    it('check finding nfts with contractAdress',async () => {
        await fetchNFTsFromContract("0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d","ethereum", 1, true);
        const nfts = await findNftsWithContractAddress("0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d", "ethereum");
        expect(nfts.length).to.equal(50);
    });

    it('check finding nfts with contractAdress and tokenId',async () => {
        await fetchNFTsFromContract("0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d","ethereum", 1, true);
        const nfts = await findNftsWithContractAddressAndTokenId("0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d","1", "ethereum");
        expect(nfts.token_id).to.equal("1");
    });
});