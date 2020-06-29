<template>
  <a-menu
    :v-model="selected"
    :default-selected-keys="selected"
    mode="horizontal"
    theme="dark"
  >
    <a-menu-item key="new">
      <nuxt-link to="/">
        <a-icon type="plus-circle" />New secret
      </nuxt-link>
    </a-menu-item>
    <a-menu-item key="view">
      <nuxt-link to="/get-secret/">
        <a-icon type="eye" />View secret
      </nuxt-link>
    </a-menu-item>
  </a-menu>
</template>

<script>
export default {
  props: {
    selected: {
      type: Array,
      required: true
    }
  }
}
</script>
