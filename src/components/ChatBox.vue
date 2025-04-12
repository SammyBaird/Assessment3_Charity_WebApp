<script setup>
import { ref } from 'vue'
import axios from 'axios'

// Cloud function location using Deepseek for text generation!
const HF_CHATBOT_URL = 'https://us-central1-assess-3-charity.cloudfunctions.net/hfChatbot'

const messages = ref([{ sender: 'bot', text: 'Hi, how can I help you today?' }])
const newMessage = ref('')
const isOpen = ref(false)

// Toggle Chatbox window
function toggleChat() {
  isOpen.value = !isOpen.value
  console.log('Chat toggled. isOpen:', isOpen.value)
}

// Send message to the chatbot
async function sendMessage() {
  if (!newMessage.value.trim()) return

  messages.value.push({ sender: 'user', text: newMessage.value })

  // Call Cloud Function to get the chatbot response
  try {
    const response = await axios.post(HF_CHATBOT_URL, { prompt: newMessage.value })
    messages.value.push({ sender: 'bot', text: response.data.reply || response.data })
  } catch (error) {
    console.error('Error calling Hugging Face API:', error)
    messages.value.push({ sender: 'bot', text: 'Sorry, something went wrong with the chat!' })
  }

  //Clear input
  newMessage.value = ''
}
</script>

<!-- Tooggle Chat box window -->
<template>
  <div class="chatbox-container">
    <button @click="toggleChat" class="btn btn-primary">
      {{ isOpen ? 'Close Chat' : 'Open Chat' }}
    </button>

    <div
      v-if="isOpen"
      class="chatbox-window border rounded p-3"
      style="max-width: 400px; position: fixed; bottom: 20px; right: 20px; background: white"
    >
      <div class="close-btn" style="text-align: right; margin-bottom: 0.5rem">
        <button @click="toggleChat" class="btn btn-sm btn-primary">Close Chat</button>
      </div>

      <div class="chatbox-messages mb-2" style="max-height: 400px; overflow-y: auto">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="msg.sender === 'user' ? 'text-end' : 'text-start'"
        >
          <p
            :class="
              msg.sender === 'bot' ? 'bg-light rounded p-1' : 'bg-primary text-white rounded p-1'
            "
          >
            {{ msg.text }}
          </p>
        </div>
      </div>

      <div class="input-group">
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          type="text"
          class="form-control"
          placeholder="Type your message here..."
        />
        <button @click="sendMessage" class="btn btn-secondary">Send</button>
      </div>
    </div>
  </div>
</template>

<!-- Cleaned up the look of Chatbox -->
<style scoped>
.chatbox-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
}

.chatbox-messages p {
  display: inline-block;
  max-width: 80%;
  padding: 0.5rem;
  border-radius: 0.5rem;
  margin: 0.25rem;
}

.bg-light {
  background-color: #f8f9fa;
}

.bg-primary {
  background-color: #0d6efd;
  color: white;
}
</style>
