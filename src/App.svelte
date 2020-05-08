<script>
	export let counter;

	let minutes = 0;
	let seconds = 0;
	let time = 0;

	function startTimer() {
		time = +minutes * 60 + +seconds;
	}
</script>

<main>
	<h1>Timer</h1>
	<p>
		<input bind:value={minutes}/>
		<span>m </span>
		<input bind:value={seconds}/>
		<span>s </span>
		<button on:click={startTimer}>Start</button>
	</p>
	
	<p>
		{#if time > 0 }
			<span>Time left : {time}</span>
		{/if}
	</p>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>