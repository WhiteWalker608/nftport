import { ObjectId } from "mongodb";

export default class Nft{
    constructor(public name: string, public contractAddress: string, public metadata: string, public id?: ObjectId) {}
}