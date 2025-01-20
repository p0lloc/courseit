<script lang="ts">

    import type {Snippet} from "svelte";

    let {onClick, children}: { onClick: () => void, children: Snippet } = $props();
</script>

<button
        class="w-full flex-1 h-16 border text-sm p-2 flex justify-center items-center hover:bg-gray-100"
        onclick={onClick}
>
    {@render children()}
</button>
