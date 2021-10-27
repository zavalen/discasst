<template>
  <div>
    <ul class="error-messages">
      <li v-for="error in validationErrors" :key="error">
        {{ error }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'PdValidationErrors',
  props: {
    validationErrors: {
      type: Object,
      required: true,
    },
  },
  computed: {
    errorMessages() {
      return Object.keys(this.validationErrors).map((name) => {
        const messages = this.validationErrors[name].join(', ')
        return `${name} ${messages}`
      })
    },
  },
}
</script>