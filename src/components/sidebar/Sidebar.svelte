<script lang="ts">
    // noinspection ES6UnusedImports
    import Fa from "svelte-fa";
    import { faTimes } from "@fortawesome/free-solid-svg-icons";
    import { SidebarActionType, type SidebarAction } from "../../model/sidebar";
    import type { Component } from "svelte";
    import AddCourseSidebar from "./AddCourseSidebar.svelte";
    import ExistingCourseSidebar from "./ExistingCourseSidebar.svelte";

    let action = $state<SidebarAction | null>(null);

    export function open(editAction: SidebarAction) {
        action = editAction;
    }

    export function close() {
        action = null;
    }

    export const RENDERERS: Record<
        SidebarActionType,
        Component<{ action: SidebarAction }>
    > = {
        [SidebarActionType.ADD_COURSE]: AddCourseSidebar,
        [SidebarActionType.EXISTING_COURSE]: ExistingCourseSidebar,
    };

    let RendererComponent: Component<{ action: SidebarAction }> | null =
        $derived(action != null ? RENDERERS[action!.type] : null);
</script>

{#if action != null}
    <div
        class="fixed right-0 top-0 h-screen w-full md:w-96 border-l bg-white p-4 overflow-y-scroll"
    >
        <div class="flex justify-end mb-2 absolute right-4">
            <button class="text-2xl" onclick={close}>
                <Fa icon={faTimes} />
            </button>
        </div>
        <RendererComponent {action} />
    </div>
{/if}
