<template>
  <div class="engagement-optimizer">
    <div class="optimizer-header">
      <h2 class="text-xl font-semibold mb-4">Engagement Optimization</h2>
      <p class="text-gray-600 mb-6">
        Analyze and improve your content's engagement metrics across platforms.
      </p>
    </div>

    <div class="optimizer-container grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Content Input Panel -->
      <div class="input-panel bg-white rounded-lg shadow-md p-4">
        <h3 class="text-lg font-medium mb-3">Content Input</h3>
        
        <div class="content-source mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Content Source
          </label>
          <select 
            v-model="contentSource" 
            class="w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="project">Existing Project</option>
            <option value="url">URL</option>
            <option value="paste">Paste Content</option>
          </select>
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

        <div v-if="contentSource === 'url'" class="mb-4">
          <input 
            type="url" 
            v-model="sourceUrl" 
            class="w-full border-gray-300 rounded-md shadow-sm"
            placeholder="https://example.com/content-page"
          />
        </div>

        <div v-if="contentSource === 'paste'" class="mb-4">
          <textarea 
            v-model="pastedContent" 
            class="w-full h-40 border-gray-300 rounded-md shadow-sm"
            placeholder="Paste your content here..."
          ></textarea>
        </div>

        <div class="target-audience mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Target Audience
          </label>
          <select 
            v-model="targetAudience" 
            class="w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="general">General</option>
            <option value="young-adults">Young Adults (18-24)</option>
            <option value="professionals">Professionals (25-45)</option>
            <option value="senior">Senior (46+)</option>
            <option value="technical">Technical</option>
            <option value="non-technical">Non-Technical</option>
            <option value="custom">Custom...</option>
          </select>
        </div>

        <div v-if="targetAudience === 'custom'" class="mb-4">
          <input 
            type="text" 
            v-model="customAudience" 
            class="w-full border-gray-300 rounded-md shadow-sm"
            placeholder="Describe your target audience"
          />
        </div>

        <div class="optimization-goals mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Optimization Goals
          </label>
          <div class="space-y-2">
            <label class="flex items-center space-x-2">
              <input type="checkbox" v-model="goals.engagement" class="rounded text-blue-600">
              <span>Increase Engagement Time</span>
            </label>
            <label class="flex items-center space-x-2">
              <input type="checkbox" v-model="goals.conversion" class="rounded text-blue-600">
              <span>Improve Conversion Rate</span>
            </label>
            <label class="flex items-center space-x-2">
              <input type="checkbox" v-model="goals.retention" class="rounded text-blue-600">
              <span>Enhance Retention</span>
            </label>
            <label class="flex items-center space-x-2">
              <input type="checkbox" v-model="goals.sharing" class="rounded text-blue-600">
              <span>Increase Social Sharing</span>
            </label>
            <label class="flex items-center space-x-2">
              <input type="checkbox" v-model="goals.comprehension" class="rounded text-blue-600">
              <span>Improve Content Comprehension</span>
            </label>
          </div>
        </div>

        <div class="action-buttons">
          <button 
            @click="analyzeContent" 
            class="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            :disabled="!isInputValid"
          >
            Analyze & Optimize
          </button>
        </div>
      </div>

      <!-- Analysis Results Panel -->
      <div class="analysis-panel bg-white rounded-lg shadow-md p-4 lg:col-span-2">
        <h3 class="text-lg font-medium mb-3">Engagement Analysis</h3>
        
        <div v-if="!analyzing && !analysisResults" class="flex flex-col items-center justify-center h-64 text-gray-400">
          <svg class="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          <p>Input your content and select goals to see analysis results</p>
        </div>

        <div v-else-if="analyzing" class="flex flex-col items-center justify-center h-64">
          <svg class="animate-spin w-12 h-12 text-blue-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-600">Analyzing content and generating recommendations...</p>
        </div>

        <div v-else class="analysis-content">
          <div class="engagement-score mb-4">
            <div class="flex justify-between items-center mb-1">
              <h4 class="font-medium">Current Engagement Score</h4>
              <span class="text-lg font-semibold" :class="getScoreTextClass(analysisResults.currentScore)">
                {{ analysisResults.currentScore }}/100
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div class="h-2.5 rounded-full" :class="getScoreBarClass(analysisResults.currentScore)" 
                :style="{ width: `${analysisResults.currentScore}%` }"></div>
            </div>
            <div class="text-sm text-gray-500">
              Potential improvement: +{{ analysisResults.potentialImprovement }} points
            </div>
          </div>

          <div class="metrics-breakdown mb-4">
            <h4 class="font-medium mb-2">Metrics Breakdown</h4>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
              <div v-for="(metric, key) in analysisResults.metrics" :key="key" 
                class="metric-card p-2 bg-gray-50 rounded-md border border-gray-200">
                <div class="text-sm font-medium">{{ formatMetricName(key) }}</div>
                <div class="flex items-center justify-between">
                  <span :class="getMetricValueClass(metric.score)">{{ metric.score }}/10</span>
                  <span class="text-xs" :class="getMetricTrendClass(metric.trend)">
                    <template v-if="metric.trend === 'up'">↑</template>
                    <template v-else-if="metric.trend === 'down'">↓</template>
                    <template v-else>→</template>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="optimization-suggestions mb-4">
            <div class="flex justify-between items-center mb-2">
              <h4 class="font-medium">Optimization Suggestions</h4>
              <div class="flex space-x-2">
                <button 
                  @click="currentFilter = 'all'" 
                  class="text-xs px-2 py-1 rounded"
                  :class="currentFilter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'"
                >
                  All
                </button>
                <button 
                  @click="currentFilter = 'high'" 
                  class="text-xs px-2 py-1 rounded"
                  :class="currentFilter === 'high' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'"
                >
                  High Impact
                </button>
                <button 
                  @click="currentFilter = 'quick'" 
                  class="text-xs px-2 py-1 rounded"
                  :class="currentFilter === 'quick' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'"
                >
                  Quick Wins
                </button>
              </div>
            </div>
            
            <div class="suggestions-list space-y-3 max-h-80 overflow-y-auto">
              <div 
                v-for="(suggestion, index) in filteredSuggestions" 
                :key="index"
                class="suggestion-item p-3 border border-gray-200 rounded-md hover:bg-gray-50"
              >
                <div class="flex justify-between items-start">
                  <h5 class="font-medium">{{ suggestion.title }}</h5>
                  <div class="flex items-center space-x-1">
                    <span class="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      +{{ suggestion.impact }}%
                    </span>
                    <span class="text-xs px-2 py-0.5 rounded-full" 
                      :class="suggestion.effort === 'low' ? 'bg-green-100 text-green-700' : 
                             suggestion.effort === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                             'bg-red-100 text-red-700'"
                    >
                      {{ suggestion.effort }} effort
                    </span>
                  </div>
                </div>
                <p class="text-sm text-gray-600 mt-1">{{ suggestion.description }}</p>
                <div class="mt-2 flex justify-between items-center">
                  <div class="text-xs text-gray-500">
                    Improves: {{ suggestion.improves.join(', ') }}
                  </div>
                  <button 
                    @click="applyOptimization(index)" 
                    class="text-sm text-white bg-green-600 px-3 py-1 rounded-md hover:bg-green-700"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="ab-testing-suggestions mb-4">
            <h4 class="font-medium mb-2">A/B Testing Opportunities</h4>
            <div class="space-y-2">
              <div v-for="(test, index) in analysisResults.abTests" :key="index" 
                class="test-item p-2 bg-purple-50 border border-purple-200 rounded-md">
                <div class="flex justify-between items-start">
                  <span class="font-medium">{{ test.title }}</span>
                  <button class="text-xs text-purple-700 border border-purple-300 px-2 py-0.5 rounded-md hover:bg-purple-100">
                    Set Up Test
                  </button>
                </div>
                <p class="text-sm text-gray-600 mt-1">{{ test.description }}</p>
              </div>
            </div>
          </div>

          <div class="action-buttons flex space-x-3">
            <button 
              @click="applyAllOptimizations" 
              class="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Apply All Optimizations
            </button>
            <button 
              @click="exportAnalysis" 
              class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Export Analysis
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
const contentSource = ref('project');
const selectedProject = ref('');
const sourceUrl = ref('');
const pastedContent = ref('');
const targetAudience = ref('general');
const customAudience = ref('');
const analyzing = ref(false);
const analysisResults = ref(null);
const currentFilter = ref('all');
const goals = ref({
  engagement: true,
  conversion: false,
  retention: false,
  sharing: false,
  comprehension: true
});

