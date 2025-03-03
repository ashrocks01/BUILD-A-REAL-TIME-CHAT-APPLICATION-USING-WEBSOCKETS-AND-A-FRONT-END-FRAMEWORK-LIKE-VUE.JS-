<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { io } from "socket.io-client";
import EmojiPicker from "vue3-emoji-picker";
import { Send, Smile } from "lucide-vue-next";

// Use `defineComponent` to type-check the component's props
const socket = io("http://localhost:5000");

// Messages as an array of objects with specific types
const messages = ref<{ id: string; text: string; sender: string }[]>([]);
const newMessage = ref<string>("");
const userId = ref<string>(Date.now().toString()); // Unique ID for each user
const userName = ref<string>("User1"); // Sender's name (could be dynamic)


// Emoji Picker visibility
const showEmojiPicker = ref(false);

// Set up socket event listeners
onMounted(() => {
  socket.on("chatHistory", (history) => {
    messages.value = history;
  });

  socket.on("receiveMessage", (message) => {
    messages.value.push(message);
  });
});

onUnmounted(() => {
  socket.off("chatHistory");
  socket.off("receiveMessage");
});

// Send message to the server
const sendMessage = () => {
  if (newMessage.value.trim()) {
    const message = {
      id: Date.now().toString(),
      text: newMessage.value,
      sender: userId.value,
      senderName: userName.value,
    };
    socket.emit("sendMessage", message);
    newMessage.value = "";
  }
};

// Insert emoji into input field
const addEmoji = (emoji) => {
  newMessage.value += emoji.i; // Append selected emoji
  showEmojiPicker.value = false; // Close picker after selection
};
</script>

<template>
  <div class="chat-container">
    <h1>Vue Chat App</h1>
    <div class="messages">
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="['message', msg.sender === userId ? 'sender' : 'receiver']"
      >
        <p>{{ msg.text }}</p>
      </div>
    </div>

    <!-- Chat Input with Emoji Inside Placeholder -->
    <div class="input-container">
      <!-- Emoji Button Inside Input -->
      <button @click="showEmojiPicker = !showEmojiPicker" class="emoji-button">😊</button>

      <!-- Message Input -->
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message..." />

      <!-- Send Button with Arrow Icon -->
      <button @click="sendMessage" class="send-button">
        <Send size="22" />
      </button>
      
      <!-- Floating Emoji Picker -->
      <div v-if="showEmojiPicker" class="emoji-picker">
        <EmojiPicker @select="addEmoji" />
      </div>
    

    </div>
  </div>

  
  
</template>

<style scoped>
/* Styling for the chat application */
.chat-container {
  display: flex;
  flex-direction: column;
  max-width: 900px;
  width:450px;
  margin: 20px auto;
  padding: 20px;
 border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  background-color: #f9f9f9;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.messages {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  margin-bottom: 20px;
  padding: 10px;
  height: 300px;
  border-bottom: 1px solid #ddd;
  scroll-behavior: smooth; 
}

.message {
  max-width: 70%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  word-wrap: break-word;
  font-size: 14px;
}

.sender {
  background-color: #4caf50;
  color: white;
  align-self: flex-end;
}

.receiver {
  background-color: #f1f1f1;
  color: black;
  align-self: flex-start;
}

.input-area {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

input {
  width: 78%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

/* Emoji Button */
.emoji-button {
  background: transparent;
  border: none;
  font-size: 23px;
  cursor: pointer;
  padding: 3px;
}

button {
  
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 5px;
  margin-left: 10px;
  align-items:center;
  margin-top: 5px;
}

button:hover {
  background-color: #0056b3;
}

button:active {
  background-color: #004080;
}


</style>
