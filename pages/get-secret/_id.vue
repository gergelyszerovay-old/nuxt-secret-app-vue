<template>
  <div v-if="$fetchState.pending">
    Fetching data #{{ $route.params.id }}...
  </div>
  <div v-else>
    <p-form-get-secret
      :hash="hash"
      @onSubmit="onSubmit"
    />
    <p-show-secret
      v-if="secret.title"
      :title="secret.title"
      :created-at="secret.createdAt"
      :expires-at="secret.expiresAt"
      :hash="secret.hash"
      :remaining-views="secret.remainingViews"
      :secret-text="secret.secretText"
    />
  </div>
</template>

<script>
export default {
  async fetch () {
    try {
      const responseData = await this.$http.$get(`/api/secret/${this.$route.params.id}`)

      this.secret = Object.assign({}, {
        createdAt: this.$moment.unix(responseData.createdAt),
        expiresAt: this.$moment.unix(responseData.expiresAt),
        hash: responseData.hash,
        remainingViews: responseData.remainingViews,
        secretText: responseData.secretText,
        title: 'Secret details'
      })
    } catch (e) {
      this.secret = Object.assign({}, { title: '' })
      if (e.response) {
        if (e.response.status !== 200) {
          this.$message.error(e.response.data.message)
          return
        }
      }
      this.$message.error('Connection error')
    }
  },
  data () {
    return {
      secret: {},
      hash: this.$route.params.id
    }
  },
  methods: {
    onSubmit (formData) {
      this.$router.push('/get-secret/' + formData.hash)
    }
  }
}
</script>
