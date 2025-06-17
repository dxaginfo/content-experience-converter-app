<template>
  <div class="dashboard-view">
    <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6">
      <div class="welcome-banner bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 mb-8 text-white shadow-lg">
        <h1 class="text-3xl font-bold mb-2">Welcome to Content-to-Experience Converter</h1>
        <p class="text-xl opacity-90 mb-4">Transform your static content into engaging interactive experiences</p>
        <div class="flex space-x-4 mt-2">
          <router-link to="/transform" class="inline-block px-5 py-3 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors">
            Start New Project
          </router-link>
          <button class="inline-block px-5 py-3 border border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
            Watch Tutorial
          </button>
        </div>
      </div>
      
      <!-- Core Features -->
      <div class="mb-10">
        <h2 class="text-2xl font-semibold mb-6">Core Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="feature-card bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div class="feature-icon mb-4 text-blue-600">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium mb-2">Content Transformation</h3>
            <p class="text-gray-600 mb-4">Convert static text, images, and media into interactive elements that boost engagement.</p>
            <router-link to="/transform" class="text-blue-600 hover:text-blue-800 font-medium">Start Transforming →</router-link>
          </div>
          
          <div class="feature-card bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div class="feature-icon mb-4 text-blue-600">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium mb-2">Consistency Checker</h3>
            <p class="text-gray-600 mb-4">Ensure your content looks and functions perfectly across all platforms and devices.</p>
            <router-link to="/consistency" class="text-blue-600 hover:text-blue-800 font-medium">Check Consistency →</router-link>
          </div>
          
          <div class="feature-card bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div class="feature-icon mb-4 text-blue-600">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium mb-2">Engagement Optimizer</h3>
            <p class="text-gray-600 mb-4">Analyze and improve your content's performance with data-driven recommendations.</p>
            <router-link to="/optimize" class="text-blue-600 hover:text-blue-800 font-medium">Optimize Engagement →</router-link>
          </div>
        </div>
      </div>
      
      <!-- Recent Projects -->
      <div class="mb-10">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold">Recent Projects</h2>
          <router-link to="/projects" class="text-blue-600 hover:text-blue-800 font-medium">View All Projects →</router-link>
        </div>
        
        <div v-if="recentProjects.length === 0" class="bg-white rounded-lg shadow-md p-8 text-center">
          <div class="empty-projects-icon text-gray-400 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium mb-2">No projects yet</h3>
          <p class="text-gray-600 mb-4">Start by creating a new project to transform your content.</p>
          <router-link to="/transform" class="inline-block px-5 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Create First Project
          </router-link>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="project in recentProjects" :key="project.id" class="project-card bg-white rounded-lg shadow-md overflow-hidden">
            <div class="project-preview h-40 bg-gray-100 relative">
              <img v-if="project.thumbnail" :src="project.thumbnail" alt="Project thumbnail" class="w-full h-full object-cover">
              <div v-else class="flex items-center justify-center h-full text-gray-400">
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-medium">{{ project.name }}</h3>
                <span class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{{ project.type }}</span>
              </div>
              <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ project.description }}</p>
              <div class="flex justify-between items-center">
                <span class="text-xs text-gray-500">Updated {{ formatDate(project.updatedAt) }}</span>
                <button class="text-blue-600 hover:text-blue-800">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Quick Stats -->
      <div>
        <h2 class="text-2xl font-semibold mb-6">Quick Stats</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="stat-card bg-white rounded-lg shadow-md p-4 flex items-center">
            <div class="stat-icon mr-4 p-3 rounded-lg bg-blue-100 text-blue-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div>
              <div class="text-gray-500 text-sm">Total Projects</div>
              <div class="text-2xl font-semibold">{{ stats.totalProjects }}</div>
            </div>
          </div>
          
          <div class="stat-card bg-white rounded-lg shadow-md p-4 flex items-center">
            <div class="stat-icon mr-4 p-3 rounded-lg bg-green-100 text-green-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div>
              <div class="text-gray-500 text-sm">Avg. Engagement</div>
              <div class="text-2xl font-semibold">{{ stats.avgEngagement }}%</div>
            </div>
          </div>
          
          <div class="stat-card bg-white rounded-lg shadow-md p-4 flex items-center">
            <div class="stat-icon mr-4 p-3 rounded-lg bg-purple-100 text-purple-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <div class="text-gray-500 text-sm">This Month</div>
              <div class="text-2xl font-semibold">{{ stats.thisMonth }}</div>
            </div>
          </div>
          
          <div class="stat-card bg-white rounded-lg shadow-md p-4 flex items-center">
            <div class="stat-icon mr-4 p-3 rounded-lg bg-yellow-100 text-yellow-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
              </svg>
            </div>
            <div>
              <div class="text-gray-500 text-sm">Platforms</div>
              <div class="text-2xl font-semibold">{{ stats.platforms }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Mock data for demo
const recentProjects = ref([
  {
    id: 'proj1',
    name: 'Product Landing Page',
    type: 'Website',
    description: 'Interactive product landing page with 3D product viewer and feature showcase.',
    updatedAt: '2025-06-15T10:30:00Z',
    thumbnail: null
  },
  {
    id: 'proj2',
    name: 'Email Newsletter',
    type: 'Email',
    description: 'Monthly newsletter with interactive polls and personalized content sections.',
    updatedAt: '2025-06-10T15:45:00Z',
    thumbnail: null
  },
  {
    id: 'proj3',
    name: 'Team Onboarding Guide',
    type: 'Documentation',
    description: 'Interactive onboarding guide with progress tracking and knowledge checks.',
    updatedAt: '2025-06-05T09:15:00Z',
    thumbnail: null
  }
]);

const stats = ref({
  totalProjects: 7,
  avgEngagement: 68,
  thisMonth: 3,
  platforms: 4
});

// Methods
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};
</script>

<style scoped>
.dashboard-view {
  @apply bg-gray-50 min-h-screen;
}
</style>