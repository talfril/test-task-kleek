<template>
  <div class="inputWrapper">
    <label :for="inputId" class="inputLabel">
      <span class="inputLabelMark" aria-hidden="true">*</span>
      {{ label }}
    </label>
    <div
      class="inputContainer"
      @click="handleContainerClick"
      :aria-expanded="showDropdown"
      aria-haspopup="listbox"
      aria-controls="suggestions-dropdown"
    >
      <div class="selectedItems">
        <SelectedItem
          v-for="(alias, index) in selectedAliases"
          :key="index"
          :alias="alias"
          @remove="removeAlias(index)"
          :aria-label="`Выбран: ${alias}, нажмите крестик для удаления`"
        />
      </div>
      <div
        class="editableInput"
        ref="inputRef"
        :id="inputId"
        @input="onInput"
        @keydown="onKeydown"
        contenteditable="true"
        :data-placeholder="shouldShowPlaceholder ? placeholder : ''"
        :style="{
          cursor: isInputDisabled ? 'default' : 'text',
        }"
        :aria-autocomplete="isInputDisabled ? 'none' : 'list'"
        role="combobox"
        aria-controls="suggestions-dropdown"
        :aria-label="
          selectedAliases.length > 0 ? 'Выбранные пользователи' : placeholder
        "
        :contenteditable="!isInputDisabled"
      ></div>
    </div>
  </div>
</template>

<script>
import SelectedItem from "./SelectedItem.vue";

export default {
  name: "SuggestInput",
  components: { SelectedItem },
  props: {
    modelValue: { type: Array, default: () => [] },
    label: { type: String, default: "Пользователь или компания" },
    placeholder: { type: String, default: "Введите логин" },
    inputId: { type: String, default: "userInput" },
    maxSelections: { type: Number, default: 10 },
  },
  computed: {
    selectedAliases() {
      return this.modelValue;
    },
    shouldShowPlaceholder() {
      return (
        this.selectedAliases.length === 0 && !this.$refs.inputRef?.textContent
      );
    },
    isInputDisabled() {
      return this.selectedAliases.length >= this.maxSelections;
    },
  },
  methods: {
    handleContainerClick() {
      if (!this.isInputDisabled) {
        this.focusInput();
      }
    },
    onInput(event) {
      if (this.isInputDisabled) {
        this.clearInputContent();
        return;
      }
      this.$emit("input", event.target.textContent);
    },
    onKeydown(event) {
      if (this.isInputDisabled) {
        event.preventDefault();
        return;
      }

      if (
        event.key === "Backspace" &&
        !this.$refs.inputRef.textContent &&
        this.selectedAliases.length > 0
      ) {
        this.removeAlias(this.selectedAliases.length - 1);
        event.preventDefault();
      }
      this.$emit("keydown", event);
    },
    removeAlias(index) {
      const newAliases = [...this.selectedAliases];
      newAliases.splice(index, 1);
      this.$emit("update:modelValue", newAliases);
      this.focusInput();
    },
    addAlias(alias) {
      if (this.isInputDisabled || this.selectedAliases.includes(alias)) return;

      const newAliases = [...this.selectedAliases, alias];
      this.$emit("update:modelValue", newAliases);
      this.clearInputContent();
      this.focusInput();
    },
    focusInput() {
      if (!this.isInputDisabled) {
        this.$nextTick(() => {
          this.$refs.inputRef.focus();
        });
      }
    },
    clearInput() {
      this.$emit("update:modelValue", []);
      this.clearInputContent();
      this.focusInput();
    },
    clearInputContent() {
      if (this.$refs.inputRef) {
        this.$refs.inputRef.textContent = "";
      }
    },
  },
  emits: ["update:modelValue", "input", "keydown"],
};
</script>

<style scoped>
.inputWrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
}

.inputContainer {
  position: relative;
  color: var(--main-text-color);
  min-height: 40px;
  width: 300px;
  padding: 5px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  cursor: text;
  border: 1px solid var(--accent-color);
  border-radius: var(--border-radius);
}

.selectedItems {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 0;
}

.editableInput {
  flex: 1;
  min-width: 50px;
  outline: none;
  border: none;
}

.editableInput[data-placeholder]:empty:before {
  content: attr(data-placeholder);
  color: var(--accent-color);
}

.inputLabel {
  color: var(--main-text-color);
}

.inputLabelMark {
  color: var(--error-color);
  font-weight: 900;
}
</style>
