import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import walletConnectModule from '@web3-onboard/walletconnect';
import { ethers } from 'ethers';
import { defaultEvmStores, connected, provider, chainId, chainData, signer, signerAddress, contracts } from 'svelte-ethers-store';
import { ethStore, shieldStore } from '$lib/stores/balances';
import abi from '$lib/abi.json';

const injected = injectedModule();
const walletConnect = walletConnectModule();

let onboard = Onboard({
	wallets: [injected, walletConnect],
	chains: [
		{
			id: '0x1',
			token: 'ETH',
			label: 'Ethereum Mainnet',
			rpcUrl: 'https://mainnet.infura.io/v3/0ef6bd5de679422084aab6bc04e10fcc'
		}
	],
	appMetadata: {
		name: 'Shield Protocol',
		icon: 'logo-icon-black.svg',
		logo: 'logo-black.svg',
		description: 'Research tokens smarter and faster.',
		recommendedInjectedWallets: [
			{ name: 'MetaMask', url: 'https://metamask.io' },
			{ name: 'WalletConnect', url: 'https://walletconnect.com/' }
		]
	},
	accountCenter: {
		desktop: {
			enabled: false,
			position: 'topRight'
		},
		mobile: {
			enabled: false,
			position: 'topRight'
		}
	},
	i18n: {
		en: {
			connect: {
				selectingWallet: {
					header: '',
					sidebar: {
						heading: '',
						subheading: 'Connect your wallet',
						paragraph: ''
					}
					// recommendedWalletsPart1: '',
					// recommendedWalletsPart2: ''
					// installWallet: ''
					// agreement: {
					// 	agree: '',
					// 	terms: '',
					// 	and: '',
					// 	privacy: ''
					// }
				}
			}
		}
	}
});

const walletsSubscription = onboard.state.select('wallets');
const { unsubscribe } = walletsSubscription.subscribe((wallets) => {
	const walletProvider = wallets[0]?.provider;
	if (walletProvider) {
		const provider = new ethers.providers.Web3Provider(walletProvider, 'any');
		defaultEvmStores.setProvider(provider);
		defaultEvmStores.attachContract('SHIELD', '0x24861414c8845b8115397302e9dcfaab3f239826', abi);
	}
	updateAlreadyConnectedWallets();
});

if (typeof window !== 'undefined') {
	const alreadyConnectedWallets = JSON.parse(window.sessionStorage.getItem('ConnectedWallets'));
	if (alreadyConnectedWallets && alreadyConnectedWallets.length > 0) {
		onboard
			.connectWallet({
				autoSelect: { label: alreadyConnectedWallets[0], disableModals: true }
			})
			.catch(console.error);
	}
}

export const connect = async () => {
	const wallets = await onboard.connectWallet();
};
export const disconnect = async () => {
	const connectedWallet = onboard.state.get().wallets[0];
	await onboard.disconnectWallet({ label: connectedWallet.label });
	await defaultEvmStores.disconnect();
};
function updateAlreadyConnectedWallets() {
	const connectedWalletsLabels = onboard.state.get().wallets.map(({ label }) => label);
	window.sessionStorage.setItem('ConnectedWallets', JSON.stringify(connectedWalletsLabels));
}
