<template>
  <a-row>
    <a-col :xs="{span: 22, offset: 1}" :md="{span: 16, offset: 4}">
      <a-descriptions :title="title" bordered :column="1">
        <a-descriptions-item label="Hash">
          <a :href="'/get-secret/' + hash" target="_blank">{{ hash }}</a>
        </a-descriptions-item>
        <a-descriptions-item label="Secret text">
          {{ secretText }}
        </a-descriptions-item>
        <a-descriptions-item v-if="expiresAt.unix() !== 0" label="Expiration date">
          {{ expiresAt | moment("YYYY-MM-DD HH:mm:ss") }}
        </a-descriptions-item>
        <a-descriptions-item v-else label="Expiration date">
          No expiration date
        </a-descriptions-item>
        <a-descriptions-item label="Remaining views">
          {{ remainingViews }}
        </a-descriptions-item>
        <a-descriptions-item label="Creation date">
          {{ createdAt | moment("YYYY-MM-DD HH:mm:ss") }}
        </a-descriptions-item>
      </a-descriptions>
    </a-col>
  </a-row>
</template>

<script>
// there is no 'this' in prop validators, so we use vueInstance to access the Vue instance
let vueInstance

export default {
  props: {
    title: {
      type: String,
      default: 'Secret'
    },
    hash: {
      type: String,
      default: ''
    },
    secretText: {
      type: String,
      default: ''
    },
    expiresAt: {
      type: Object,
      default () {
        return this.$moment()
      },
      validator (value) {
        return vueInstance.$moment.isMoment(value)
      }
    },
    remainingViews: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Object,
      default () {
        return this.$moment()
      },
      validator (value) {
        return vueInstance.$moment.isMoment(value)
      }
    }
  },
  beforeCreate () {
    vueInstance = this
  }
}
</script>
