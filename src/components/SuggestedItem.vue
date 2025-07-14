<template>
  <li
    class="item"
    @click="$emit('select', item)"
    role="option"
    :aria-label="ariaLabel"
    tabindex="0"
    @keydown.enter="$emit('select', item)"
    @keydown.space.prevent="$emit('select', item)"
  >
    <div class="avatar">
      <img v-if="item.avatar" :src="item.avatar" :alt="avatarAlt" />
      <div v-else class="placeholder" aria-hidden="true"></div>
    </div>

    <div class="info">
      <div class="name">
        {{ displayName }}
      </div>
      <div v-if="isUser" class="alias">@{{ item.alias }}</div>
      <div v-if="isCompany" class="alias">компания</div>
    </div>
  </li>
</template>

<script>
export default {
  name: "SuggestedItem",
  props: {
    item: {
      type: Object,
      required: true,
      validator: (value) => {
        return value.alias && typeof value.alias === "string";
      },
    },
  },
  emits: ["select"],
  computed: {
    displayName() {
      return this.item.name || this.item.alias;
    },
    isUser() {
      return this.item.type === "user";
    },
    isCompany() {
      return this.item.type === "company";
    },
    avatarAlt() {
      return `Аватар ${this.displayName}`;
    },
    ariaLabel() {
      return `${this.displayName}, ${
        this.isUser ? "пользователь" : "компания"
      }`;
    },
  },
};
</script>

<style scoped>
.item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.item:hover {
  background-color: var(--hover-color);
}

.avatar {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(var(--hover-color), var(--focus-color));
  border-radius: 4px;
}

.info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.name {
  font-weight: 600;
  color: var(--main-text-color);
}

.alias {
  font-size: 0.85rem;
  color: var(--secondary-text-color);
}
</style>
