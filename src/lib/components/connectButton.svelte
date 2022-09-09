<script>
	import { ethers, utils } from 'ethers';
	import { recoverAddress, arrayify, hashMessage, verifyTypedData } from 'ethers/lib/utils';
	import { defaultEvmStores, connected, provider, chainId, chainData, signer, signerAddress, contracts } from 'svelte-ethers-store';

	// WEB3-ONBOARD
	import Onboard from '@web3-onboard/core';
	import injectedModule from '@web3-onboard/injected-wallets';
	import walletConnectModule from '@web3-onboard/walletconnect';
	import { onMount } from 'svelte';

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

	let state = onboard.state.select();

	// SET PROVIDER IF ALREADY CONNECTED AT COMPONENT LOAD
	if (onboard.state.get().wallets.length === 1) {
		const instance = await onboard.state.get().wallets[0].provider;
		defaultEvmStores.setProvider(instance);
	}

	const connect = async () => {
		const instance = await onboard.connectWallet();
		console.log('INSTANCE BEFORE:', instance);
		if (instance.length === 1) defaultEvmStores.setProvider(instance[0].provider);
		console.log('INSTANCE AFTER:', instance);
	};

	const disconnect = async () => {
		const [primaryWallet] = await onboard.state.get().wallets;
		await onboard.disconnectWallet({ label: primaryWallet.label });
		defaultEvmStores.disconnect();

		// remove from localstorage
		window.localStorage.removeItem('connectedWallets');
	};

	// const getShieldBalance = async () => {
	// 	const balance = await $contracts.SHIELD.balanceOf($signerAddress);

	// 	console.log(balance / 10 ** 9);
	// 	return balance / 10 ** 9;
	// };

	$: console.log('PROVIDER:', defaultEvmStores);
	$: console.log('CONNECTED:', $connected);
	$: console.log('STATE:', state);
</script>

<div class="mx-4 flex h-10 items-center justify-center">
	{#if !$connected}
		<button
			class="h-full rounded-2xl border-2 border-solid border-transparent bg-blue-100 py-1 px-4 font-RedHatMono text-sm font-semibold transition-all
			ease-out hover:border-blue-200"
			on:click={connect}>
			Connect Wallet</button>
	{:else}
		<button
			class="h-full rounded-2xl border-2 border-solid border-transparent bg-blue-100 py-1 px-4 font-RedHatMono text-sm font-semibold transition-all
			ease-out hover:border-blue-200"
			on:click={disconnect}>
			Disconnect Wallet</button>
	{/if}
</div>
