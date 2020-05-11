<script>
    export let time;
    export let name;
    export let color;
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

    var elem = document.documentElement;

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

    /* Component function */
    function send(action) {
        dispatch('timer', {
            action: action,
		});
    }

    function startTimer() {
        openFullscreen();
        send('start');
    }

    function resumeTimer() {
        send('resume');
    }

    function resetTimer() {
        closeFullscreen();
        send('reset');
    }

    function stopTimer() {
        send('stop');
    }

    $: {
        displayMinute = format(Math.floor(time/60));
        displaySeconds = format(time%60);
        if (time === 0) {
            closeFullscreen();
        }
    }
</script>

<div class="main {color}">
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
    .yellow {
        background-color: #fdfd72;
    }
    .yellow .exercise {
        color: #898e3d;
    }

    .green {
        background-color: #47e647;
    }
    .green .exercise {
        color: #3c7b3c;
    }

    .blue {
        background-color: #24c2ff;
    }
    .blue .exercise {
        color: #396677;
    }

    .main {
        
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