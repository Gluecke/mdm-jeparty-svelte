<script lang="ts">
	import { onMount } from 'svelte';

	let showSplash = $state(false);
	let showGif = $state(true);
	let showVideo = $state(false);
	let selectedImagePath = $state('');
	let selectedVideoPath = $state('');

	function getRandomFromRange(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	onMount(() => {
		const expire = new Date('2024-12-15T00:00:00');
		const today = new Date();

		if (today >= expire) {
			showSplash = false;
			return;
		}

		showSplash = true;

		const paths: string[] = ['hamfood.webp', 'turkhat.webp', 'turktrot.webp', 'wolfslice.webp'];
		const selectedIndex = getRandomFromRange(0, paths.length - 1);
		const selected = paths[selectedIndex];

		if (selected.endsWith('.gif') || selected.endsWith('.webp') || selected.endsWith('.jpg') || selected.endsWith('.jpeg')) {
			selectedImagePath = `/assets/images/${selected}`;
			showGif = true;
			showVideo = false;
		} else {
			selectedVideoPath = `/assets/video/${selected}`;
			showVideo = true;
			showGif = false;
		}

		setTimeout(() => {
			showSplash = false;
		}, 11000);
	});
</script>

{#if showSplash}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
		{#if showGif && selectedImagePath}
			<img src={selectedImagePath} alt="splash" class="max-h-screen max-w-screen object-contain" />
		{:else if showVideo && selectedVideoPath}
			<video src={selectedVideoPath} autoplay muted class="max-h-screen max-w-screen object-contain"></video>
		{/if}
	</div>
{/if}
