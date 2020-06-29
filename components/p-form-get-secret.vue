<template>
  <a-row>
    <a-col :xs="{span: 22, offset: 1}" :md="{span: 8, offset: 8}">
      <a-form-model
        ref="formGetSecret"
        layout="vertical"
        :model="form"
        :rules="rules"
      >
        <a-form-model-item label="Hash" prop="hash">
          <a-input
            v-model="form.hash"
            allow-clear
          />
        </a-form-model-item>
        <a-form-model-item align="middle">
          <a-button type="primary" @click="onSubmit">
            Submit
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-col>
  </a-row>
</template>

<script>

export default {
  props: {
    hash: {
      type: String,
      default: ''
    },
    validateOnInit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {
        hash: this.hash
      },
      rules: {
        hash: [
          {
            required: true,
            message: 'Please enter a hash',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 64,
            max: 64,
            message: 'The hash should contain 64 characters',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted () {
    if (this.validateOnInit) {
      this.$refs.formGetSecret.validate((valid) => {})
    }
  },
  methods: {
    onSubmit () {
      this.$refs.formGetSecret.validate((valid) => {
        if (valid) {
          this.$emit('onSubmit', this.form)
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
  .ant-calendar-picker {
    width: 100%;
  }
</style>
