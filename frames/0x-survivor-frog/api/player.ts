export type Player = {
    fid: BigInt;
    addresses: Array<string>;
    isRemoved: boolean;
    currentVotedPlayerToRemove: BigInt;
}