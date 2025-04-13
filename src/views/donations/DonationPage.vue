<script>
import Donation from '../../components/DonationForm.vue'
export default {
  name: 'DonationPage',
  components: {
    Donation,
  },
}
</script>

<template>
  <div class="container my-5">
    <div class="text-left mb-5">
      <h1 class="text-primary mb-3">Support Our Cause</h1>
      <p class="lead">
        Your donation is a beacon of hope that helps us build a brighter future for those in need.
      </p>
    </div>

    <div class="row">
      <div class="col-md-6 mb-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <h2 class="card-title text-primary mb-3">How Your Donation Helps</h2>
            <p>Welcome to the Donation Page! Your contributions make a huge difference.</p>
            <p>
              Every donation helps us support those in need and create a better future. Your
              generosity enables us to provide essential resources and fund important initiatives,
              such as:
            </p>
            <ul>
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
        </div>
      </div>
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-body">
            <Donation />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
