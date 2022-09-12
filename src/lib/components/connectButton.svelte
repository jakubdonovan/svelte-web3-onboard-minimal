<script>
	import 'iconify-icon';
	import { Menu, MenuButton, MenuItems, MenuItem, Transition } from '@rgossiaux/svelte-headlessui';
	import { ethStore, shieldStore } from '$lib/stores/balances';
	import { connected, signerAddress } from 'svelte-ethers-store';
	import { connect, disconnect } from '$lib/web3';
</script>

<div class="mx-4 flex h-10 items-center justify-center">
	<div class="relative flex justify-center sm:justify-end md:border rounded-md">
		{#if !$connected}
			<button
				id="connectButton"
				class="tooltip tooltip-left flex items-center justify-center gap-1 md:hover:bg-gray-700 p-2 md:px-2 md:py-1"
				data-tip="Connect Wallet"
				on:click={connect}>
				<iconify-icon icon="mingcute:wallet-3-line" height="29px" class="text-gray-100" />

				<div class="hidden md:flex md:flex-col md:items-start">
					<span class="text-red-600 text-[10px] font-bold leading-3">Not Connected</span>
					<span class="text-gray-100 leading-4">Connect Wallet</span>
				</div>
			</button>
		{:else}
			<Menu class={'relative'}>
				<MenuButton class={`flex items-center px-2 py-1 gap-1 rounded-lg`}>
					<div class="hidden md:flex md:flex-col md:items-start">
						<span class="text-green-600 text-[10px] font-bold leading-3">Connected</span>
						<span class="text-gray-100 leading-4">
							{$signerAddress.slice(0, 5)}…{$signerAddress.slice($signerAddress.length - 4, $signerAddress.length)}
						</span>
					</div>

					<iconify-icon icon="mingcute:wallet-3-line" height="29px" class="flex md:hidden text-gray-700" />
					<iconify-icon icon="heroicons:chevron-down-20-solid" height={'24px'} class="hidden md:flex text-gray-500" />
				</MenuButton>

				<Transition
					enter="transition duration-100 ease-out"
					enterFrom="transform scale-95 opacity-0"
					enterTo="transform scale-100 opacity-100"
					leave="transition duration-75 ease-out"
					leaveFrom="transform scale-100 opacity-100"
					leaveTo="transform scale-95 opacity-0">
					<MenuItems
						class={'absolute right-0 flex flex-col w-max mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'}>
						<MenuItem disabled class={'p-1 cursor-default'}>
							<span class="text-gray-900 group flex rounded-md items-center w-full px-2 py-2 text-sm"
								>Balance: {Math.trunc($shieldStore)} SHIELD</span>
						</MenuItem>
						<MenuItem let:active class={'p-1'}>
							<button
								on:click={disconnect}
								class:bg-gray-100={active}
								class="text-gray-900 group flex rounded-md items-center w-full px-2 py-2 text-sm">Disconnect</button>
						</MenuItem>
					</MenuItems>
				</Transition>
			</Menu>
		{/if}
	</div>
</div>
