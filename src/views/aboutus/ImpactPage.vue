<script>
import RefugeeSupportMap from '../../components/RefugeeSupportMap.vue'

export default {
  name: 'ImpactPage',
  components: {
    RefugeeSupportMap,
  },
}
</script>

<template>
  <div class="impact-page">
    <h1>Our Impact</h1>
    <p>Welcome to the About Us page! Learn more about our mission and values here.</p>
    Refugee Support Map
    <RefugeeSupportMap />
  </div>
</template>

<style scoped>
.impact-page {
  text-align: center;
  padding: 2rem;
  color: #000000;
  max-width: 1200px;
}

p {
  color: #000000;
}
</style>
