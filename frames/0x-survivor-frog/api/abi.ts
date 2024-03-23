export const abi = [
	{
		name: "getUserPlayableGames",
		type: "function",
		stateMutability: "view",
		inputs: [{ name: "owner", type: "address" }],
		outputs: [{ name: "balance", type: "uint256" }],
	},
	// {
	//   name: 'balanceOf',
	//   type: 'function',
	//   stateMutability: 'view',
	//   inputs: [
	//     { name: 'owner', type: 'address' },
	//     { name: 'collectionId', type: 'uint256' },
	//   ],
	//   outputs: [{ name: 'balance', type: 'uint256' }],
	// },
	// {
	//   name: 'tokenURI',
	//   type: 'function',
	//   stateMutability: 'pure',
	//   inputs: [{ name: 'id', type: 'uint256' }],
	//   outputs: [{ name: 'uri', type: 'string' }],
	// },
	// {
	//   name: 'getUserPlayableGames',
	//   type: 'function',
	//   stateMutability: 'nonpayable',
	//   inputs: [
	//     { name: 'from', type: 'address' },
	//     { name: 'to', type: 'address' },
	//     { name: 'tokenId', type: 'uint256' },
	//   ],
	//   outputs: [],
	// },
] as const;

export const abiGetUserGames = 	{
  type: "function",
  name: "getUserGames",
  inputs: [],
  outputs: [{ name: "", type: "uint256[]", internalType: "uint256[]" }],
  stateMutability: "view",
};

export const abiGetUserGamesInput = 	{
	"type": "function",
	"name": "getUserGames",
	"inputs": [
	  {
		"name": "userAddr",
		"type": "address",
		"internalType": "address"
	  }
	],
	"outputs": [
	  {
		"name": "",
		"type": "uint256[]",
		"internalType": "uint256[]"
	  }
	],
	"stateMutability": "view"
  };

export const abiNewGame = 		{
  type: "function",
  name: "newGame",
  inputs: [],
  outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
  stateMutability: "nonpayable",
}

export const abiGamesContract = [
	{ type: "constructor", inputs: [], stateMutability: "nonpayable" },
	{
		type: "function",
		name: "getUserGames",
		inputs: [],
		outputs: [{ name: "", type: "uint256[]", internalType: "uint256[]" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "newGame",
		inputs: [],
		outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "nextGameId",
		inputs: [],
		outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "playerAddressToGamesMapping",
		inputs: [
			{ name: "", type: "address", internalType: "address" },
			{ name: "", type: "uint256", internalType: "uint256" },
		],
		outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
		stateMutability: "view",
	},
] as const;
