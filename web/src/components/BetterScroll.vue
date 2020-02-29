<!--  -->
<template>
  <div class="wrapper" ref="wrapper">
    <div class="content" ref="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";

export default {
  name: "BScroll",
  data() {
    return {
      scroll: null
    };
  },
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    },
    click: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.initScroll();
  },
  methods: {
    initScroll() {
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.wrapper, {
            probeType: this.probeType,
            click: this.click,
            pullUpLoad: this.pullUpLoad
          });
          if (this.probeType === 2 || this.probeType === 3) {
            this.scroll.on("scroll", position => {
              this.$emit("scroll", position);
            });
          }
          if (this.pullUpLoad) {
            this.scroll.on("pullingUp", () => {
              this.$emit("pullingUp");
            });
          }
        } else {
          this.scroll.refresh();
        }
      });
    },
    scrollTo(x, y, time = 300) {
      this.scroll && this.scroll.scrollTo(x, y, time);
    },
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp();
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    scrollToElement(el, time = 300) {
      this.scroll && this.scroll.scrollToElement(el, time)
    }
  }
};
</script>

<style scoped></style>
