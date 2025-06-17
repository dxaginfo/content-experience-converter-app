<template>
  <div class="app-container">
    <header class="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
      <div class="container mx-auto px-4 py-6">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-white">Content-to-Experience Converter</h1>
          </div>
          <nav>
            <ul class="flex space-x-6">
              <li><router-link to="/" class="text-white hover:text-indigo-200">Home</router-link></li>
              <li><router-link to="/editor" class="text-white hover:text-indigo-200">Editor</router-link></li>
              <li><router-link to="/templates" class="text-white hover:text-indigo-200">Templates</router-link></li>
              <li><router-link to="/analytics" class="text-white hover:text-indigo-200">Analytics</router-link></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-6">
      <router-view />
    </main>

    <footer class="bg-gray-800 text-white py-6">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <p>&copy; 2025 Content-to-Experience Converter</p>
          </div>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-300 hover:text-white">About</a>
            <a href="#" class="text-gray-300 hover:text-white">Privacy</a>
            <a href="#" class="text-gray-300 hover:text-white">Terms</a>
            <a href="#" class="text-gray-300 hover:text-white">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* Global styles */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}
</style>