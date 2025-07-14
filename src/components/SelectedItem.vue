<template>
  <div class="tag">
    <span class="alias">@ {{ alias }}</span>
    <button class="close" @click="$emit('remove')" aria-label="Удалить">
      x
    </button>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  alias: string;
}>();

defineEmits<{
  (e: "remove"): void;
}>();
</script>

<style scoped>
.tag {
  display: inline-flex;
  align-items: center;
  background-color: var(--accent-color);
  border-radius: var(--border-radius);
  padding: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-right: 8px;
}

.alias {
  margin-right: 6px;
  color: var(--light-accent);
}

.close {
  background: none;
  border: none;
  color: var(--light-accent);
  cursor: pointer;
  padding: 0 4px;
  font-size: 1rem;
  line-height: 1;
}

.close:hover {
  color: var(--secondary-text-color);
}
</style>
