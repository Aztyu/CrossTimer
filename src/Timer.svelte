<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let id;

    function sendUpdateTimer(time) {
		dispatch('update', {
            id: id,
			time: time
		});
    }
    
    $: {
        sendUpdateTimer(+minutes * 60 + +seconds);
    }

	let minutes = 0;
	let seconds = 0;
</script>

<p>
    <input bind:value={minutes}/>
    <span>m </span>
    <input bind:value={seconds}/>
    <span>s </span>
</p>