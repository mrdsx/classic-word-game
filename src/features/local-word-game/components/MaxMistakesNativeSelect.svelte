<script lang="ts">
  import {
    NativeSelect,
    NativeSelectOption,
  } from "$lib/components/ui/native-select";
  import { localWordGamePreferences } from "../../../store/localWordGamePreferences";
</script>

<NativeSelect bind:value={$localWordGamePreferences.maxMistakes}>
  <NativeSelectOption value={1}>1</NativeSelectOption>
  <NativeSelectOption value={2}>2</NativeSelectOption>
  <NativeSelectOption value={3}>3</NativeSelectOption>
  <NativeSelectOption value={4}>4</NativeSelectOption>
  <NativeSelectOption value={5}>5</NativeSelectOption>
</NativeSelect>
