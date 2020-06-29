<template>
  <p-navigation :selected="[selected]" />
</template>

<script>
export default {
  data () {
    return {
      selected: 'new'
    }
  },
  created () {
    if ((this.$route.name === 'get-secret') || (this.$route.name === 'get-secret-id')) {
      this.selected = 'view'
    }
  }
}
</script>
