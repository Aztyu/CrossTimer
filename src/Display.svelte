<script>
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