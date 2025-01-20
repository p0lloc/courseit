<script>
    // noinspection ES6UnusedImports
    import Fa from "svelte-fa";
    import {faFileImport, faFloppyDisk} from "@fortawesome/free-solid-svg-icons";
</script>


<div class="flex gap-2 items-center">
    <select>
        <option>Skapa ny plan</option>
    </select>
    <button>
        <Fa icon={faFileImport}/>
    </button>
    <button>
        <Fa icon={faFloppyDisk}/>
    </button>
</div>

<style>
    select, button {
        @apply border bg-white px-2 py-1 rounded-md h-8;
    }
</style>
