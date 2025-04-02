<script>
import Donation from '../components/Donation.vue'
export default {
  name: 'DonationPage',
  components: {
    Donation,
  },
}
</script>

<template>
  <div>
    <h1>Donation Page</h1>
    <p>Welcome to the Donation Page!</p>
    <Donation />
  </div>
</template>

<style scoped>
.donation-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #c50000;
}
</style>
