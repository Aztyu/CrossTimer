<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let id;
    export let name;
    export let time;
    
	let minutes = 0;
	let seconds = 0;

    if (time > 0) {
        seconds = time%60;
        minutes = (time-seconds)/60;
    }

    function sendUpdateTimer(time, name) {
		dispatch('update', {
            id: id,
			time: time,
            name: name,
		});
    }

    function deleteTimer() {
        dispatch('delete', {
            id: id,
        })
    }
    
    $: {
        sendUpdateTimer(+minutes * 60 + +seconds, name);
        if (+seconds > 59) {
            minutes = +minutes + 1;
            seconds = seconds%60;
        }
    }
</script>

<div class="timer">
    <div class="flex-2">
        <input type="number" onfocus="this.value=''" bind:value={minutes} />
        <span>:</span>
        <input type="number" onfocus="this.value=''" bind:value={seconds} />
    </div>
    <div class="flex-2">
        <input class="exercise" bind:value={name} />
    </div>
    <div>
        <button on:click={deleteTimer}>X</button> 
    </div>
</div>

<style lang="scss">
    .timer {
        display: flex;
        margin: 8px;

        input[type=range] {
            padding: 0.4em 0.2em 0.4em 0.1em;
        }

        input {
            width: 48px;
            text-align: right;

            &.exercise {
                width: 100%;
                text-align: center;
            }
        }
    }
</style>