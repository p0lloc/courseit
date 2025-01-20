<script>
    import PeriodColumn from "./PeriodColumn.svelte";
</script>

<div>
    <h2 class="text-3xl">År 1</h2>
    <div class="flex mt-2 flex-wrap md:flex-nowrap">
        {#each Array(4) as _ }
            <PeriodColumn/>
        {/each}
    </div>
</div>
