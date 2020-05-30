<script>
    import AutoComplete from './lib/AutoComplete.svelte'
    import { createEventDispatcher } from 'svelte';
    import { movements } from './lib/movements.js';

    const dispatch = createEventDispatcher();

    export let id;
    export let name;
    export let time;

    let minutes = 0;
    let seconds = 0;

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
    
    $: seconds = (time > 0) ? time%60 : 0;
    $: minute = (time > 0) ? (time-(time%60))/60 : 0;
    $: {
        if (+seconds > 59) {
            minutes = +minutes + 1;
            seconds = seconds%60;
        }
        sendUpdateTimer(+minutes * 60 + +seconds, name);
    }
</script>

<div class="timer">
    <div class="flex-2">
        <input type="number" onfocus="this.value=''" bind:value={minutes} />
        <span>:</span>
        <input type="number" onfocus="this.value=''" bind:value={seconds} />
    </div>
    <div class="flex-2">
        <AutoComplete  name="exercises" items="{movements}" bind:search={name} minChar="1" />
    </div>
    <img src="image/cancel.svg" alt="Delete timer" on:click={deleteTimer} />
</div>

<style lang="scss">
    .timer {
        display: flex;
        align-items: center;
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

        img {
            width: 32px;
            margin-left: 4px;
        }
    }
</style>