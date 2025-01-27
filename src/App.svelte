<script lang="ts">
    import DisclaimerView from "./views/DisclaimerView.svelte";
    import MainView from "./views/MainView.svelte";
    import type {AppData} from "./services/data";

    let disclaimerDismissed = $state(false);
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
