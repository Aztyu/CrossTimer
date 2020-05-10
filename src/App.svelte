<script>
	import Timer from './Timer.svelte';
	
	let time = 0;
	let name = '';
	let currentTimeIdx = 0;
	let currentRound = 1;
	let stop = false;

	let nextId = 3;

	var beepLong = new Audio('sound/beeplong.mp3');
	var beepCourt = new Audio('sound/beepcourt.mp3');

	let timers = [
		{ id: 1, time: 0, name: 'Work' },
		{ id: 2, time: 0, name: 'Rest' }
	];

	let rounds = 1;

	// Business logic
	var timer = function() {
		if (stop) {
			return;
		}
		time = time - 1;
		if (time > 0) {
			setTimeout(timer, 1000);
			if (time < 4) {
				beepCourt.play();
			}
		} else {
			beepLong.play();
			// End of timers
			if (++currentTimeIdx < timers.length) {
				launchTimer(currentTimeIdx);
			// Check if there are rounds left
			} else if (currentRound < rounds) {
				currentRound = ++currentRound;
				currentTimeIdx = 0;
				launchTimer(0);
			// End of the rounds and timers
			} else {
				setTimeout(function() { beepLong.play()}, 500);
			}
		}
	};

	function launchTimer(idx) {
		time = timers[idx].time;
		name = timers[idx].name;
		setTimeout(timer, 1000);
	}

	// Event handler 
	function handleUpdate(event) {
		const timeData = event.detail;
		
		const timer = timers.filter(obj => {
			return obj.id === timeData.id
		});
		timer[0].time = timeData.time;
		timer[0].name = timeData.name;
	}

	// Button action
	function addTime() {
		timers = [...timers, {id: nextId++, time: 0}]
	}

	function startTimer() {
		currentRound = 1;
		currentTimeIdx = 0;
		launchTimer(0);
	}

	function stopTimer() {
		stop = true;
	}

	function resumeTimer() {
		stop = false;
		setTimeout(timer, 1000);
	}

	function resetTimer() {
		stop = false;
		time = 0;
	}
</script>

<main>
	<div>
		<h1>Timer</h1>
		
		<p>
			<span>Rounds</span>
			<input bind:value={rounds} />
		</p>
		{#each timers as time}
			<span>
				<Timer id={time.id} name={time.name} on:update={handleUpdate}/>
			</span>
		{/each}
		<button on:click={addTime}>Add time</button>
	</div>

	<div>
		<p>
			{#if time === 0 }
				<button on:click={startTimer}>Start</button>
			{:else}
				{#if stop === true }
					<button on:click={resumeTimer}>Resume</button>
					<button on:click={resetTimer}>Reset</button>
				{:else}
					<button on:click={stopTimer}>Stop</button>
				{/if}
			{/if}
		</p>

		<p>
			{#if time > 0 }
				<p>Round {currentRound}/{rounds}</p>
				<p>{name}</p>
				<p>Time left : {time}</p>
			{/if}
		</p>
	</div>
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