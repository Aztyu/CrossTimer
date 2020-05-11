<script>
	import Timer from './Timer.svelte';
	import Display from './Display.svelte';
	
	/* Initialize data */
	let time = 0;
	let name = '';
	let color = '';
	let rounds = 1;
	let timers = [
		{ id: 1, time: 0, name: 'Work', color: 'yellow' },
		{ id: 2, time: 0, name: 'Rest', color: 'blue' }
	];

	// Time before timer start in seconds
	const preparationTime = 10;

	var beepLong = new Audio('sound/beeplong.mp3');
	var beepCourt = new Audio('sound/beepcourt.mp3');

	/* Internal values */
	let nextId = 3; //keep track of timers
	let currentTimeIdx = 0;
	let currentRound = 1;
	let stop = false;
	let colors = ['blue', 'yellow', 'green'];

	/* Business logic */
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
		color = timers[idx].color;
		setTimeout(timer, 1000);
	}

	function nextRandomColor() {
		// TODO better color managing
		return colors[Math.floor(Math.random() * colors.length)];
	}

	function closeFullscreen() {
        if (document.fullscreenElement === null) {
            return;
        }

        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

	/* Event handler */

	// Update array with data from component
	function handleUpdate(event) {
		const timeData = event.detail;
		
		const timer = timers.filter(obj => {
			return obj.id === timeData.id
		});
		timer[0].time = timeData.time;
		timer[0].name = timeData.name;
	}

	// react to action in Display componenent
	function handleTimer(event) {
		const timerData = event.detail;
		
		// Manage button actions from Display
		switch(event.detail.action) {
			case 'start':
				currentRound = 1;
				currentTimeIdx = -1;
				time = preparationTime;
				name = 'Get ready';
				color = 'green';
				setTimeout(timer, 1000);
				break;
			case 'resume':
				stop = false;
				setTimeout(timer, 1000);
				break;
			case 'stop':
				stop = true;
				break;
			case 'reset':
				time = 0;
				stop = false;
				closeFullscreen();
				break;
		}
	}

	/* Button action */
	function addTime() {
		timers = [...timers, {id: nextId++, time: 0, color: nextRandomColor()}]
	}
</script>

<main>
	{#if time === 0 }
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
	{/if}

	<Display
		time={time}
		name={name}
		color={color}
		currentRound={currentRound}
		rounds={rounds}
		stop={stop}
		on:timer={handleTimer}
	/>
</main>

<style>
	main {
		text-align: center;
		max-width: 240px;
		display: flex;
    	flex-direction: column;
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