// Mock data for demo
const projects = [
  { id: 'proj1', name: 'Product Landing Page' },
  { id: 'proj2', name: 'Blog Article: 10 Tips' },
  { id: 'proj3', name: 'Email Newsletter' }
];

// Computed
const isInputValid = computed(() => {
  // At least one goal must be selected
  const hasGoal = Object.values(goals.value).some(v => v);
  
  // Content source must be valid
  let hasValidSource = false;
  if (contentSource.value === 'project') {
    hasValidSource = selectedProject.value !== '';
  } else if (contentSource.value === 'url') {
    hasValidSource = sourceUrl.value.trim().length > 0;
  } else if (contentSource.value === 'paste') {
    hasValidSource = pastedContent.value.trim().length > 0;
  }
  
  // Audience must be valid
  const hasValidAudience = targetAudience.value !== 'custom' || 
    (targetAudience.value === 'custom' && customAudience.value.trim().length > 0);
  
  return hasGoal && hasValidSource && hasValidAudience;
});

const filteredSuggestions = computed(() => {
  if (!analysisResults.value) return [];
  
  if (currentFilter.value === 'all') {
    return analysisResults.value.suggestions;
  } else if (currentFilter.value === 'high') {
    return analysisResults.value.suggestions.filter(s => s.impact >= 5);
  } else if (currentFilter.value === 'quick') {
    return analysisResults.value.suggestions.filter(s => s.effort === 'low');
  }
  
  return analysisResults.value.suggestions;
});

