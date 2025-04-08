<script>
import MapTest from '../../components/MapTest.vue'
export default {
  name: 'ContactPage',
  components: {
    MapTest,
  },
}
</script>

<template>
  <div class="contact-page container my-5">
    <h1 class="mb-4 text-center">Contact Us</h1>
    <p class="lead text-center">
      If you have any questions or inquiries, feel free to reach out using the form below or through
      the provided contact information.
    </p>

    <form class="contact-form border p-4 rounded bg-light mb-4">
      <div class="mb-3">
        <label for="name" class="form-label">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Your Name"
          required
          class="form-control"
        />
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Your Email"
          required
          class="form-control"
        />
      </div>
      <div class="mb-3">
        <label for="message" class="form-label">Message:</label>
        <textarea
          id="message"
          name="message"
          placeholder="Your Message"
          rows="5"
          required
          class="form-control"
        ></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>

    <div class="contact-info mb-4">
      <h2 class="mb-3">Other Contact Information</h2>
      <p><strong>Email:</strong> contact@newhorizons.org</p>
      <p><strong>Phone:</strong> +1 (123) 456-7890</p>
      <!-- Using Monash Clayton as New Horizon HQ for Post -->
      <p><strong>Postal Address:</strong> Shop 4/21 Chancellors Walk, Clayton VIC 3168</p>
    </div>
    <div class="map-container">
      <h1 class="mb-4">Our Locations</h1>
      <MapTest />
    </div>
  </div>
</template>

<style scoped>
.contact-page {
  color: #000000;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.map-container {
  width: 100%;
  margin-top: 2rem;
}
p {
  color: #000000;
}
</style>
