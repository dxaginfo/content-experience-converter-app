<template>
  <div class="consistency-checker">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left Panel: Input & Configuration -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-medium mb-4">Check Consistency</h3>
        
        <!-- Content Source Tabs -->
        <div class="mb-6">
          <div class="flex border-b border-gray-200">
            <button 
              v-for="tab in contentSourceTabs" 
              :key="tab.id"
              @click="activeSourceTab = tab.id"
              class="py-2 px-4 text-sm font-medium"
              :class="activeSourceTab === tab.id ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'"
            >
              {{ tab.name }}
            </button>
          </div>
        </div>
        
        <!-- URL Input Tab -->
        <div v-if="activeSourceTab === 'url'" class="source-tab-content">
          <div class="mb-4">
            <label for="content-url" class="block text-sm font-medium text-gray-700 mb-1">
              URL
            </label>
            <input 
              type="url" 
              id="content-url" 
              v-model="contentUrl"
              placeholder="https://example.com/page"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <!-- Project Input Tab -->
        <div v-if="activeSourceTab === 'project'" class="source-tab-content">
          <div class="mb-4">
            <label for="project-select" class="block text-sm font-medium text-gray-700 mb-1">
              Select Project
            </label>
            <select
              id="project-select"
              v-model="selectedProject"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a project...</option>
              <option v-for="project in projects" :key="project.id" :value="project.id">
                {{ project.name }}
              </option>
            </select>
          </div>
        </div>
        
        <!-- File Upload Tab -->
        <div v-if="activeSourceTab === 'file'" class="source-tab-content">
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Upload HTML File
            </label>
            <div 
              class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors cursor-pointer"
              @click="triggerFileInput"
              @dragover.prevent
              @drop.prevent="handleFileDrop"
            >
              <div class="space-y-1 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <div class="flex text-sm text-gray-600">
                  <label class="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                    <span>Upload a file</span>
                    <input 
                      ref="fileInput"
                      type="file" 
                      class="sr-only" 
                      @change="handleFileSelect"
                      accept=".html,.htm"
                    >
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs text-gray-500">
                  HTML files only (.html, .htm)
                </p>
              </div>
            </div>
          </div>
          
          <div v-if="uploadedFile" class="mb-4 p-3 bg-blue-50 rounded-md flex items-center">
            <svg class="h-6 w-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span class="text-sm text-gray-900 flex-grow truncate">{{ uploadedFile.name }}</span>
            <button @click="removeFile" class="text-gray-500 hover:text-gray-700">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Platform Selection -->
        <div class="platform-selection mb-6">
          <h4 class="text-sm font-medium text-gray-700 mb-2">
            Select Platforms to Check
          </h4>
          <div class="grid grid-cols-2 gap-2">
            <div v-for="(platform, index) in availablePlatforms" :key="index" class="platform-option">
              <label class="flex items-center p-3 border border-gray-200 rounded-md hover:border-blue-300 cursor-pointer transition-colors"
                :class="{ 'border-blue-500 bg-blue-50': selectedPlatforms.includes(platform.id) }"
              >
                <input 
                  type="checkbox" 
                  :value="platform.id" 
                  v-model="selectedPlatforms"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-700">{{ platform.name }}</div>
                  <div class="text-xs text-gray-500">{{ platform.description }}</div>
                </div>
              </label>
            </div>
          </div>
        </div>
        
        <!-- Additional Options -->
        <div class="additional-options mb-6">
          <h4 class="text-sm font-medium text-gray-700 mb-2">
            Options
          </h4>
          <div class="space-y-2">
            <label class="flex items-center">
              <input type="checkbox" v-model="options.checkAccessibility" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
              <span class="ml-2 text-sm text-gray-700">Check Accessibility</span>
            </label>
            
            <label class="flex items-center">
              <input type="checkbox" v-model="options.checkPerformance" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
              <span class="ml-2 text-sm text-gray-700">Check Performance</span>
            </label>
            
            <label class="flex items-center">
              <input type="checkbox" v-model="options.checkSeo" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
              <span class="ml-2 text-sm text-gray-700">Check SEO</span>
            </label>
            
            <label class="flex items-center">
              <input type="checkbox" v-model="options.checkBranding" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
              <span class="ml-2 text-sm text-gray-700">Check Brand Consistency</span>
            </label>
          </div>
        </div>
        
        <!-- Action Button -->
        <button 
          @click="runConsistencyCheck"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium"
          :disabled="!canRunCheck"
        >
          Run Consistency Check
        </button>
      </div>
      
      <!-- Right Panel: Results -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-medium mb-4">Results</h3>
        
        <!-- Loading State -->
        <div v-if="isChecking" class="flex flex-col items-center justify-center py-10">
          <div class="spinner mb-4">
            <svg class="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p class="text-gray-700">Running consistency check...</p>
          <p class="text-sm text-gray-500 mt-2">This may take a moment depending on the content size</p>
        </div>
        
        <!-- Empty State -->
        <div v-else-if="!hasResults" class="flex flex-col items-center justify-center py-10 text-center">
          <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-1">No Results Yet</h3>
          <p class="text-gray-500 mb-4">Configure your check and click "Run Consistency Check" to start</p>
        </div>
        
        <!-- Results State -->
        <div v-else class="results-container">
          <!-- Summary -->
          <div class="summary-section mb-6">
            <div class="grid grid-cols-2 gap-4">
              <div class="summary-card bg-blue-50 p-4 rounded-lg">
                <div class="text-sm text-gray-600">Consistency Score</div>
                <div class="text-3xl font-bold text-blue-700">{{ consistencyResults.score }}%</div>
                <div class="text-xs text-gray-500 mt-2">
                  {{ getScoreDescription(consistencyResults.score) }}
                </div>
              </div>
              
              <div class="summary-card bg-blue-50 p-4 rounded-lg">
                <div class="text-sm text-gray-600">Issues Found</div>
                <div class="text-3xl font-bold text-blue-700">{{ totalIssuesCount }}</div>
                <div class="text-xs text-gray-500 mt-2">
                  Across {{ selectedPlatforms.length }} platforms
                </div>
              </div>
            </div>
          </div>
          
          <!-- Issues List -->
          <div class="issues-section mb-6">
            <div class="flex items-center justify-between mb-2">
              <h4 class="text-md font-medium text-gray-700">Issues</h4>
              <div class="flex space-x-2">
                <select 
                  v-model="issueFilter"
                  class="text-sm border border-gray-300 rounded-md px-2 py-1"
                >
                  <option value="all">All Issues</option>
                  <option value="critical">Critical</option>
                  <option value="major">Major</option>
                  <option value="minor">Minor</option>
                </select>
              </div>
            </div>
            
            <div v-if="filteredIssues.length === 0" class="text-center py-6 bg-gray-50 rounded-md">
              <p class="text-gray-500">No issues found with the current filter</p>
            </div>
            
            <div v-else class="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              <div 
                v-for="(issue, index) in filteredIssues" 
                :key="index"
                class="issue-item p-3 border rounded-md"
                :class="{
                  'border-red-300 bg-red-50': issue.severity === 'critical',
                  'border-orange-300 bg-orange-50': issue.severity === 'major',
                  'border-yellow-300 bg-yellow-50': issue.severity === 'minor'
                }"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <div class="flex items-center">
                      <span 
                        class="severity-badge text-xs font-medium px-2 py-0.5 rounded-full mr-2"
                        :class="{
                          'bg-red-200 text-red-800': issue.severity === 'critical',
                          'bg-orange-200 text-orange-800': issue.severity === 'major',
                          'bg-yellow-200 text-yellow-800': issue.severity === 'minor'
                        }"
                      >
                        {{ issue.severity }}
                      </span>
                      <span class="platform-badge text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {{ getPlatformName(issue.platform) }}
                      </span>
                    </div>
                    <h5 class="text-sm font-medium mt-1">{{ issue.title }}</h5>
                    <p class="text-xs text-gray-600 mt-1">{{ issue.description }}</p>
                    
                    <div v-if="issue.screenshot" class="issue-screenshot mt-2">
                      <img :src="issue.screenshot" alt="Issue screenshot" class="max-w-full h-auto rounded-md border border-gray-200">
                    </div>
                  </div>
                  
                  <button 
                    @click="toggleIssueDetails(index)"
                    class="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path v-if="issue.showDetails" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
                
                <div v-if="issue.showDetails" class="issue-details mt-3 pt-3 border-t border-gray-200">
                  <div class="space-y-2">
                    <div>
                      <span class="text-xs font-medium text-gray-700">Element:</span>
                      <code class="text-xs bg-gray-100 px-1 py-0.5 rounded ml-1">{{ issue.element }}</code>
                    </div>
                    
                    <div v-if="issue.fix">
                      <span class="text-xs font-medium text-gray-700">Suggested Fix:</span>
                      <p class="text-xs text-gray-600">{{ issue.fix }}</p>
                    </div>
                    
                    <div v-if="issue.resources && issue.resources.length > 0">
                      <span class="text-xs font-medium text-gray-700">Resources:</span>
                      <ul class="text-xs text-blue-600 list-disc pl-5 mt-1">
                        <li v-for="(resource, i) in issue.resources" :key="i">
                          <a :href="resource.url" target="_blank" class="hover:underline">{{ resource.title }}</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="actions-section flex space-x-4">
            <button 
              @click="generateReport"
              class="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-50"
            >
              Generate Report
            </button>
            
            <button 
              @click="fixIssues"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium"
            >
              Auto-Fix Issues
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// State
const activeSourceTab = ref('url');
const contentUrl = ref('');
const selectedProject = ref('');
const uploadedFile = ref(null);
const fileInput = ref(null);
const isChecking = ref(false);
const hasResults = ref(false);
const issueFilter = ref('all');

