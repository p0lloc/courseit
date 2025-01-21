<script lang="ts">
    import DisclaimerView from "./views/DisclaimerView.svelte";
    import MainView from "./views/MainView.svelte";

    let disclaimerDismissed = $state(true);
    let { appData }: { appData: AppData } = $props();

    function dismissDisclaimer() {
        disclaimerDismissed = true;
    }
</script>

{#if disclaimerDismissed}
    <MainView {appData} />
{:else}
    <DisclaimerView onDismiss={dismissDisclaimer} />
{/if}
