<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let id;
    export let name;

    function sendUpdateTimer(time, name) {
		dispatch('update', {
            id: id,
			time: time,
            name: name,
		});
    }
    
    $: {
        sendUpdateTimer(+minutes * 60 + +seconds, name);
        if (+seconds > 59) {
            minutes = +minutes + 1;
            seconds = seconds%60;
        }
    }

	let minutes = 0;
	let seconds = 0;
</script>

<div class="timer">
    <div class="flex-2">
        <input type="number" onfocus="this.value=''" bind:value={minutes} />
        <span>:</span>
        <input type="number" onfocus="this.value=''" bind:value={seconds} />
    </div>
    <div class="flex-3">
        <input class="exercise" bind:value={name} />
    </div>
</div>

<style>
    .timer {
        display: flex;
        margin: 8px;
    }

    .flex-2 {
        flex: 2;
    }

    .flex-2 input {
        padding: 0.4em 0.2em 0.4em 0.1em;
    }

    .flex-3 {
        flex: 3;
    }
    
    input {
        width: 48px;
        text-align: right;
    }

    input.exercise {
        width: 100%;
        text-align: center;
    }
</style>