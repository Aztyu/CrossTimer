<!-- Code from https://github.com/elcobvg/svelte-autocomplete/issues/9 -->
<script>
  import { scale } from "svelte/transition";
  import { quintOut } from "svelte/easing";

  const regExpEscape = s => {
    return s.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
  };

  export let asyncFunc = null;
  export let id = "";
  export let items = [];
  export let maxItems = 10;
  export let minChar = 2;
  export let name = "";
  export let results = [];
  export let value = {};
  export let search = "";

  let arrowCounter = 0;
  let input;
  let loading = false;
  let open = false;
  let timer = null;

  const clickAway = event => {
    timer = setTimeout(() => {
      open = false;
    }, 200);
  };

  const clickOn = event => clearTimeout(timer);

  const onChange = event => {
    const term = event.target.value;

    if (term.length >= Number(minChar)) {
      if (asyncFunc !== null) {
        loading = true;

        clearTimeout(timer);

        timer = setTimeout(async () => {
          items = await asyncFunc(term);
          loading = false;
          open = true;
          filterResults(term);
        }, 500);
      } else {
        open = true;
        filterResults(term);
      }
    } else {
      results = [];
    }
  };

  const filterResults = term => {
    results = items
      .filter(item => {
        if (typeof item !== "string") item = item.value || "";

        return item.toUpperCase().includes(term.toUpperCase());
      })
      .map((item, i) => {
        const text = typeof item !== "string" ? item.value : item;

        return {
          key: item.key || i,
          value: text,
          label:
            term.trim() === ""
              ? text
              : text.replace(
                  RegExp(regExpEscape(term.trim()), "i"),
                  "<span class='font-semibold'>$&</span>"
                )
        };
      })
      .slice(0, maxItems - 1);
  };

  const onKeyDown = event => {
    if (event.keyCode === 40 && arrowCounter < results.length - 1) {
      arrowCounter++;
    } else if (event.keyCode === 38 && arrowCounter > 0) {
      arrowCounter--;
    } else if (event.keyCode === 13) {
      event.preventDefault();

      if (arrowCounter === -1) arrowCounter = 0;

      close(arrowCounter);
    } else if (event.keyCode === 27) {
      event.preventDefault();
      close();
    }
  };

  const close = (index = -1) => {
    open = false;
    arrowCounter = -1;
    input.blur();

    if (index > -1) {
      value = results[index];
      search = results[index].value;
    } else {
      search = "";
    }
  };
</script>

<div class="mt-1 relative rounded-md shadow-sm">
  <input
    on:blur={clickAway}
    on:focus={clickOn}
    on:keydown={event => onKeyDown(event)}
    on:input={event => onChange(event)}
    bind:value={search}
    bind:this={input}
    class="form-input block w-full pr-10 sm:text-sm sm:leading-5"
    style="width:100%;"
    type="text"
    {id}
    {name} />
  {#if loading}
    <div
      class="absolute inset-y-0 right-0 pr-3 flex items-center
      pointer-events-none">
      <img class="h-4 w-4 opacity-50" src="/bars_dark.svg" alt="Loading" />
    </div>
  {/if}
  {#if open}
    <div
      class="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg
      z-10"
      style="position: absolute;background-color: white;"
      transition:scale={{ duration: 150, delay: 0, opacity: 0.2, start: 0.0, easing: quintOut }}>
      <div class="rounded-md bg-white shadow-xs">
        <div class="py-1">
          {#if results.length === 0}
            <div
              class="block px-4 py-2 text-sm cursor-pointer text-gray-700
              hover:bg-gray-100">
              No matches
            </div>
          {:else}
            {#each results as result, i}
              <div
                on:click={() => close(i)}
                class="block px-4 py-2 text-sm cursor-pointer text-gray-700
                hover:bg-gray-100 {i === arrowCounter ? 'bg-gray-100' : ''}"
                style="padding: 5px;border: solid 1px;">
                {@html result.label}
              </div>
            {/each}
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>