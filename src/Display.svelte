<script>
    export let time;
    export let name;
    export let currentRound;
    export let rounds;
    export let stop;

    let displayMinute = '00';
    let displaySeconds = '00';

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    // Format time for display
    function format(time) {
        return time < 10 ? '0' + time : time;
    }

    // Component function
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

    $: {
        displayMinute = format(Math.floor(time/60));
        displaySeconds = format(time%60);
    }
</script>

<div class="main">
    <div class="action">
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
    </div>

    <div class="display">
        {#if time > 0 }
            <p class="uppercase round"><span>{currentRound}</span>/{rounds}</p>
            <p class="uppercase time">{displayMinute}:{displaySeconds}</p>
            <p class="uppercase exercise">{name}</p>
        {/if}
    </div>
</div>

<style>
    .main {
        background-color: #fdfd72;
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .action {
        font-size: 2em;
        margin-top: 24px;

        position: absolute;
        width: 98%;
        text-align: end;
    }

    .round {
        font-size: 3em;
        font-weight: 700;
        line-height: 1.5em;
    }

    .round span {
        font-size: 2em;
    }

    .time {
        font-size: 11em;
        font-weight: 400;
        line-height: 1em;
    }

    .exercise {
        font-size: 4em;
        font-weight: 700;
        color: #898e3d;
    }

    .uppercase {
        text-transform: uppercase;
    }

    .display {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
</style>