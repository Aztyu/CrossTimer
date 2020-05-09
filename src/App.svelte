<script>
	import Timer from './Timer.svelte';

	export let counter;

	let minutes = 0;
	let seconds = 0;
	let time = 0;

	var beepLong = new Audio('sound/beeplong.mp3');
	var beepCourt = new Audio('sound/beepcourt.mp3');

	let timers = [
		{ id: 1, time: 0 }
	];

	var timer = function() {
		console.log('1sec passée');
		time = time - 1;
		if (time > 0) {
			setTimeout(timer, 1000);
			if (time < 4) {
				beepCourt.play();
			}
		} else {
			beepLong.play();
		}
	};

	function startTimer() {
		console.log(timers);
		time = timers[0].time;
		setTimeout(timer, 1000);
	}

	function handleUpdate(event) {
		const timeData = event.detail;
		
		const timer = timers.filter(obj => {
			return obj.id === timeData.id
		});
		timer[0].time = timeData.time;
	}
</script>

<main>
	<h1>Timer</h1>
	
	{#each timers as time}
		<Timer id={time.id} on:update={handleUpdate}/>
	{/each}

	<p>
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