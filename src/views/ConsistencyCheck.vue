<template>
  <div class="consistency-check-view">
    <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6">
      <div class="page-header mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Consistency Checker</h1>
        <p class="mt-2 text-lg text-gray-600">Ensure your content works perfectly across all platforms and devices.</p>
      </div>
      
      <ConsistencyChecker />
    </div>
  </div>
</template>

<script setup>
import ConsistencyChecker from '../components/ConsistencyChecker.vue';
</script>