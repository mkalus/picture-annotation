<template>
  <form class="pa-annotation-form" @submit.prevent="submitted">
    <label :for="containerId + '-title'">{{ $t('annotation_title') }}</label>
    <input type="text" name="title" :id="containerId + '-title'" v-model="title">
    <label :for="containerId + '-text'">{{ $t('annotation_text') }}</label>
    <textarea name="text" :id="containerId + '-text'" v-model="text" />
    <label :for="containerId + '-link-title'">{{ $t('annotation_link_title') }}</label>
    <input type="text" name="link-title" :id="containerId + '-link-title'" v-model="linkTitle">
    <label :for="containerId + '-link'">{{ $t('annotation_link') }}</label>
    <input type="text" name="link" :id="containerId + '-link'" v-model="link">
    <button type="submit">{{ $t('submit') }}</button>
  </form>
</template>

<script>
export default {
  props: ['value', 'containerId'],
  data () {
    return {
      title: '',
      text: '',
      linkTitle: '',
      link: ''
    };
  },
  mounted () {
    console.log(this.title);
    // this.title = this.model.title;
    // this.text = this.model.text;
    // this.linkTitle = this.model.linkTitle;
    // this.link = this.model.link;
  },
  methods: {
    submitted () {
      /* this.model.data = {
        title: this.title,
        text: this.text,
        linkTitle: this.linkTitle,
        link: this.link
      }; */

      this.$emit('annotation-finished');
    }
  }
};
</script>

<style lang="sass">
.pa-annotation-form
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif
  display: grid
  grid-template-columns: auto 1fr
  grid-gap: 1em

  label
    grid-column: 1 / 2
    text-align: right

  button
    grid-column: 2 / 3
    background: lightgrey
    padding: 0.7em
    border: 0

    &:hover
      background: gold

  input, textarea
    grid-column: 2 / 3
    background: #fff
    border: 1px solid #9c9c9c

    &:focus
      outline: 3px solid gold

  textarea
    height: 10em
</style>