// Methods
const analyzeContent = async () => {
  analyzing.value = true;
  
  // Simulate API call with delay
  setTimeout(() => {
    // Mock results
    analysisResults.value = {
      currentScore: 64,
      potentialImprovement: 18,
      metrics: {
        clarity: { score: 7, trend: 'up' },
        interactivity: { score: 5, trend: 'neutral' },
        relevance: { score: 8, trend: 'up' },
        accessibility: { score: 6, trend: 'neutral' },
        readability: { score: 7, trend: 'down' },
        visualAppeal: { score: 4, trend: 'down' }
      },
      suggestions: [
        {
          title: 'Add interactive quiz elements',
          description: 'Convert static information into interactive quiz questions to test reader comprehension and increase engagement.',
          impact: 8,
          effort: 'medium',
          improves: ['interactivity', 'engagement', 'comprehension']
        },
        {
          title: 'Break up long paragraphs',
          description: 'Split paragraphs longer than 3-4 sentences to improve readability and content consumption.',
          impact: 5,
          effort: 'low',
          improves: ['readability', 'engagement']
        },
        {
          title: 'Add section navigation',
          description: 'Implement a sticky or floating section navigation to help users navigate longer content more easily.',
          impact: 6,
          effort: 'medium',
          improves: ['accessibility', 'engagement', 'retention']
        },
        {
          title: 'Include more visuals',
          description: 'Add relevant images, charts, or infographics to break up text and illustrate key points.',
          impact: 7,
          effort: 'high',
          improves: ['visual appeal', 'comprehension', 'engagement']
        },
        {
          title: 'Optimize headings',
          description: 'Make headings more descriptive and attention-grabbing to guide readers through the content.',
          impact: 4,
          effort: 'low',
          improves: ['clarity', 'readability']
        },
        {
          title: 'Add social sharing widgets',
          description: 'Integrate social sharing buttons at strategic points in the content to encourage sharing.',
          impact: 5,
          effort: 'low',
          improves: ['sharing', 'conversion']
        },
        {
          title: 'Implement progress indicator',
          description: 'Add a reading progress indicator to help users understand how much content remains.',
          impact: 3,
          effort: 'medium',
          improves: ['engagement', 'retention']
        }
      ],
      abTests: [
        {
          title: 'Test different call-to-action placements',
          description: 'Compare conversion rates between CTAs placed in-content vs. at the end of content.'
        },
        {
          title: 'Interactive vs. static content blocks',
          description: 'Compare engagement metrics between interactive elements and traditional static content.'
        },
        {
          title: 'Testing content length',
          description: 'Compare a concise version against a more detailed version to measure engagement differences.'
        }
      ]
    };
    
    analyzing.value = false;
  }, 2000);
};

const formatMetricName = (name) => {
  return name.charAt(0).toUpperCase() + 
    name.slice(1).replace(/([A-Z])/g, ' $1').trim();
};

const getScoreTextClass = (score) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

const getScoreBarClass = (score) => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getMetricValueClass = (score) => {
  if (score >= 8) return 'text-green-600';
  if (score >= 6) return 'text-yellow-600';
  return 'text-red-600';
};

const getMetricTrendClass = (trend) => {
  if (trend === 'up') return 'text-green-600';
  if (trend === 'down') return 'text-red-600';
  return 'text-gray-600';
};

const applyOptimization = (index) => {
  // In a real implementation, would apply the specific optimization
  alert(`Optimization "${filteredSuggestions.value[index].title}" applied successfully!`);
};

const applyAllOptimizations = () => {
  // In a real implementation, would apply all optimizations
  alert('All optimizations applied successfully!');
};

const exportAnalysis = () => {
  // In a real implementation, would export analysis report
  alert('Analysis report exported successfully!');
};
</script>

<style scoped>
.engagement-optimizer {
  @apply max-w-7xl mx-auto px-4 py-8;
}
</style>