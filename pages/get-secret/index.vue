<template>
  <div>
    <p-form-get-secret @onSubmit="onSubmit" />
  </div>
</template>

<script>
export default {
  methods: {
    onSubmit (formData) {
      this.$router.push('/get-secret/' + formData.hash)
    }
  }
}
</script>
