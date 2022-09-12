import { derived } from 'svelte/store';
import { ethers } from 'ethers';
import { provider, signer, signerAddress, contracts } from 'svelte-ethers-store';

export const ethStore = derived(signer, ($signer, set) => {
	if (!$signer) {
		return set(0);
	}

	(async () => {
		const rawBalance = await $signer.getBalance();
		const formattedBalance = ethers.utils.formatEther(rawBalance);
		set(formattedBalance);
	})();
});

export const shieldStore = derived([provider, signerAddress, contracts], ([$provider, $signerAddress, $contracts], set) => {
	if (!$provider || !$contracts || !$signerAddress) return set(0);

	provider.subscribe(async (provider) => {
		if (!provider) return;

		provider.on('block', async (_block) => {
			if ($contracts) {
				const balance = await $contracts.SHIELD.balanceOf($signerAddress);
				set(balance / 10 ** 9);
			}
		});
	});
});
