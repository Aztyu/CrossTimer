<script>
    import { toast } from './store.js';

    let notifications = [];

    toast.subscribe(value => {
        if (value !== null) {
            notifications = [...notifications, value.message];
            setTimeout(() => { notifications = notifications.filter(msg => msg !== value.message) }, value.time);
        }
    });
</script>

<div class="root">
    {#each notifications as notification}
        <div>
            <span>{notification}</span>
        </div>
    {/each}
</div>


<style lang="scss">
    .root {
        z-index: 999;
        position: fixed;
        width: 100%;
        display: flex;
        flex-direction: column;
        top: 0;

        div {
            align-self: center;
            padding: 16px;
            color: white;
            background-color: #000000a6;
            border-radius: 7px;
            margin-top: 16px;
        }
    }
</style>