// Options
const selectedPlatforms = ref(['desktop', 'mobile', 'tablet']);
const options = ref({
  checkAccessibility: true,
  checkPerformance: false,
  checkSeo: false,
  checkBranding: true
});

// Mock data
const projects = [
  { id: 'proj1', name: 'Product Landing Page' },
  { id: 'proj2', name: 'Email Newsletter' },
  { id: 'proj3', name: 'Team Onboarding Guide' }
];

const availablePlatforms = [
  { 
    id: 'desktop', 
    name: 'Desktop', 
    description: 'Chrome, Firefox, Safari, Edge' 
  },
  { 
    id: 'mobile', 
    name: 'Mobile', 
    description: 'iOS, Android browsers' 
  },
  { 
    id: 'tablet', 
    name: 'Tablet', 
    description: 'iPad, Android tablets' 
  },
  { 
    id: 'email', 
    name: 'Email Clients', 
    description: 'Gmail, Outlook, Apple Mail' 
  }
];

// Content Source Tabs
const contentSourceTabs = [
  { id: 'url', name: 'URL' },
  { id: 'project', name: 'Project' },
  { id: 'file', name: 'File Upload' }
];

// Simulated results
const consistencyResults = ref({
  score: 83,
  issues: [
    {
      severity: 'critical',
      platform: 'mobile',
      title: 'Interactive elements too small',
      description: 'Buttons and links are smaller than the recommended touch target size of 44x44px.',
      element: '<button class="btn-small">Click Me</button>',
      fix: 'Increase the size of buttons and links to at least 44x44px for mobile devices.',
      showDetails: false,
      resources: [
        { title: 'Mobile Touch Targets', url: '#' }
      ]
    },
    {
      severity: 'major',
      platform: 'desktop',
      title: 'Inconsistent branding',
      description: 'The logo appearance differs from brand guidelines.',
      element: '<img src="logo.png" class="logo-small" />',
      fix: 'Replace with standard logo and apply correct sizing according to brand guidelines.',
      showDetails: false,
      resources: [
        { title: 'Brand Guidelines', url: '#' }
      ]
    },
    {
      severity: 'minor',
      platform: 'tablet',
      title: 'Text overflow in container',
      description: 'Text overflows its container on tablet view.',
      element: '<div class="text-container">Long text content...</div>',
      fix: 'Add responsive styling to ensure text wraps properly on tablet viewports.',
      showDetails: false,
      resources: [
        { title: 'Responsive Text Handling', url: '#' }
      ]
    },
    {
      severity: 'major',
      platform: 'mobile',
      title: 'Images not optimized',
      description: 'Large images are not optimized for mobile devices, impacting load times.',
      element: '<img src="large-image.jpg" />',
      fix: 'Implement responsive images with srcset attribute to serve appropriate sizes.',
      showDetails: false,
      resources: [
        { title: 'Responsive Images Guide', url: '#' }
      ]
    },
    {
      severity: 'critical',
      platform: 'email',
      title: 'Interactive elements not supported',
      description: 'JavaScript-based interactivity will not function in most email clients.',
      element: '<button onclick="showMore()">Show More</button>',
      fix: 'Replace with email-compatible alternatives or fallback content.',
      showDetails: false,
      resources: [
        { title: 'Email Client Compatibility', url: '#' }
      ]
    }
  ]
});

