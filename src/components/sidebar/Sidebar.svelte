<script lang="ts">
    // noinspection ES6UnusedImports
    import Fa from "svelte-fa";
    import {faTimes} from "@fortawesome/free-solid-svg-icons";

    let {visible, onClose}: { visible: boolean, onClose: () => void } = $props();
</script>

{#if visible}
    <div class="fixed right-0 top-0 h-screen w-full md:w-96 border-l bg-white p-4 overflow-y-scroll">
        <div class="flex justify-between items-center"><h2>Ok</h2>
            <button class="text-2xl" onclick={onClose}>
                <Fa icon={faTimes}/>
            </button>
        </div>
    </div>
{/if}
