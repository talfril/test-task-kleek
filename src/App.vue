<template>
  <main class="page">
    <div class="searchBlock">
      <h1 id="search-label" class="visually-hidden">
        Поиск пользователей и компаний
      </h1>
      <SuggestInput
        ref="suggestInput"
        v-model="selectedAliases"
        @input="onInput"
        @keydown="onInputKeydown"
      />
      <Dropdown
        :visible="showDropdown"
        :loading="loading"
        :items="data"
        :pending="pending"
        :queryLength="query.length"
        :error="error"
        :highlightedIndex="highlightedIndex"
        :selectedAliases="selectedAliases"
        @select="onSelect"
        @close="handleCloseDropdown"
      />
    </div>
    <button v-if="canRetry" @click="retry" class="retry-button">
      Попробовать снова
    </button>
  </main>
</template>

<script>
import { ref } from "vue";
import { useApi } from "./utils/useAPI";
import SuggestInput from "./components/SuggestInput.vue";
import Dropdown from "./components/Dropdown.vue";

export default {
  name: "App",
  components: {
    SuggestInput,
    Dropdown,
  },
  data() {
    return {
      query: "",
      selectedAliases: [],
      highlightedIndex: -1,
      showDropdown: false,
      data: [],
      loading: false,
      pending: false,
      error: null,
      canRetry: false,
      retry: () => {},
    };
  },
  props: {
    maxSelections: {
      type: Number,
      default: 10,
    },
  },
  created() {
    const queryRef = ref(this.query);

    this.$watch("query", (newVal) => {
      queryRef.value = newVal;
    });

    const api = useApi(queryRef, {
      endpoint: (q) =>
        `https://habr.com/kek/v2/publication/suggest-mention?q=${encodeURIComponent(
          q
        )}`,
      extractData: (response) => response.data,
      minQueryLength: 3,
      debounceTime: 300,
      timeout: 3000,
    });

    Object.assign(this, api);
  },
  watch: {
    query(newVal) {
      this.showDropdown = newVal.length > 0 && this.selectedAliases.length < 10;
    },
  },
  methods: {
    onInput(query) {
      this.query = query;
    },
    onInputKeydown(event) {
      if (!this.showDropdown) return;

      switch (event.key) {
        case "ArrowDown":
          this.highlightedIndex =
            (this.highlightedIndex + 1) % this.data.length;
          event.preventDefault();
          break;
        case "ArrowUp":
          this.highlightedIndex =
            (this.highlightedIndex - 1 + this.data.length) % this.data.length;
          event.preventDefault();
          break;
        case "Enter":
          if (
            this.highlightedIndex >= 0 &&
            this.highlightedIndex < this.data.length
          ) {
            this.onSelect(this.data[this.highlightedIndex]);
            event.preventDefault();
          }
          break;
      }
    },
    onSelect(item) {
      if (
        this.selectedAliases.length < 10 &&
        !this.selectedAliases.includes(item.alias)
      ) {
        this.selectedAliases = [...this.selectedAliases, item.alias];
      }
      this.query = "";
      this.showDropdown = false;

      this.$refs.suggestInput.clearInputContent();
      this.$refs.suggestInput.focusInput();
    },
  },
};
</script>

<style scoped>
.page {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.searchBlock {
  display: flex;
  gap: 15px;
  align-items: flex-end;
  position: relative;
}

.retry-button {
  margin-top: 4rem;
  padding: 0.5rem 1rem;
  background-color: var(--accent-color);
  color: var(--light-accent);
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background-color 0.25s ease, color 0.25s ease;
}

.retry-button:hover {
  background-color: var(--hover-color);
  color: var(--accent-color);
}

.retry-button:active {
  background-color: var(--focus-color);
}
</style>
