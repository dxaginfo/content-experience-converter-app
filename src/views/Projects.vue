<template>
  <div class="projects-view">
    <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6">
      <div class="page-header mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Projects</h1>
          <p class="mt-2 text-lg text-gray-600">Manage and organize all your interactive content projects.</p>
        </div>
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          New Project
        </button>
      </div>
      
      <!-- Project Filters -->
      <div class="filters bg-white rounded-lg shadow-md p-4 mb-6">
        <div class="flex flex-wrap items-center gap-4">
          <div class="search-filter flex-grow">
            <div class="relative">
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Search projects..." 
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div class="type-filter">
            <select 
              v-model="typeFilter" 
              class="border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
            >
              <option value="">All Types</option>
              <option value="website">Website</option>
              <option value="email">Email</option>
              <option value="documentation">Documentation</option>
              <option value="social">Social Media</option>
            </select>
          </div>
          
          <div class="date-filter">
            <select 
              v-model="dateFilter" 
              class="border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          
          <div class="view-toggle ml-auto">
            <div class="flex border border-gray-300 rounded-md overflow-hidden">
              <button 
                @click="viewMode = 'grid'" 
                class="px-3 py-2" 
                :class="viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-500'"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
              </button>
              <button 
                @click="viewMode = 'list'" 
                class="px-3 py-2" 
                :class="viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-500'"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Projects Grid View -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="project in filteredProjects" :key="project.id" class="project-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div class="project-preview h-40 bg-gray-100 relative">
            <img v-if="project.thumbnail" :src="project.thumbnail" alt="Project thumbnail" class="w-full h-full object-cover">
            <div v-else class="flex items-center justify-center h-full text-gray-400">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div class="absolute top-2 right-2">
              <button class="p-1 bg-white rounded-full shadow hover:bg-gray-100">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="p-4">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-medium">{{ project.name }}</h3>
              <span class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{{ project.type }}</span>
            </div>
            <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ project.description }}</p>
            <div class="flex justify-between items-center mt-4">
              <span class="text-xs text-gray-500">Updated {{ formatDate(project.updatedAt) }}</span>
              <div class="flex space-x-2">
                <button class="text-blue-600 hover:text-blue-800 p-1">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                </button>
                <button class="text-blue-600 hover:text-blue-800 p-1">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Projects List View -->
      <div v-else-if="viewMode === 'list'" class="bg-white rounded-lg shadow-md overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="project in filteredProjects" :key="project.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                    <svg v-if="!project.thumbnail" class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <img v-else :src="project.thumbnail" alt="" class="h-10 w-10 rounded-md object-cover">
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ project.name }}</div>
                    <div class="text-sm text-gray-500 truncate max-w-xs">{{ project.description }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {{ project.type }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(project.updatedAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': project.status === 'published',
                    'bg-yellow-100 text-yellow-800': project.status === 'draft',
                    'bg-purple-100 text-purple-800': project.status === 'in-progress'
                  }"
                >
                  {{ project.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-3">
                  <button class="text-blue-600 hover:text-blue-900">Edit</button>
                  <button class="text-blue-600 hover:text-blue-900">Preview</button>
                  <button class="text-gray-600 hover:text-gray-900">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Empty State -->
      <div v-if="filteredProjects.length === 0" class="bg-white rounded-lg shadow-md p-8 text-center">
        <div class="empty-projects-icon text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium mb-2">No projects found</h3>
        <p class="text-gray-600 mb-4">
          <span v-if="isFiltering">Try adjusting your search or filters.</span>
          <span v-else>Start by creating a new project to transform your content.</span>
        </p>
        <button v-if="!isFiltering" class="inline-block px-5 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
          Create First Project
        </button>
        <button v-else @click="clearFilters" class="inline-block px-5 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
          Clear Filters
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Data
const viewMode = ref('grid');
const searchQuery = ref('');
const typeFilter = ref('');
const dateFilter = ref('');

// Mock data
const projects = ref([
  {
    id: 'proj1',
    name: 'Product Landing Page',
    type: 'Website',
    description: 'Interactive product landing page with 3D product viewer and feature showcase.',
    updatedAt: '2025-06-15T10:30:00Z',
    thumbnail: null,
    status: 'published'
  },
  {
    id: 'proj2',
    name: 'Email Newsletter',
    type: 'Email',
    description: 'Monthly newsletter with interactive polls and personalized content sections.',
    updatedAt: '2025-06-10T15:45:00Z',
    thumbnail: null,
    status: 'draft'
  },
  {
    id: 'proj3',
    name: 'Team Onboarding Guide',
    type: 'Documentation',
    description: 'Interactive onboarding guide with progress tracking and knowledge checks.',
    updatedAt: '2025-06-05T09:15:00Z',
    thumbnail: null,
    status: 'in-progress'
  },
  {
    id: 'proj4',
    name: 'Social Media Campaign',
    type: 'Social',
    description: 'Interactive social media posts with micro-interactions and animations.',
    updatedAt: '2025-05-28T14:20:00Z',
    thumbnail: null,
    status: 'published'
  },
  {
    id: 'proj5',
    name: 'Product Features Showcase',
    type: 'Website',
    description: 'Interactive showcase of product features with demos and examples.',
    updatedAt: '2025-05-20T11:10:00Z',
    thumbnail: null,
    status: 'draft'
  }
]);

// Computed
const filteredProjects = computed(() => {
  let result = [...projects.value];
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(project => 
      project.name.toLowerCase().includes(query) || 
      project.description.toLowerCase().includes(query)
    );
  }
  
  // Type filter
  if (typeFilter.value) {
    result = result.filter(project => 
      project.type.toLowerCase() === typeFilter.value.toLowerCase()
    );
  }
  
  // Date filter
  if (dateFilter.value) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    
    result = result.filter(project => {
      const updatedDate = new Date(project.updatedAt);
      
      if (dateFilter.value === 'today') {
        return updatedDate >= today;
      } else if (dateFilter.value === 'week') {
        return updatedDate >= startOfWeek;
      } else if (dateFilter.value === 'month') {
        return updatedDate >= startOfMonth;
      } else if (dateFilter.value === 'year') {
        return updatedDate >= startOfYear;
      }
      
      return true;
    });
  }
  
  return result;
});

const isFiltering = computed(() => {
  return searchQuery.value !== '' || typeFilter.value !== '' || dateFilter.value !== '';
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

const clearFilters = () => {
  searchQuery.value = '';
  typeFilter.value = '';
  dateFilter.value = '';
};
</script>