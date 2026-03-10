<template>
  <NavPage nav-back-path="/">
    <link-tile
      :title="t('quiz')"
      nav-path="/misc/quiz"
      src="/img/games/Quiz.png"
      :alt="t('quizAlt')"
    />
    <link-tile
      title="Zahlen 0-18"
      nav-path="/misc/numbers-0-to-18"
      src="/img/games/Calculate.png"
      alt="calculate with numbers from 0 to 18"
    />
    <link-tile
      :title="t('colorBlending')"
      nav-path="/misc/color-blending"
      src="/img/games/ColorBlending.svg"
      :alt="t('colorBlendingAlt')"
    />
    <link-tile
      :title="t('colorIdentification')"
      nav-path="/misc/color-identification"
      src="/img/games/ColorIdentification.svg"
      :alt="t('colorIdentificationAlt')"
    />
  </NavPage>
</template>

<script>
import NavPage from "../NavPage.vue";
import LinkTile from "../LinkTile.vue";
import translationMixin from "@/mixins/translationMixin";

export default {
  name: "MiscNavPage",
  components: { LinkTile, NavPage },
  mixins: [translationMixin]
};
</script>
<style scoped></style>
