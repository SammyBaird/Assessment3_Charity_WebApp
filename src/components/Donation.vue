<template>
  <div class="donation-form">
    <h2>Make a Donation</h2>
    <form @submit.prevent="submitDonation">
      <div>
        <label for="donorName">Name:</label>
        <input id="donorName" v-model="donation.name" required />
      </div>
      <div>
        <label for="amount">Amount:</label>
        <input id="amount" type="number" v-model="donation.amount" required />
      </div>
      <button type="submit">Donate</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'DonationForm',
  data() {
    return {
      donation: {
        name: '',
        amount: 0,
      },
    }
  },
  methods: {
    submitDonation() {
      console.log('Donation submitted:', this.donation)
      alert('Thank you for your donation!')
    },
  },
}
</script>

<style scoped>
.donation-form {
  background-color: rgb(71, 146, 189);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  color: black;
}

.donation-form h2 {
  margin-bottom: 1rem;
}

.donation-form div {
  margin-bottom: 1rem;
}

.donation-form label {
  display: block;
  margin-bottom: 0.5rem;
}

.donation-form input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.donation-form button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.donation-form button:hover {
  background-color: #0056b3;
}
</style>