// Computed properties
const canRunCheck = computed(() => {
  if (activeSourceTab.value === 'url') {
    return contentUrl.value.trim().length > 0 && selectedPlatforms.value.length > 0;
  } else if (activeSourceTab.value === 'project') {
    return selectedProject.value && selectedPlatforms.value.length > 0;
  } else if (activeSourceTab.value === 'file') {
    return uploadedFile.value && selectedPlatforms.value.length > 0;
  }
  return false;
});

const filteredIssues = computed(() => {
  if (issueFilter.value === 'all') {
    return consistencyResults.value.issues.filter(issue => 
      selectedPlatforms.value.includes(issue.platform)
    );
  } else {
    return consistencyResults.value.issues.filter(issue => 
      issue.severity === issueFilter.value && 
      selectedPlatforms.value.includes(issue.platform)
    );
  }
});

const totalIssuesCount = computed(() => {
  return consistencyResults.value.issues.filter(issue => 
    selectedPlatforms.value.includes(issue.platform)
  ).length;
});

// Methods
const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    uploadedFile.value = file;
  }
};

const handleFileDrop = (event) => {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (file) {
    uploadedFile.value = file;
  }
};

const removeFile = () => {
  uploadedFile.value = null;
  fileInput.value.value = '';
};

const runConsistencyCheck = () => {
  isChecking.value = true;
  
  // Simulate a check taking time
  setTimeout(() => {
    isChecking.value = false;
    hasResults.value = true;
    
    // In a real app, this would perform actual consistency checks
  }, 2000);
};

const getPlatformName = (platformId) => {
  const platform = availablePlatforms.find(p => p.id === platformId);
  return platform ? platform.name : platformId;
};

const getScoreDescription = (score) => {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Good';
  if (score >= 70) return 'Needs Improvement';
  if (score >= 60) return 'Poor';
  return 'Critical Issues';
};

const toggleIssueDetails = (index) => {
  consistencyResults.value.issues[index].showDetails = !consistencyResults.value.issues[index].showDetails;
};

const generateReport = () => {
  // In a real app, this would generate a detailed report
  alert('Report generation started. You will be notified when it is ready for download.');
};

const fixIssues = () => {
  // In a real app, this would apply automatic fixes where possible
  alert('Auto-fixing issues. This may take a moment...');
  
  setTimeout(() => {
    // Simulate fixing some issues
    consistencyResults.value.score = 92;
    
    // Remove "critical" issues that were supposedly fixed
    consistencyResults.value.issues = consistencyResults.value.issues.filter(issue => 
      issue.severity !== 'critical'
    );
    
    alert('Auto-fix complete! Consistency score improved to 92%');
  }, 1500);
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>