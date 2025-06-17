<template>
  <div class="consistency-checker">
    <div class="checker-header">
      <h2 class="text-xl font-semibold mb-4">Multi-platform Consistency Checker</h2>
      <p class="text-gray-600 mb-6">
        Verify your content's consistency across different platforms and devices.
      </p>
    </div>

    <div class="checker-container grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Configuration Panel -->
      <div class="config-panel bg-white rounded-lg shadow-md p-4">
        <h3 class="text-lg font-medium mb-3">Check Configuration</h3>
        
        <div class="content-source mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Content Source
          </label>
          <select 
            v-model="contentSource" 
            class="w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="url">URL</option>
            <option value="file">File Upload</option>
            <option value="project">Existing Project</option>
          </select>
        </div>

        <div v-if="contentSource === 'url'" class="mb-4">
          <input 
            type="url" 
            v-model="sourceUrl" 
            class="w-full border-gray-300 rounded-md shadow-sm"
            placeholder="https://example.com/content-page"
          />
        </div>

        <div v-if="contentSource === 'file'" class="mb-4">
          <label class="block mb-2 cursor-pointer">
            <span class="text-sm font-medium text-gray-700">Upload HTML File</span>
            <input 
              type="file" 
              @change="handleFileUpload" 
              class="block w-full text-sm text-gray-500 mt-1
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              accept=".html,.htm"
            />
          </label>
        </div>

        <div v-if="contentSource === 'project'" class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Select Project
          </label>
          <select 
            v-model="selectedProject" 
            class="w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="">Select a project...</option>
            <option v-for="project in projects" :key="project.id" :value="project.id">
              {{ project.name }}
            </option>
          </select>
        </div>

        <div class="platform-selection mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Platforms to Check
          </label>
          <div class="space-y-2">
            <label class="flex items-center space-x-2">
              <input type="checkbox" v-model="platforms.desktop" class="rounded text-blue-600">
              <span>Desktop Web</span>
            </label>
            <label class="flex items-center space-x-2">
              <input type="checkbox" v-model="platforms.mobile" class="rounded text-blue-600">
              <span>Mobile Web</span>
            </label>
            <label class="flex items-center space-x-2">
              <input type="checkbox" v-model="platforms.tablet" class="rounded text-blue-600">
              <span>Tablet</span>
            </label>
            <label class="flex items-center space-x-2">
              <input type="checkbox" v-model="platforms.ios" class="rounded text-blue-600">
              <span>iOS App</span>
            </label>
            <label class="flex items-center space-x-2">
              <input type="checkbox" v-model="platforms.android" class="rounded text-blue-600">
              <span>Android App</span>
            </label>
          </div>
        </div>

        <div class="check-level mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Check Level
          </label>
          <select 
            v-model="checkLevel" 
            class="w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="basic">Basic (Quick Check)</option>
            <option value="standard">Standard (Recommended)</option>
            <option value="comprehensive">Comprehensive (Detailed)</option>
          </select>
        </div>

        <div class="action-buttons">
          <button 
            @click="runConsistencyCheck" 
            class="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            :disabled="!isConfigValid"
          >
            Check Consistency
          </button>
        </div>
      </div>

      <!-- Results Panel -->
      <div class="results-panel bg-white rounded-lg shadow-md p-4">
        <h3 class="text-lg font-medium mb-3">Check Results</h3>
        
        <div v-if="!checkRunning && !checkResults" class="flex flex-col items-center justify-center h-64 text-gray-400">
          <svg class="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p>Configure and run a consistency check to see results</p>
        </div>

        <div v-else-if="checkRunning" class="flex flex-col items-center justify-center h-64">
          <svg class="animate-spin w-12 h-12 text-blue-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-600">Running consistency check...</p>
        </div>

        <div v-else>
          <div class="overall-score mb-4 text-center">
            <div class="text-lg font-medium mb-1">Overall Consistency Score</div>
            <div class="score-circle relative inline-flex items-center justify-center w-24 h-24 rounded-full border-4"
              :class="getScoreColorClass(checkResults.overallScore)"
            >
              <span class="text-2xl font-bold">{{ checkResults.overallScore }}%</span>
            </div>
          </div>

          <div class="platform-scores mb-4">
            <h4 class="font-medium mb-2">Platform Scores</h4>
            <div class="space-y-2">
              <div v-for="(score, platform) in checkResults.platformScores" :key="platform" class="platform-score">
                <div class="flex justify-between items-center mb-1">
                  <span class="capitalize">{{ platform }}</span>
                  <span class="font-medium" :class="getScoreTextClass(score)">{{ score }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="h-2 rounded-full" :class="getScoreBarClass(score)" :style="{ width: `${score}%` }"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="issues-summary mb-4">
            <h4 class="font-medium mb-2">Issues Found</h4>
            <div class="grid grid-cols-3 gap-2 text-center mb-2">
              <div class="issue-category p-2 bg-red-50 rounded-md">
                <div class="text-red-700 font-medium">{{ checkResults.issues.critical }}</div>
                <div class="text-xs text-gray-600">Critical</div>
              </div>
              <div class="issue-category p-2 bg-yellow-50 rounded-md">
                <div class="text-yellow-700 font-medium">{{ checkResults.issues.warnings }}</div>
                <div class="text-xs text-gray-600">Warnings</div>
              </div>
              <div class="issue-category p-2 bg-blue-50 rounded-md">
                <div class="text-blue-700 font-medium">{{ checkResults.issues.suggestions }}</div>
                <div class="text-xs text-gray-600">Suggestions</div>
              </div>
            </div>
          </div>

          <div class="detailed-issues mb-4">
            <div class="flex justify-between items-center mb-2">
              <h4 class="font-medium">Detailed Issues</h4>
              <button 
                @click="toggleShowAllIssues" 
                class="text-sm text-blue-600 hover:text-blue-800"
              >
                {{ showAllIssues ? 'Show Top Issues' : 'Show All Issues' }}
              </button>
            </div>
            
            <div class="issues-list max-h-64 overflow-y-auto space-y-2">
              <div 
                v-for="(issue, index) in displayedIssues" 
                :key="index"
                class="issue-item p-2 rounded-md"
                :class="{
                  'bg-red-50': issue.severity === 'critical',
                  'bg-yellow-50': issue.severity === 'warning',
                  'bg-blue-50': issue.severity === 'suggestion'
                }"
              >
                <div class="flex items-start">
                  <div class="issue-icon mr-2">
                    <svg v-if="issue.severity === 'critical'" class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    <svg v-else-if="issue.severity === 'warning'" class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <svg v-else class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div class="issue-content flex-1">
                    <div class="issue-title font-medium">{{ issue.title }}</div>
                    <div class="issue-description text-sm text-gray-600">{{ issue.description }}</div>
                    <div class="issue-platforms text-xs text-gray-500 mt-1">
                      Affected platforms: {{ issue.platforms.join(', ') }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="action-buttons flex space-x-3">
            <button 
              @click="downloadReport" 
              class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Download Report
            </button>
            <button 
              @click="fixSelectedIssues" 
              class="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Fix Selected Issues
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Data
const contentSource = ref('url');
const sourceUrl = ref('');
const uploadedFile = ref(null);
const selectedProject = ref('');
const platforms = ref({
  desktop: true,
  mobile: true,
  tablet: true,
  ios: false,
  android: false
});
const checkLevel = ref('standard');
const checkRunning = ref(false);
const checkResults = ref(null);
const showAllIssues = ref(false);

// Mock data for demo
const projects = [
  { id: 'proj1', name: 'Project A' },
  { id: 'proj2', name: 'Project B' },
  { id: 'proj3', name: 'Project C' }
];

// Computed
const isConfigValid = computed(() => {
  // At least one platform must be selected
  const hasPlatform = Object.values(platforms.value).some(v => v);
  
  // Content source must be valid
  let hasValidSource = false;
  if (contentSource.value === 'url') {
    hasValidSource = sourceUrl.value.trim().length > 0;
  } else if (contentSource.value === 'file') {
    hasValidSource = uploadedFile.value !== null;
  } else if (contentSource.value === 'project') {
    hasValidSource = selectedProject.value !== '';
  }
  
  return hasPlatform && hasValidSource;
});

const displayedIssues = computed(() => {
  if (!checkResults.value) return [];
  
  const allIssues = [
    ...checkResults.value.issuesList.critical,
    ...checkResults.value.issuesList.warnings,
    ...checkResults.value.issuesList.suggestions
  ];
  
  return showAllIssues.value ? allIssues : allIssues.slice(0, 5);
});

// Methods
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    uploadedFile.value = file;
  }
};

