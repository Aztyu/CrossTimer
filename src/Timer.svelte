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

<p>
    <input bind:value={minutes} />
    <span>m </span>
    <input bind:value={seconds} />
    <span>s </span>
    <input bind:value={name} />
</p>