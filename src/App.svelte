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
	let volume = (!!localStorage.getItem('volume')) ? localStorage.getItem('volume') : 100;
	var elem = document.documentElement;

	// Time before timer start in seconds
	const preparationTime = 10;

	var beepLong = new Audio('sound/beeplong.mp3');
	var beepCourt = new Audio('sound/beepcourt.mp3');
	beepLong.volume = volume/100;
	beepCourt.volume = volume/100;

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
				closeFullscreen();
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

	function openFullscreen() {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
            elem.msRequestFullscreen();
        }
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
				openFullscreen();
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

	function handleVolume(event) {
		localStorage.setItem('volume', event.detail.volume);
		const volumeNb = event.detail.volume/100;
		beepCourt.volume = volumeNb;
		beepLong.volume = volumeNb;
	}

	function handleDelete(event) {
		let id = event.detail.id;

		timers = timers.filter(obj => obj.id !== id );
		let nextId = Math.max(...timers.map(timer => timer.id)) + 1;
	}

	/* Button action */
	function addTime() {
		timers = [...timers, {id: nextId++, time: 0, color: nextRandomColor()}]
	}

	function startTimer() {
		handleTimer({detail: {action: 'start'}});
    }
</script>

<main>
	{#if time === 0 }
		<div class="form">
			<h1>Timer</h1>
			<div class="form__rounds">
				<span class="flex">Rounds</span>
				<div class="flex-2">
					<input bind:value={rounds} />
				</div>
			</div>
			{#each timers as time}
				<Timer id={time.id} name={time.name} on:update={handleUpdate} on:delete={handleDelete} />
			{/each}
			<button on:click={addTime}>Add time</button>
			<button on:click={startTimer}>Start</button>
		</div>
	{/if}

	<Display
		time={time}
		name={name}
		color={color}
		currentRound={currentRound}
		rounds={rounds}
		stop={stop}
		volume={volume}
		on:timer={handleTimer}
		on:volume={handleVolume}
	/>
</main>

<style lang="scss">
	main {
		text-align: center;
		display: flex;
		flex-direction: column;
		font-size: 1.5em;
	}

	button {
		margin: 8px;
	}

	.form {
		flex: 1;
		display: flex;
		flex-direction: column;
		max-width: 400px;
		margin: auto;
		
		h1 {
			color: #ff3e00;
			text-transform: uppercase;
			font-size: 4em;
			font-weight: 100;
		}

		&__rounds {
			align-items: center;
			margin: 8px;
			display: flex;

			input {
				width: 100%;
			}
		}
	}
</style>