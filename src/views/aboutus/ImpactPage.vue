<script>
import RefugeeSupportMap from '../../components/RefugeeSupportMap.vue'

export default {
  name: 'ImpactPage',
  components: {
    RefugeeSupportMap,
  },
}
</script>

<!-- Bootstrap for Responsivness -->
<template>
  <div class="impact-page container">
    <h1 class="text-primary my-4">Our Impact</h1>
    <p class="lead"></p>
    <div class="my-4">
      <h2 class="h5">Where Our Refugees Come From</h2>
      <p>
        We are proud to support refugees from diverse regions around the world. Many of the
        individuals we assist come from areas affected by conflict, including Syria, Afghanistan,
        South Sudan, Myanmar, and Venezuela. Each story is unique, and we are committed to providing
        the resources and support needed to help them rebuild their lives.
      </p>
      <figure>
        <RefugeeSupportMap />
        <figcaption class="text-center mt-2">
          <em
            >Figure: Map showing the countries and regions from which our supported refugees
            originate</em
          >
        </figcaption>
      </figure>
    </div>
    <div class="my-4"></div>
  </div>
</template>

<style scoped></style>
