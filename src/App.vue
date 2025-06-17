<template>
  <div class="app bg-gray-50 min-h-screen">
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center">
        <div class="flex items-center">
          <div class="logo text-blue-600 font-bold text-xl mr-10">
            Content-to-Experience Converter
          </div>
          <nav class="hidden md:flex space-x-8">
            <router-link 
              v-for="item in navigation" 
              :key="item.name" 
              :to="item.href" 
              class="nav-link text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              :class="{ 'text-blue-600 border-b-2 border-blue-600': isCurrentRoute(item.href) }"
            >
              {{ item.name }}
            </router-link>
          </nav>
        </div>
        <div class="flex items-center space-x-4">
          <button class="text-gray-700 hover:text-blue-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
            </svg>
          </button>
          <button class="text-gray-700 hover:text-blue-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
            </svg>
          </button>
          <button class="text-gray-700 hover:text-blue-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <main>
      <router-view></router-view>
    </main>

    <footer class="bg-white border-t border-gray-200 mt-10">
      <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <div class="text-gray-600 text-sm">
              &copy; 2025 Content-to-Experience Converter. All rights reserved.
            </div>
          </div>
          <div class="flex space-x-6">
            <a href="#" class="text-gray-600 hover:text-blue-600">
              <span class="sr-only">Documentation</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 4.5v15m6-15v15M4.5 9h15m-15 6h15"></path>
              </svg>
            </a>
            <a href="#" class="text-gray-600 hover:text-blue-600">
              <span class="sr-only">GitHub</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Content Transformer', href: '/transform' },
  { name: 'Consistency Checker', href: '/consistency' },
  { name: 'Engagement Optimizer', href: '/optimize' },
  { name: 'Projects', href: '/projects' },
];

const isCurrentRoute = (path) => {
  return route.path === path;
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
}
</style>