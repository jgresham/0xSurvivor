export const abiGame = [
	{
		type: "constructor",
		inputs: [
			{ name: "_gameId", type: "uint256", internalType: "uint256" },
			{ name: "_fidGameCreator", type: "uint256", internalType: "uint256" },
			{
				name: "_players",
				type: "tuple[]",
				internalType: "struct Player[]",
				components: [
					{ name: "fid", type: "uint256", internalType: "uint256" },
					{ name: "addresses", type: "address[]", internalType: "address[]" },
					{ name: "isRemoved", type: "bool", internalType: "bool" },
					{
						name: "currentVotedPlayerToRemove",
						type: "uint256",
						internalType: "uint256",
					},
				],
			},
		],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "fidGameCreator",
		inputs: [],
		outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "fidWinner",
		inputs: [],
		outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "gameId",
		inputs: [],
		outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "getPlayers",
		inputs: [],
		outputs: [
			{
				name: "",
				type: "tuple[]",
				internalType: "struct Player[]",
				components: [
					{ name: "fid", type: "uint256", internalType: "uint256" },
					{ name: "addresses", type: "address[]", internalType: "address[]" },
					{ name: "isRemoved", type: "bool", internalType: "bool" },
					{
						name: "currentVotedPlayerToRemove",
						type: "uint256",
						internalType: "uint256",
					},
				],
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "isWinner",
		inputs: [],
		outputs: [{ name: "", type: "bool", internalType: "bool" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "players",
		inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
		outputs: [
			{ name: "fid", type: "uint256", internalType: "uint256" },
			{ name: "isRemoved", type: "bool", internalType: "bool" },
			{
				name: "currentVotedPlayerToRemove",
				type: "uint256",
				internalType: "uint256",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "voteToRemovePlayer",
		inputs: [
			{ name: "fidPlayerVoting", type: "uint256", internalType: "uint256" },
			{ name: "fidPlayerToRemove", type: "uint256", internalType: "uint256" },
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "event",
		name: "Log",
		inputs: [
			{
				name: "message",
				type: "string",
				indexed: false,
				internalType: "string",
			},
			{
				name: "value",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
		],
		anonymous: false,
	},
];

export const abiGetUserGamesInput = {
	type: "function",
	name: "getUserGames",
	inputs: [{ name: "userFid", type: "uint256", internalType: "uint256" }],
	outputs: [{ name: "", type: "uint256[]", internalType: "uint256[]" }],
	stateMutability: "view",
};

export const abiNewGame = {
	type: "function",
	name: "newGame",
	inputs: [
		{ name: "fidGameCreator", type: "uint256", internalType: "uint256" },
		{
			name: "_players",
			type: "tuple[]",
			internalType: "struct Player[]",
			components: [
				{ name: "fid", type: "uint256", internalType: "uint256" },
				{ name: "addresses", type: "address[]", internalType: "address[]" },
				{ name: "isRemoved", type: "bool", internalType: "bool" },
				{
					name: "currentVotedPlayerToRemove",
					type: "uint256",
					internalType: "uint256",
				},
			],
		},
	],
	outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
	stateMutability: "nonpayable",
};

export const abiGamesContract = [
	{ type: "constructor", inputs: [], stateMutability: "nonpayable" },
	{
		type: "function",
		name: "fidToGamesMapping",
		inputs: [
			{ name: "", type: "uint256", internalType: "uint256" },
			{ name: "", type: "uint256", internalType: "uint256" },
		],
		outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "gameIdToGameContract",
		inputs: [{ name: "gameId", type: "uint256", internalType: "uint256" }],
		outputs: [{ name: "", type: "address", internalType: "address" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "gameIdToGamesMapping",
		inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
		outputs: [{ name: "", type: "address", internalType: "address" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "getUserGames",
		inputs: [{ name: "userFid", type: "uint256", internalType: "uint256" }],
		outputs: [{ name: "", type: "uint256[]", internalType: "uint256[]" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "newGame",
		inputs: [
			{ name: "fidGameCreator", type: "uint256", internalType: "uint256" },
			{
				name: "_players",
				type: "tuple[]",
				internalType: "struct Player[]",
				components: [
					{ name: "fid", type: "uint256", internalType: "uint256" },
					{ name: "addresses", type: "address[]", internalType: "address[]" },
					{ name: "isRemoved", type: "bool", internalType: "bool" },
					{
						name: "currentVotedPlayerToRemove",
						type: "uint256",
						internalType: "uint256",
					},
				],
			},
		],
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
];
