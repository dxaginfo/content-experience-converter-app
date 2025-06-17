<template>
  <div class="consistency-checker">
    <div class="page-header">
      <h2 class="text-2xl font-bold mb-6">Multi-platform Experience Consistency Checker</h2>
      <p class="text-gray-600 mb-8">
        Ensure your interactive content maintains brand and message consistency across different platforms and devices.
      </p>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Panel: Content Input -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-4">Content Source</h3>
        
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
          <select v-model="sourceType" class="form-select w-full">
            <option value="url">Website URL</option>
            <option value="file">HTML File</option>
            <option value="project">Existing Project</option>
          </select>
        </div>
        
        <div v-if="sourceType === 'url'" class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
          <input 
            type="url" 
            v-model="sourceUrl" 
            class="form-input w-full"
            placeholder="https://example.com/interactive-content"
          >
        </div>
        
        <div v-if="sourceType === 'file'" class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Upload HTML File</label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input 
              type="file" 
              id="fileUpload" 
              class="hidden"
              @change="handleFileUpload"
              accept=".html,.htm"
            >
            <label for="fileUpload" class="cursor-pointer">
              <span class="block text-gray-500 mb-2">Click to browse files</span>
              <span class="block text-xs text-gray-400">Supported formats: HTML, HTM</span>
            </label>
            <div v-if="selectedFile" class="mt-4 text-left">
              <div class="bg-gray-100 p-2 rounded flex items-center">
                <span class="flex-grow truncate">{{ selectedFile.name }}</span>
                <button @click="removeFile" class="text-red-500 hover:text-red-700">
                  <span>✕</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="sourceType === 'project'" class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Select Project</label>
          <select v-model="selectedProject" class="form-select w-full">
            <option value="">Choose a project...</option>
            <option v-for="project in savedProjects" :key="project.id" :value="project.id">
              {{ project.name }}
            </option>
          </select>
        </div>
        
        <div class="platforms mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Platforms to Check</label>
          <div class="space-y-2">
            <div v-for="platform in platforms" :key="platform.id" class="flex items-center">
              <input 
                type="checkbox" 
                :id="platform.id" 
                v-model="platform.selected"
                class="form-checkbox h-5 w-5 text-indigo-600"
              >
              <label :for="platform.id" class="ml-2 text-sm text-gray-700">
                {{ platform.name }}
              </label>
            </div>
          </div>
        </div>
        
        <button 
          @click="checkConsistency" 
          class="btn-primary w-full"
          :disabled="!isFormValid"
        >
          Check Consistency
        </button>
      </div>
      
      <!-- Middle Panel: Results Overview -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-4">Consistency Results</h3>
        
        <div v-if="analysisComplete" class="space-y-6">
          <div class="text-center mb-6">
            <div class="inline-block p-1 rounded-full bg-gray-100">
              <div class="w-32 h-32 rounded-full flex items-center justify-center" 
                :class="getScoreClass(overallScore)">
                <span class="text-4xl font-bold text-white">{{ overallScore }}%</span>
              </div>
            </div>
            <h4 class="text-lg font-medium mt-2">Overall Consistency Score</h4>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div v-for="category in scoreCategories" :key="category.id" class="score-card p-4 rounded-lg border">
              <h5 class="text-sm font-medium text-gray-700 mb-1">{{ category.name }}</h5>
              <div class="flex items-center">
                <div class="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div class="h-2.5 rounded-full" 
                    :style="{ width: category.score + '%' }"
                    :class="getScoreClass(category.score)"></div>
                </div>
                <span class="text-sm font-medium">{{ category.score }}%</span>
              </div>
            </div>
          </div>
          
          <div class="issue-summary p-4 bg-gray-50 rounded-lg">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Summary</h4>
            <ul class="text-sm space-y-1">
              <li v-for="(count, type) in issueCounts" :key="type" class="flex items-center">
                <span class="issue-dot mr-2" :class="'issue-' + type"></span>
                {{ count }} {{ type }} {{ count === 1 ? 'issue' : 'issues' }}
              </li>
            </ul>
          </div>
          
          <button 
            @click="generateReport" 
            class="btn-primary w-full"
          >
            Generate Detailed Report
          </button>
        </div>
        
        <div v-else class="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
          <p class="text-gray-500">
            Check your content consistency across platforms to see results
          </p>
        </div>
      </div>
      
      <!-- Right Panel: Issues -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-4">Detected Issues</h3>
        
        <div v-if="analysisComplete" class="space-y-4">
          <div class="filters mb-4 flex space-x-2">
            <button 
              v-for="filter in issueFilters" 
              :key="filter.type"
              @click="setIssueFilter(filter.type)"
              class="px-3 py-1 text-sm rounded-full"
              :class="currentFilter === filter.type ? filter.activeClass : filter.inactiveClass"
            >
              {{ filter.label }} ({{ getIssueCountByType(filter.type) }})
            </button>
          </div>
          
          <div class="issues-list max-h-96 overflow-y-auto space-y-3">
            <div 
              v-for="(issue, index) in filteredIssues" 
              :key="index"
              class="issue-item p-4 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              <div class="flex">
                <div class="issue-icon mr-3" :class="'issue-icon-' + issue.severity">
                  <span class="sr-only">{{ issue.severity }}</span>
                </div>
                <div class="flex-grow">
                  <h5 class="text-sm font-medium">{{ issue.title }}</h5>
                  <p class="text-xs text-gray-600 mt-1">{{ issue.description }}</p>
                  <div class="mt-2 flex items-center text-xs text-gray-500">
                    <span class="platform-tag px-2 py-0.5 rounded bg-gray-100">
                      {{ issue.platform }}
                    </span>
                    <span class="element-path ml-2">{{ issue.element }}</span>
                  </div>
                </div>
              </div>
              <div class="mt-3 pt-3 border-t border-gray-100 flex justify-between">
                <button class="text-xs text-indigo-600 hover:text-indigo-800">
                  View Details
                </button>
                <button class="text-xs text-green-600 hover:text-green-800">
                  Fix Suggestion
                </button>
              </div>
            </div>
            
            <div v-if="filteredIssues.length === 0" class="text-center py-8 text-gray-500">
              No issues found with the current filter.
            </div>
          </div>
        </div>
        
        <div v-else class="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
          <p class="text-gray-500">
            Issues will appear here after consistency check
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConsistencyCheckerView',
  data() {
    return {
      sourceType: 'url',
      sourceUrl: '',
      selectedFile: null,
      selectedProject: '',
      platforms: [
        { id: 'desktop', name: 'Desktop Web', selected: true },
        { id: 'mobile', name: 'Mobile Web', selected: true },
        { id: 'tablet', name: 'Tablet', selected: true },
        { id: 'ios', name: 'iOS App', selected: false },
        { id: 'android', name: 'Android App', selected: false }
      ],
      savedProjects: [
        { id: 'proj1', name: 'Product Launch Campaign' },
        { id: 'proj2', name: 'Annual Report Interactive' },
        { id: 'proj3', name: 'Customer Journey Map' }
      ],
      analysisComplete: false,
      overallScore: 87,
      scoreCategories: [
        { id: 'visual', name: 'Visual Consistency', score: 92 },
        { id: 'functional', name: 'Functional Consistency', score: 85 },
        { id: 'brand', name: 'Brand Consistency', score: 94 },
        { id: 'accessibility', name: 'Accessibility', score: 78 }
      ],
      issueCounts: {
        critical: 1,
        warning: 3,
        info: 5
      },
      currentFilter: 'all',
      issueFilters: [
        { type: 'all', label: 'All', activeClass: 'bg-indigo-100 text-indigo-800', inactiveClass: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
        { type: 'critical', label: 'Critical', activeClass: 'bg-red-100 text-red-800', inactiveClass: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
        { type: 'warning', label: 'Warnings', activeClass: 'bg-yellow-100 text-yellow-800', inactiveClass: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
        { type: 'info', label: 'Info', activeClass: 'bg-blue-100 text-blue-800', inactiveClass: 'bg-gray-100 text-gray-700 hover:bg-gray-200' }
      ],
      issues: [
        {
          severity: 'critical',
          title: 'Interactive elements not functional on iOS',
          description: 'The quiz component does not respond to touch events on iOS Safari.',
          platform: 'iOS Safari',
          element: '#quiz-section > .interactive-quiz'
        },
        {
          severity: 'warning',
          title: 'Text overflow in mobile view',
          description: 'Long headlines are causing text overflow in the mobile viewport.',
          platform: 'Mobile Web',
          element: '.hero-section > h1'
        },
        {
          severity: 'warning',
          title: 'Image resolution too low for high-DPI screens',
          description: 'Product images appear pixelated on high-DPI screens like Retina displays.',
          platform: 'All Platforms',
          element: '.product-gallery img'
        },
        {
          severity: 'warning',
          title: 'Animation performance issues on Android',
          description: 'Complex animations cause frame drops on mid-range Android devices.',
          platform: 'Android Chrome',
          element: '.animated-banner'
        },
        {
          severity: 'info',
          title: 'Font inconsistency detected',
          description: 'Secondary font fallback differs between platforms.',
          platform: 'Multiple',
          element: 'body, .content-area'
        },
        {
          severity: 'info',
          title: 'Color variation in dark mode',
          description: 'Brand colors appear differently when device is in dark mode.',
          platform: 'All Platforms',
          element: '.brand-elements, .logo'
        },
        {
          severity: 'info',
          title: 'Touch target size too small',
          description: 'Navigation buttons do not meet minimum touch target size of 44x44px.',
          platform: 'Mobile Devices',
          element: '.nav-buttons a'
        },
        {
          severity: 'info',
          title: 'Loading time variation',
          description: 'Content loading time varies significantly between platforms.',
          platform: 'All Platforms',
          element: 'document'
        },
        {
          severity: 'info',
          title: 'Form field behavior inconsistency',
          description: 'Autocomplete behavior differs between browsers.',
          platform: 'Multiple Browsers',
          element: 'form input[type="text"]'
        }
      ]
    }
  },
  computed: {
    isFormValid() {
      const hasSelectedPlatforms = this.platforms.some(p => p.selected)
      
      if (this.sourceType === 'url') {
        return this.sourceUrl.trim() && hasSelectedPlatforms
      } else if (this.sourceType === 'file') {
        return this.selectedFile && hasSelectedPlatforms
      } else if (this.sourceType === 'project') {
        return this.selectedProject && hasSelectedPlatforms
      }
      
      return false
    },
    filteredIssues() {
      if (this.currentFilter === 'all') {
        return this.issues
      }
      return this.issues.filter(issue => issue.severity === this.currentFilter)
    }
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (file) {
        this.selectedFile = file
      }
    },
    removeFile() {
      this.selectedFile = null
      document.getElementById('fileUpload').value = ''
    },
    checkConsistency() {
      // Simulate loading and analysis
      setTimeout(() => {
        this.analysisComplete = true
      }, 1500)
    },
    getScoreClass(score) {
      if (score >= 90) return 'bg-green-600'
      if (score >= 70) return 'bg-yellow-500'
      return 'bg-red-500'
    },
    setIssueFilter(filter) {
      this.currentFilter = filter
    },
    getIssueCountByType(type) {
      if (type === 'all') {
        return this.issues.length
      }
      return this.issues.filter(issue => issue.severity === type).length
    },
    generateReport() {
      // In a real app, this would generate a PDF or detailed HTML report
      alert('Generating detailed consistency report...')
    }
  }
}
</script>

<style scoped>
.consistency-checker {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 1.5rem;
}

.form-select,
.form-input {
  @apply rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50;
}

.form-checkbox {
  @apply rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50;
}

.btn-primary {
  @apply bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed;
}

.score-card {
  border-color: #e5e7eb;
}

.issue-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.issue-critical {
  background-color: #ef4444;
}

.issue-warning {
  background-color: #f59e0b;
}

.issue-info {
  background-color: #3b82f6;
}

.issue-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.issue-icon-critical {
  background-color: #fee2e2;
  color: #ef4444;
}

.issue-icon-warning {
  background-color: #fef3c7;
  color: #f59e0b;
}

.issue-icon-info {
  background-color: #dbeafe;
  color: #3b82f6;
}

.issue-icon::before {
  content: "!";
  font-weight: bold;
  font-size: 14px;
}

.platform-tag {
  font-size: 10px;
}
</style>