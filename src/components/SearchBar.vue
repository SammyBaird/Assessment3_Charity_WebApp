<template>
  <div class="searchbar">
    <input
      type="text"
      v-model="query"
      @keyup.enter="handleSearch"
      placeholder="Search our site..."
    />
    <button @click="handleSearch">Search</button>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  data() {
    return {
      query: '',
    }
  },
  methods: {
    handleSearch() {
      // Perform the search action
      console.log('Searching for:', this.query)
      // Need to add function to navigate to the search results
    },
  },
}
</script>

<style scoped>
.searchbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.searchbar input {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.searchbar button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #4792bd;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.searchbar button:hover {
  background-color: #2c3e50;
}
</style>
