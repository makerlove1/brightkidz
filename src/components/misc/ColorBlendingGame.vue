<template>
  <NavPage>
    <LinkTile
      :title="t('memory')"
      nav-path="/memory"
      src="/img/games/MemoryBackface.png"
      :alt="t('memoryAlt')"
    />
    <LinkTile
      :title="t('dragdrop')"
      nav-path="/dragdrop"
      src="/img/games/DD.png"
      :alt="t('dragdropAlt')"
    />
    <LinkTile
      :title="t('misc')"
      nav-path="/misc"
      src="/img/games/Calculate.png"
      :alt="t('miscAlt')"
    />
  </NavPage>
</template>

<script>
import NavPage from "./NavPage.vue";
import LinkTile from "./LinkTile.vue";
import languageManager from "@/utils/LanguageManager";

export default {
  name: "Home",
  components: { LinkTile, NavPage },
  props: {
    msg: String,
  },
  data() {
    return {
      currentLanguage: languageManager.currentLanguage || 'en',
      unsubscribe: null
    };
  },
  mounted() {
    // Subscribe to language changes
    this.unsubscribe = languageManager.subscribe(() => {
      this.currentLanguage = languageManager.getLanguage();
      this.$forceUpdate(); // Force re-render when language changes
    });
  },
  beforeUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  methods: {
    t(key) {
      return languageManager.translate(key);
    }
  }
};
</script>

<style scoped></style>
