<script lang="ts">
    let {onDismiss}: { onDismiss: () => void } = $props();
</script>

<div
        class="min-h-screen primary-bg flex justify-center items-center text-white"
>
    <div class="text-center">
        <h2 class="text-5xl font-bold">CourseIT</h2>
        <p class="mt-4">
            Information på denna sida kan vara felaktig eller utdaterad.
        </p>
        <p>Du ansvarar själv för att besöka de officiella sidorna.<br>

            <br/>
            Sidan använder cookies.</p>

        <button onclick={onDismiss} class="button-blue mt-4">Jag förstår
        </button>
    </div>
</div>

<style>
    p {
        @apply text-2xl;
    }
</style>
