<template>
  <a-row>
    <a-col :xs="{span: 22, offset: 1}" :md="{span: 8, offset: 8}">
      <a-form-model
        ref="formNewSecret"
        layout="vertical"
        :model="form"
        :rules="rules"
      >
        <a-form-model-item label="Secret" prop="secret" data-qa="a-form-model-item.secret">
          <a-textarea
            v-model="form.secret"
          />
        </a-form-model-item>

        <a-form-model-item label="TTL in minutes (0 = no expiration)" prop="expireAfter" data-qa="a-form-model-item.expireAfter">
          <a-input
            v-model.number="form.expireAfter"
          />
        </a-form-model-item>
        <a-form-model-item label="How many views are allowed" prop="expireAfterViews" data-qa="a-form-model-item.expireAfterViews">
          <a-input
            v-model.number="form.expireAfterViews "
          />
        </a-form-model-item>
        <a-form-model-item align="middle">
          <a-button type="primary" @click="onSubmit">
            Create secret
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-col>
  </a-row>
</template>

<script>

export default {
  props: {
    secret: {
      type: String,
      default: ''
    },
    expireAfterViews: {
      type: Number,
      default: 2
    },
    expireAfter: {
      type: Number,
      default: 10
    },
    validateOnInit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {
        secret: this.secret,
        expireAfterViews: this.expireAfterViews,
        expireAfter: this.expireAfter
      },
      rules: {
        secret: [
          {
            required: true,
            message: 'Please enter a secret',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 1,
            message: 'Please enter a secret',
            trigger: 'blur'
          }
        ],
        expireAfterViews: [{
          required: true,
          message: 'Please enter, how many views are allowed',
          trigger: 'blur'
        },
        {
          type: 'integer',
          min: 1,
          message: 'You should allow at least one view',
          trigger: 'blur'
        }],
        expireAfter: [{
          required: true,
          message: 'Please enter the TTL in minutes or 0',
          trigger: 'change'
        },
        {
          type: 'number',
          min: 0,
          message: 'You should enter the TTL in minutes or you can set it to 0',
          trigger: 'change'
        }]
      }
    }
  },
  mounted () {
    if (this.validateOnInit) {
      this.$refs.formNewSecret.validate((valid) => {})
    }
  },
  methods: {
    onSubmit () {
      this.$refs.formNewSecret.validate((valid) => {
        if (valid) {
          this.$emit('onSubmit', Object.assign({}, this.form))
        } else {
          return false
        }
      })
    }
  }
}
</script>
