<script lang="ts">
    let {onClick}: {onClick: () => void} = $props();
</script>

<button onclick={onClick} class="border-2 border-dashed w-full p-4">
    Välj master
</button>
