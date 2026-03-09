<template>
  <div class="link-tile">
    <figure class="link-tile-box">
      <figcaption>
        <b>{{ title }}</b>
      </figcaption>
      <img
        @click="nav"
        :src="this.src"
        class="link-tile clickable-elements"
        :alt="alt"
      />
    </figure>
  </div>
</template>
<script>
export default {
  name: "LinkTile",
  props: ["navPath", "src", "alt", "title"],
  methods: {
    nav: function () {
      this.$router.push(this.navPath);
    },
  },
};
</script>

<style scoped lang="scss">
.link-tile figure {
  width: 100%;
  text-align: center;
  color: #ffffff;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.link-tile figcaption {
  padding: 6px 8px;
  font-size: 1.25rem;
  font-weight: 700;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.25);
  margin-bottom: 8px;
  width: 100%;
}

.link-tile {
  display: block;
  width: 100%;
  padding: 6px;
  box-sizing: border-box;
  max-width: 420px;
  margin: 0 auto;
}

.link-tile img {
  position: relative;
  width: 100%;
  height: auto;
  border-radius: 12px;
  padding: 4px;
  object-fit: cover;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  box-shadow: 0 6px 18px rgba(0,0,0,0.12);
}

.link-tile img:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
}

.link-tile img:active {
  transform: scale(0.98);
}

@media (max-width: 768px) {
  .link-tile {
    padding: 8px 6px;
    max-width: none;
  }

  .link-tile figcaption { font-size: 1.05rem; }
}
</style>
