<template>
  <div class="content">
    <Header :nav-back-path="navBackPath">
    </Header>
    <div class="link-area">
      <slot></slot>
    </div>
    <div>
      <Footer
        :previous-level-disabled="true"
        :next-level-disabled="true"
        :game-switches-hidden="true"
      />
    </div>
  </div>
</template>

<script>
import Header from "./Header";
import Footer from "@/components/Footer.vue";

export default {
  name: "NavPage",
  components: { Footer, Header },
  props: ["navBackPath"],
};
</script>

<style scoped>
.link-area {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  justify-content: center;
  position: relative;
  max-width: 100%;
  padding-bottom: 12px;
  overflow-y: auto;
}

/* ensure full-height content plays nicely on mobile */
@media (max-width: 768px) {
  .link-area {
    gap: 12px;
    grid-template-columns: 1fr;
    padding: 8px 0;
  }
}
</style>
