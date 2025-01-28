<script lang="ts">
    import DisclaimerView from "./views/DisclaimerView.svelte";
    import MainView from "./views/MainView.svelte";
    import type {AppData} from "./services/data";

    const DISCLAIMER_KEY = "disclaimerDismissed";

    let { appData }: { appData: AppData } = $props();
    let disclaimerDismissed: boolean = $state(localStorage.getItem(DISCLAIMER_KEY) != null);

    function dismissDisclaimer() {
        localStorage.setItem(DISCLAIMER_KEY, "true");
        disclaimerDismissed = true;
    }
</script>

<a class="md:block fixed left-6 bottom-6 hidden" href="https://github.com/p0lloc/courseit">
    <img src="github.png" class="w-14 h-14" alt="Project on GitHub" />
</a>
{#if disclaimerDismissed}
    <MainView {appData} />
{:else}
    <DisclaimerView onDismiss={dismissDisclaimer} />
{/if}
