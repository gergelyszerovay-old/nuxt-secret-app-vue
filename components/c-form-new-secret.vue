<template>
  <div>
    <p-form-new-secret @onSubmit="onSubmit" />
    <p-show-secret
      v-if="newSecretData.title"
      :title="newSecretData.title"
      :created-at="newSecretData.createdAt"
      :expires-at="newSecretData.expiresAt"
      :hash="newSecretData.hash"
      :remaining-views="newSecretData.remainingViews"
      :secret-text="newSecretData.secretText"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      newSecretData: {}
    }
  },
  methods: {
    async onSubmit (formData) {
      try {
        const response = await this.$http.$post('/api/secret/', {
          secret: formData.secret,
          expireAfterViews: formData.expireAfterViews,
          expireAfter: formData.expireAfter
        })

        // we want to keep reactivity
        this.newSecretData = Object.assign({}, {
          createdAt: this.$moment.unix(response.createdAt),
          expiresAt: this.$moment.unix(response.expiresAt),
          hash: response.hash,
          remainingViews: response.remainingViews,
          secretText: response.secretText,
          title: 'New secret details'
        })
      } catch (e) {
        if (e.response) {
          if (e.response.status !== 200) {
            this.$message.error(e.response.data.message)
            return
          }
        }
        // console.log(e)
        this.$message.error('Connection error')
      }
    }
  }
}
</script>

<style>
</style>