const runConsistencyCheck = async () => {
  checkRunning.value = true;
  
  // Simulate API call with delay
  setTimeout(() => {
    // Mock results
    checkResults.value = {
      overallScore: 78,
      platformScores: {
        desktop: 92,
        mobile: 72,
        tablet: 85,
        ios: contentSource.value === 'ios' ? 68 : 0,
        android: contentSource.value === 'android' ? 65 : 0
      },
      issues: {
        critical: 2,
        warnings: 5,
        suggestions: 8
      },
      issuesList: {
        critical: [
          {
            severity: 'critical',
            title: 'Interactive elements not keyboard accessible',
            description: 'Some interactive elements are not accessible via keyboard navigation.',
            platforms: ['desktop', 'tablet']
          },
          {
            severity: 'critical',
            title: 'Touch targets too small',
            description: 'Several buttons and interactive elements have touch targets smaller than 44x44px.',
            platforms: ['mobile', 'tablet', 'ios', 'android']
          }
        ],
        warnings: [
          {
            severity: 'warning',
            title: 'Text contrast ratio too low',
            description: 'Some text elements do not meet WCAG AA contrast requirements.',
            platforms: ['desktop', 'mobile', 'tablet', 'ios', 'android']
          },
          {
            severity: 'warning',
            title: 'Font size too small on mobile',
            description: 'Body text is smaller than 16px on mobile devices, making it difficult to read.',
            platforms: ['mobile', 'ios', 'android']
          },
          {
            severity: 'warning',
            title: 'Interactive elements too close together',
            description: 'Some interactive elements are placed too close together, increasing the risk of touch errors.',
            platforms: ['mobile', 'tablet', 'ios', 'android']
          },
          {
            severity: 'warning',
            title: 'Images missing alternative text',
            description: 'Several images do not have alternative text, making them inaccessible to screen readers.',
            platforms: ['desktop', 'mobile', 'tablet', 'ios', 'android']
          },
          {
            severity: 'warning',
            title: 'Layout shifts on content load',
            description: 'Content layout shifts occur when images or other media load, disrupting user experience.',
            platforms: ['desktop', 'mobile', 'tablet']
          }
        ],
        suggestions: [
          {
            severity: 'suggestion',
            title: 'Consider lazy loading images',
            description: 'Implementing lazy loading for images could improve initial load performance.',
            platforms: ['desktop', 'mobile', 'tablet', 'ios', 'android']
          },
          {
            severity: 'suggestion',
            title: 'Add input validation feedback',
            description: 'Form inputs would benefit from more immediate validation feedback.',
            platforms: ['desktop', 'mobile', 'tablet']
          },
          {
            severity: 'suggestion',
            title: 'Optimize tap gestures for mobile',
            description: 'Consider implementing swipe and tap gestures for a more native mobile experience.',
            platforms: ['mobile', 'ios', 'android']
          },
          {
            severity: 'suggestion',
            title: 'Implement progressive enhancement',
            description: 'Core functionality should work without JavaScript for better compatibility.',
            platforms: ['desktop', 'mobile', 'tablet']
          },
          {
            severity: 'suggestion',
            title: 'Optimize image sizes',
            description: 'Several images could be further compressed without quality loss.',
            platforms: ['desktop', 'mobile', 'tablet', 'ios', 'android']
          },
          {
            severity: 'suggestion',
            title: 'Add skip navigation link',
            description: 'A skip navigation link would improve accessibility for keyboard users.',
            platforms: ['desktop', 'tablet']
          },
          {
            severity: 'suggestion',
            title: 'Improve form field labels',
            description: 'Some form fields lack clear, descriptive labels.',
            platforms: ['desktop', 'mobile', 'tablet', 'ios', 'android']
          },
          {
            severity: 'suggestion',
            title: 'Enhance loading states',
            description: 'Add more visible loading states for asynchronous operations.',
            platforms: ['desktop', 'mobile', 'tablet', 'ios', 'android']
          }
        ]
      }
    };
    
    checkRunning.value = false;
  }, 2000);
};

const getScoreColorClass = (score) => {
  if (score >= 90) return 'border-green-500';
  if (score >= 70) return 'border-yellow-500';
  return 'border-red-500';
};

const getScoreTextClass = (score) => {
  if (score >= 90) return 'text-green-600';
  if (score >= 70) return 'text-yellow-600';
  return 'text-red-600';
};

const getScoreBarClass = (score) => {
  if (score >= 90) return 'bg-green-500';
  if (score >= 70) return 'bg-yellow-500';
  return 'bg-red-500';
};

const toggleShowAllIssues = () => {
  showAllIssues.value = !showAllIssues.value;
};

const downloadReport = () => {
  // In a real implementation, would generate and download a PDF or HTML report
  alert('Report downloaded successfully!');
};

const fixSelectedIssues = () => {
  // In a real implementation, would apply fixes to selected issues
  alert('Selected issues fixed successfully!');
};
</script>

<style scoped>
.consistency-checker {
  @apply max-w-7xl mx-auto px-4 py-8;
}
</style>