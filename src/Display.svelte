<script>
    export let time;
    export let name;
    export let color;
    export let volume;
    export let currentRound;
    export let rounds;
    export let stop;

    let displayMinute = '00';
    let displaySeconds = '00';
    let imgVolume = 'soundhigh';

    let oldVolume = volume;

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    // Format time for display
    function format(time) {
        return time < 10 ? '0' + time : time;
    }

    /* Component function */
    function send(action) {
        dispatch('timer', {
            action: action,
		});
    }

    function updateVolume(volume) {
        if(volume !== oldVolume) {
            oldVolume = volume;
            
            if (volume > 66) {
                imgVolume = 'soundhigh';
            } else if (volume > 33) {
                imgVolume = 'soundmedium';
            } else if (volume > 0) {
                imgVolume = 'soundlow';
            } else {
                imgVolume = 'soundoff';
            }

            dispatch('volume', {
                volume: volume,
            });
        }
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
        updateVolume(+volume);
    }
</script>

{#if time > 0 }
    <div class="timer {color}">
        <div class="timer__button">
                {#if stop === true }
                    <img src="image/pause-resume.svg" alt="Pause or Resume" on:click={resumeTimer}>
                    <img src="image/reset.svg" alt="Reset" on:click={resetTimer}>
                {:else}
                    <img src="image/pause.svg" alt="Pause" on:click={stopTimer}>
                {/if}
        </div>

        <div class="timer__screen">
            <div class="timer__screen__volume">
                <input type="range" orient="vertical" min="0" max="100" bind:value={volume}>
                <span>
                    <img src="image/{imgVolume}.png" alt="Sound icon" />
                </span>
            </div>
            <div class="timer__screen__display">
                {#if time > 0 }
                    <p class="timer__screen__display__round"><span>{currentRound}</span>/{rounds}</p>
                    <p class="timer__screen__display__time">{displayMinute}:{displaySeconds}</p>
                    <p class="timer__screen__display__exercise {name.length > 15 ? 'long_txt' : ''}">{name}</p>
                {/if}
            </div>
        </div>
    </div>
{/if}

<style lang="scss">
    .timer {
        flex: 1;
        display: flex;
        flex-direction: column;

        &__button {
            font-size: 2em;
            margin-top: 24px;

            position: absolute;
            width: 98%;
            text-align: end;

            img {
                width: 1.5em;
            }
        }

        &__screen {
            flex-direction: row;
            display: flex;
            height: 100%;
            align-items: center;

            &__volume {
                display: flex;
                flex-direction: column;
                width: 74px;

                span {
                    margin-top: 15px;
                    font-size: 1.5em;
                    font-weight: 700;

                    img {
                        width: 32px;
                    }
                }

                input[type=range][orient=vertical]
                {
                    writing-mode: bt-lr; /* IE */
                    -webkit-appearance: slider-vertical; /* WebKit */
                    width: 8px;
                    padding: 0 5px;

                    height: 300px;
                    margin-left: 32px;
                }
            }

            &__display {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;

                p {
                    text-transform: uppercase;
                }

                &__round {
                    font-size: 2em;
                    font-weight: 700;
                    line-height: 1.5em;

                    span {
                        font-size: 2em;
                    }
                }

                &__time {
                    font-size: 8em;
                    font-weight: 400;
                    line-height: 1em;
                }

                &__exercise {
                    font-size: 3em;
                    font-weight: 700;

                    &.long_txt {
                        font-size: 1.8em;
                    }
                }
            }
        }
    }

    .yellow {
        background-color: #fdfd72;

        .timer__screen__display__exercise {
            color: #898e3d;
        }
    }

    .green {
        background-color: #47e647;

        .timer__screen__display__exercise {
            color: #3c7b3c;
        }
    }

    .blue {
        background-color: #24c2ff;

        .timer__screen__display__exercise {
            color: #396677;
        }
    }
</style>