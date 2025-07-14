<template>
  <div className="loader"></div>
</template>

<script>
export default {};
</script>

<style scoped>
.loader {
  display: inline-block;
  width: 100%;
  aspect-ratio: 1/1;
  border: 4px solid var(--loading-border-color);
  border-left-color: var(--loading-color);
  border-radius: 50%;
  animation: spin 1s cubic-bezier(0.39, 0.575, 0.565, 1) infinite;
}

@keyframes spin {
  to {
    transform: rotate(-360deg);
  }
}
</style>
