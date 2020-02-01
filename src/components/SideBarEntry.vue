<template>
  <div class="pa-side-bar-entry" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave"
       :class="{'is-selected-target': selectedShapeName === shape.name, 'is-hover-target': currentHoverShape === shape.name}">
    <h4 v-if="shape.annotation.title">{{shape.annotation.title}}</h4>

    <div v-if="shape.annotation.text"><nl2br tag="p" :text="shape.annotation.text"/></div>

    <a :href="shape.annotation.link" v-if="shape.annotation.link">{{shape.annotation.linkTitle || $t('more')}}</a>
  </div>
</template>

<script>
import Nl2br from 'vue-nl2br';

export default {
  components: {
    Nl2br
  },
  props: ['shape', 'editMode', 'selectedShapeName', 'currentHoverShape'],
  methods: {
    handleMouseEnter () {
      this.$emit('sidebar-entry-enter', this.shape.name);
    },
    handleMouseLeave () {
      this.$emit('sidebar-entry-leave', this.shape.name);
    }
  }
};
</script>

<style lang="sass">
.pa-side-bar-entry
  border: 1px solid #ccc
  border-radius: 5px
  padding: 5px
  margin-bottom: 5px

  &.is-hover-target
    border-color: #c00
    background-color: #efc4b0

  &.is-selected-target
    border-color: #c00
</style>
