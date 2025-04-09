<template>
  <div class="sponsorship-page">
    <h1>Refugee Sponsorship Program</h1>
    <p>
      Join us in making a difference by sponsoring refugees in need. Your support can help provide
      housing, education, and essential services to those seeking a new start in Australia.
    </p>
    <p>
      Together, we can create a brighter future for individuals and families who have faced
      unimaginable challenges. Every contribution counts.
    </p>
    <button @click="navigateToDonate">Sponsor Now</button>
  </div>
</template>

<script>
export default {
  name: 'SponsorshipPage',
  methods: {
    navigateToDonate() {
      this.$router.push('/donate')
    },
  },
}
</script>

<style scoped>
.sponsorship-page {
  text-align: center;
  padding: 2rem;
  color: #000000;
}

p {
  color: #000000;
}
</style>
