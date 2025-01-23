<script lang="ts">
    import type {MasterProgram} from "../../../model/master";
    import {masterProgramUrl} from "../../../services/external";

    let {program}: { program: MasterProgram } = $props();
</script>


<a target="_blank" href={masterProgramUrl(program.slug)} class="text-2xl block mb-2 max-w-[93%]">{program.name}</a>
{program.description}

<h2 class="text-xl mt-2">Antagningskrav</h2>
<h2>{@html program.requirements}</h2>

