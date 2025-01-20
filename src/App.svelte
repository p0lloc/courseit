<script lang="ts">
    import DisclaimerView from "./views/DisclaimerView.svelte";
    import MainView from "./views/MainView.svelte";

    let disclaimerDismissed = $state(true);

    function dismissDisclaimer(){
        disclaimerDismissed = true;
    }
</script>

{#if disclaimerDismissed}
    <MainView />
{:else}
    <DisclaimerView onDismiss={dismissDisclaimer}/>
{/if}
