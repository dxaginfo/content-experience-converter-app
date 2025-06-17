<template>
  <div class="engagement-optimize-view">
    <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6">
      <div class="page-header mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Engagement Optimizer</h1>
        <p class="mt-2 text-lg text-gray-600">Analyze and improve your content's engagement metrics with data-driven recommendations.</p>
      </div>
      
      <EngagementOptimizer />
    </div>
  </div>
</template>

<script setup>
import EngagementOptimizer from '../components/EngagementOptimizer.vue';
</script>