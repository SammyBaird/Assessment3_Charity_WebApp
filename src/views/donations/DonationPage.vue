<script>
import Donation from '../../components/DonationForm.vue'
export default {
  name: 'DonationPage',
  components: {
    Donation,
  },
}
</script>

<!-- Need to fix this! -->
<template>
  <div class="container text-center my-5">
    <div class="row">
      <div class="col-md-6 text-left">
        <h1 class="mb-4">Donation Page</h1>
        <p class="lead">Welcome to the Donation Page! Your contributions make a huge difference.</p>
        <p>
          Every donation helps us support those in need and create a better future. Your generosity
          enables us to provide essential resources and fund important initiatives, such as:
        </p>
        <ul class="text-left" style="list-style-position: outside">
          <li>Providing food, clothing, and shelter to those who need it most</li>
          <li>Funding educational programs</li>
          <li>Supporting healthcare initiatives</li>
          <li>Driving community development projects</li>
        </ul>
        <p>
          Together, we can bring hope and positive change to countless lives. Thank you for your
          support!
        </p>
      </div>
      <div class="col-md-6">
        <Donation />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
