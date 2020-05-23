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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 136.033 136.446" height="515.7" width="514.139">
                        <g stroke="#000" stroke-linecap="round" stroke-linejoin="round">
                            {#if volume > 0 }
                                <path d="M78.73 42.177c16.991 19.98 13.405 37.396-.464 53.53" fill="none" stroke-width="8.35"/>
                            {/if}
                            {#if volume > 33 }
                                <path d="M92.948 27.21c23.901 31.45 18.856 58.862-.654 84.256" fill="none" stroke-width="10.154"/>
                            {/if}
                            {#if volume > 66 }    
                                <path d="M106.652 12.544c34.815 41.567 27.466 77.796-.951 111.358" fill="none" stroke-width="10.088"/>
                            {/if}
                            <path d="M3.075 49.04l17.516.31 39.526-28.57.465 95.591-39.836-27.643H2.92z" stroke-width="3.839" paint-order="stroke fill markers"/>
                        </g>
                    </svg>
                </span>
            </div>
            <div class="timer__screen__display">
                {#if time > 0 }
                    <p class="timer__screen__display__round"><span>{currentRound}</span>/{rounds}</p>
                    <p class="timer__screen__display__time">{format(Math.floor(time/60))}:{format(time%60)}</p>
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

                    svg {
                        width: 32px;
                        height: 32px;
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