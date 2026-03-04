<script lang="ts">
  import { localWordGamePreferences } from "../../store/localWordGamePreferences";
  import { NativeSelect, NativeSelectOption } from "./ui/native-select";
</script>

<NativeSelect bind:value={$localWordGamePreferences.maxMistakes}>
  <NativeSelectOption value={1}>1</NativeSelectOption>
  <NativeSelectOption value={2}>2</NativeSelectOption>
  <NativeSelectOption value={3}>3</NativeSelectOption>
  <NativeSelectOption value={4}>4</NativeSelectOption>
  <NativeSelectOption value={5}>5</NativeSelectOption>
</NativeSelect>
