<template>
  <div
    v-if="visible"
    class="dropdown"
    ref="dropdownRef"
    role="listbox"
    aria-labelledby="search-label"
    :aria-busy="loading"
    :aria-live="loading ? 'polite' : 'off'"
  >
    <div v-if="loading" class="loader-wrapper" aria-live="polite">
      <Loader />
      <span class="visually-hidden">Загрузка...</span>
    </div>

    <div
      v-else-if="queryLength > 0 && queryLength < 3"
      class="dropdown__empty"
      aria-live="polite"
    >
      Продолжайте ввод...
    </div>

    <div
      v-else-if="error"
      class="dropdown__error"
      role="alert"
      aria-live="assertive"
    >
      Ошибка: {{ error }}
    </div>

    <div
      v-else-if="!pending && items.length === 0"
      class="dropdown__empty"
      aria-live="polite"
    >
      Ничего не найдено
    </div>

    <ul v-else class="dropdown__list" ref="listRef" role="list">
      <SuggestedItem
        v-for="(item, index) in items"
        :key="item.alias"
        :item="item"
        :class="{
          highlighted: index === highlightedIndex,
          selected: selectedAliases.includes(item.alias),
        }"
        :aria-selected="
          index === highlightedIndex || selectedAliases.includes(item.alias)
        "
        role="option"
        @select="handleSelect"
      />
    </ul>
  </div>
</template>

<script>
import SuggestedItem from "./SuggestedItem.vue";
import Loader from "./Loader.vue";

export default {
  name: "Dropdown",
  components: { SuggestedItem, Loader },
  props: {
    items: { type: Array, required: true },
    visible: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    pending: { type: Boolean, default: false },
    error: { type: String, default: null },
    queryLength: { type: Number, default: 0 },
    highlightedIndex: { type: Number, default: -1 },
    selectedAliases: { type: Array, default: () => [] },
    minQueryLength: { type: Number, default: 3 },
    ariaLabelledby: { type: String, default: "search-label" },
  },
  emits: ["select", "close"],
  data() {
    return {
      dropdownRef: null,
      listRef: null,
    };
  },
  watch: {
    highlightedIndex(newIndex) {
      this.scrollToHighlighted(newIndex);
    },
  },
  mounted() {
    document.addEventListener("click", this.onClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.onClickOutside);
  },
  methods: {
    handleSelect(item) {
      this.$emit("select", item);
    },
    scrollToHighlighted(index) {
      if (index >= 0 && this.$refs.listRef) {
        const items = this.$refs.listRef.querySelectorAll("li");
        if (items[index]) {
          items[index].scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }
    },
    onClickOutside(event) {
      if (
        this.$refs.dropdownRef &&
        !this.$refs.dropdownRef.contains(event.target)
      ) {
        this.$emit("close");
      }
    },
  },
};
</script>

<style scoped>
.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 2px;
  padding: 8px 0;
  border: 1px solid var(--accent-color);
  border-radius: var(--border-radius);
  width: 100%;
  max-height: 240px;
  overflow-y: auto;
  z-index: 2;
}

.dropdown__loading,
.dropdown__empty,
.dropdown__error {
  padding: 6px;
  font-size: 0.9rem;
  color: var(--secondary-text-color);
}

.dropdown__error {
  color: var(--error-color);
}

.dropdown__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.loader-wrapper {
  padding: 5px;
  width: 25px;
  margin: 0 auto;
}

.highlighted {
  background-color: var(--focus-color);
}

.selected {
  background-color: var(--selected-color);
}
</style>
