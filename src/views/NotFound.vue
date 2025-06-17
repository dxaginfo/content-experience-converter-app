<template>
  <div class="not-found-view">
    <div class="max-w-7xl mx-auto px-4 py-16 sm:px-6 text-center">
      <svg class="w-24 h-24 mx-auto text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <h1 class="text-5xl font-bold text-gray-900 mb-4">404</h1>
      <h2 class="text-2xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
      <p class="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div class="space-x-4">
        <router-link to="/" class="inline-block px-5 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
          Go to Dashboard
        </router-link>
        <button @click="goBack" class="inline-block px-5 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>