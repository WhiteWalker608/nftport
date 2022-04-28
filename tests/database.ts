import { expect } from 'chai';
import { collections, connectToDatabase } from "../src/services/database"

describe('database tests', ()=> {

    beforeEach(async ()=> {
        await connectToDatabase();
    })
    it('check connection', async() => {
        expect(collections.ethereum ? true: false).to.be.true;
    });
});