<script>
    export let time;
    export let name;
    export let currentRound;
    export let rounds;
    export let stop;

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    function send(action) {
        dispatch('timer', {
            action: action,
		});
    }

    function startTimer() {
        send('start');
    }

    function resumeTimer() {
        send('resume');
    }

    function resetTimer() {
        send('reset');
    }

    function stopTimer() {
        send('stop');
    }
</script>

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