<script>
	// ATTACH SHIELD CONTRACT TO CONTRACTS STORE
	const abi = [
		// Read-Only Functions
		'function balanceOf(address owner) view returns (uint256)',
		'function decimals() view returns (uint8)',
		'function symbol() view returns (string)',

		// Authenticated Functions
		'function transfer(address to, uint amount) returns (bool)',

		// Events
		'event Transfer(address indexed from, address indexed to, uint amount)'
	];
	defaultEvmStores.attachContract('SHIELD', '0x24861414c8845b8115397302e9dcfaab3f239826', abi);

	// RECONNECT FROM LOCALSTORAGE ON RELOAD
	const previouslyConnectedWallets = JSON.parse(window.localStorage.getItem('connectedWallets'));
	if (previouslyConnectedWallets) {
		await onboard.connectWallet({
			autoSelect: { label: previouslyConnectedWallets[0], disableModals: true }
		});
	}

	// SUBSCRIBE TO STATE CHANGES
	const { unsubscribe } = state.subscribe(async (update) => {
		// connected event
		if (update.wallets.length !== 0) {
			// add wallet to localstorage
			const connectedWallets = update.wallets.map(({ label }) => label);
			window.localStorage.setItem('connectedWallets', JSON.stringify(connectedWallets));
		}

		if (update.wallets.length === 0) {
			defaultEvmStores.disconnect();
		}

		// account changed event ??????
		// contract transaction filter event ??????
	});
</script>
