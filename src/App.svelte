<script>
	import Timer from './Timer.svelte';
	import Display from './Display.svelte';
	import Toast from './lib/Toast.svelte';
	import { onDestroy } from 'svelte';

	import { openFullscreen, closeFullscreen, sayPhrase } from './lib/functions.js';
	import { playBeepLong, playBeepCourt, updateGain } from './lib/audio.js';
	import { connectFirebase, disconnectFirebase, addTimer } from './lib/firebase.js';
	import { user, timerStore, toast } from './lib/store.js';

	/* Initialize data */
	let time = 0;
	let name = '';
	let color = '';
	let rounds = 1;
	let useVoice = false;
	let timers = [
		{ id: 1, time: 0, name: 'Work', color: 'yellow' },
		{ id: 2, time: 0, name: 'Rest', color: 'blue' }
	];

	let volume = (!!localStorage.getItem('volume')) ? localStorage.getItem('volume') : 100;
	updateGain(volume/100);

	let timerName = '';
	let timerToLoad = '';
	var userFirebase = null;
	
	var timersArray = localStorage.getItem('timers');
	if (!timersArray) {
		timersArray = {};
	} else {
		timersArray = JSON.parse(timersArray);
	}

	// Time before timer start in seconds
	const preparationTime = 10;

	/* Internal values */
	let nextId = 3; //keep track of timers
	let currentTimeIdx = 0;
	let currentRound = 1;
	let stop = false;
	let colors = ['blue', 'yellow', 'green'];

	onDestroy(user.subscribe(value => {
		userFirebase = value;
	}));

	onDestroy(timerStore.subscribe(value => {
		if (!!value) {
			timersArray = value;
		}
	}));

	/* Business logic */
	var timer = () => {
		if (stop) {
			return;
		}
		var bufferTime = time - 1;
		if (bufferTime > 0) {
			setTimeout(timer, 1000);
			// Say the name of the next exercise on the 6th second if we are not in the warming up timer or the last one
			if (currentTimeIdx >= 0 &&
				bufferTime === 6 &&
				!(currentRound === +rounds && currentTimeIdx === timers.length - 1)
			) {
				var exerciseName = (currentTimeIdx < timers.length - 1) ? timers[currentTimeIdx+1].name : timers[0].name;
				useVoice && sayPhrase('Next exercise : ' + exerciseName, volume);
			} else if (bufferTime < 3) {
				playBeepCourt();
			}
			time = bufferTime;
		} else {
			playBeepLong();
			time = bufferTime;
			// End of timers
			if (++currentTimeIdx < timers.length) {
				launchTimer(currentTimeIdx);
			// Check if there are rounds left
			} else if (currentRound < rounds) {
				useVoice && sayPhrase('Round ' + currentRound + ' complete', volume);
				currentRound = ++currentRound;
				currentTimeIdx = 0;
				launchTimer(0);
			// End of the rounds and timers
			} else {
				setTimeout(function() { playBeepLong() }, 500);
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

	function showToast(message, time) {
		toast.set({message: message, time: time});
	}

	function nextRandomColor() {
		// TODO better color managing
		return colors[Math.floor(Math.random() * colors.length)];
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
				useVoice && sayPhrase('First exercise : ' + timers[0].name, volume);
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

	function updateId() {
		let nextId = Math.max(...timers.map(timer => timer.id)) + 1;
	}

	function handleVolume(event) {
		localStorage.setItem('volume', event.detail.volume);
		updateGain(event.detail.volume/100);
	}

	function handleDelete(event) {
		let id = event.detail.id;

		timers = timers.filter(obj => obj.id !== id);
		updateId();
	}

	/* Button action */
	function addTime() {
		timers = [...timers, {id: nextId++, time: 0, color: nextRandomColor()}];
	}

	function startTimer() {
		handleTimer({detail: {action: 'start'}});
	}
	
	function saveTimer() {
		timersArray[timerName] = {
			rounds: rounds,
			time: timers,
		};

		showToast("Saved " + timerName, 3000);

		if (!!userFirebase) {
			addTimer({
				name: timerName,
				rounds: rounds,
				time: timers,
			});
		} else {
			localStorage.setItem('timers', JSON.stringify(timersArray));
		}
	}

	function loadTimer() {
		if (!!timerToLoad) {
			var timerData = timersArray[timerToLoad];
			rounds = timerData.rounds;
			timers = timerData.time;
			updateId();
			showToast("Loaded " + timerToLoad, 3000);
		}
	}

	function connect() {
		connectFirebase();
	};

	function disconnect() {
		disconnectFirebase();
	};
</script>

<main>
	{#if time === 0 }
		<div class="form">
			<div class="form__title">
				<h1>Timer</h1>
				{#if userFirebase === null}
					<img src="image/user.svg" alt="Connect icon" on:click={connect}>
				{:else}
					<img src={userFirebase.photoURL} alt="Profil picture" on:click={disconnect}>
				{/if}
			</div>

			<div class="form__rounds">
				<span class="flex">Rounds</span>
				<div class="flex-2">
					<input bind:value={rounds} />
				</div>
			</div>
			{#each timers as time (time.id)}
				<Timer id={time.id} name={time.name} time={time.time} on:update={handleUpdate} on:delete={handleDelete} />
			{/each}
			<button on:click={addTime}>Add time</button>
			<p>
				<input type="checkbox" name="voice" bind:checked={useVoice}>
  				<label for="voice">Use voice reminder</label>
			</p>
			<button on:click={startTimer}>Start</button>
			<div class="form__manage">
				<h2>Manage timers</h2>
				<div >
					<input bind:value={timerName} placeholder="Name current timer"/>
					<button on:click={saveTimer}>Save</button>
				</div>
				<div>
					<select bind:value={timerToLoad}>
					<option value="">Choose existing</option>
						{#each Object.keys(timersArray) as name}
							<option value={name}>{name}</option>
						{/each}
					</select>
					<button on:click={loadTimer}>Load</button>
				</div>
			</div>
			
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

	<Toast />
</main>

<style lang="scss">
	@import "./styles/theme.scss";

	main {
		text-align: center;
		display: flex;
		flex-direction: column;
		font-size: 1.5em;
	}

	button {
		margin: 8px;
		border-radius: 8px;
		background-color: $main-color;
		color: white;
		font-size: 1em;
		text-transform: uppercase;
		border: none;
		cursor: pointer;
	}

	.form {
		flex: 1;
		display: flex;
		flex-direction: column;
		max-width: 400px;
		width: 100%;
		margin: auto;
		
		&__title {
			display: flex;
			align-items: baseline;
			margin: 4px 8px;

			h1 {
				flex: 1;
				color: $main-color;
				text-transform: uppercase;
				font-size: 4em;
				font-weight: 100;
			}

			img {
				width: 64px;
				border-radius: 32px;
				border: solid 3px $main-color;
				border-radius: 50px;
				cursor: pointer;
			}
		}

		&__rounds {
			align-items: center;
			margin: 8px;
			display: flex;

			input {
				width: 100%;
			}
		}

		&__manage {
			margin-top: 32px;

			h2 {
				color: $main-color;
				text-transform: uppercase;
				font-size: 1.5em;
				font-weight: 400;
			}
			
			div {
				display: flex;

				input, select {
					flex: 1;
					margin: 8px;
				}

				input {
    				min-width: 0;
				}
			}
		}
	}
</style>