<template>
  <div class="content-transformer">
    <div class="transformation-header">
      <h2 class="text-xl font-semibold mb-4">Content Transformation</h2>
      <p class="text-gray-600 mb-6">
        Select content elements and convert them into interactive experiences.
      </p>
    </div>

    <div class="transformation-container grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Source Content Panel -->
      <div class="source-panel bg-white rounded-lg shadow-md p-4">
        <h3 class="text-lg font-medium mb-3">Source Content</h3>
        
        <div class="content-input mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Content Source
          </label>
          <select 
            v-model="contentSource" 
            class="w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="text">Text</option>
            <option value="html">HTML</option>
            <option value="url">URL</option>
            <option value="file">File Upload</option>
          </select>
        </div>

        <div v-if="contentSource === 'text' || contentSource === 'html'" class="mb-4">
          <textarea 
            v-model="sourceContent" 
            class="w-full h-64 border-gray-300 rounded-md shadow-sm"
            placeholder="Paste your content here..."
          ></textarea>
        </div>

        <div v-if="contentSource === 'url'" class="mb-4">
          <input 
            type="url" 
            v-model="sourceUrl" 
            class="w-full border-gray-300 rounded-md shadow-sm"
            placeholder="https://example.com/content-page"
          />
          <button 
            @click="fetchUrl" 
            class="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Fetch Content
          </button>
        </div>

        <div v-if="contentSource === 'file'" class="mb-4">
          <label class="block mb-2 cursor-pointer">
            <span class="text-sm font-medium text-gray-700">Upload File</span>
            <input 
              type="file" 
              @change="handleFileUpload" 
              class="block w-full text-sm text-gray-500 mt-1
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              accept=".txt,.html,.md,.pdf,.docx,.pptx"
            />
          </label>
          <p class="text-xs text-gray-500 mt-1">
            Supported formats: TXT, HTML, MD, PDF, DOCX, PPTX
          </p>
        </div>

        <div class="action-buttons">
          <button 
            @click="analyzeContent" 
            class="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            :disabled="!hasContent"
          >
            Analyze Content
          </button>
        </div>
      </div>

      <!-- Transformation Panel -->
      <div class="transformation-panel bg-white rounded-lg shadow-md p-4">
        <h3 class="text-lg font-medium mb-3">Transformation Tools</h3>
        
        <div v-if="!contentAnalyzed" class="flex flex-col items-center justify-center h-64 text-gray-400">
          <svg class="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <p>Analyze your content to start transforming elements</p>
        </div>

        <div v-else>
          <div class="element-list space-y-3 mb-4 max-h-64 overflow-y-auto">
            <div 
              v-for="(element, index) in contentElements" 
              :key="index"
              class="element-item p-2 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
              :class="{ 'border-blue-500 bg-blue-50': selectedElementIndex === index }"
              @click="selectElement(index)"
            >
              <div class="text-sm truncate">{{ getElementPreview(element) }}</div>
              <div class="text-xs text-gray-500">{{ element.type }}</div>
            </div>
          </div>

          <div v-if="selectedElementIndex !== null" class="transformation-options">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Transform Element
            </label>
            <select 
              v-model="selectedTransformation" 
              class="w-full border-gray-300 rounded-md shadow-sm mb-3"
            >
              <option value="">Select transformation...</option>
              <option value="quiz">Interactive Quiz</option>
              <option value="gallery">Image Gallery</option>
              <option value="accordion">Expandable Accordion</option>
              <option value="timeline">Interactive Timeline</option>
              <option value="visualization">Data Visualization</option>
              <option value="poll">Interactive Poll</option>
            </select>
            
            <div v-if="selectedTransformation" class="transformation-settings mb-4">
              <!-- Dynamic settings based on transformation type -->
              <component 
                :is="transformationSettingsComponent" 
                v-if="transformationSettingsComponent"
                v-model="transformationSettings"
              ></component>
            </div>

            <button 
              @click="applyTransformation" 
              class="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
              :disabled="!selectedTransformation"
            >
              Apply Transformation
            </button>
          </div>
        </div>
      </div>

      <!-- Preview Panel -->
      <div class="preview-panel bg-white rounded-lg shadow-md p-4">
        <h3 class="text-lg font-medium mb-3">Preview</h3>
        
        <div class="device-selector mb-4 flex justify-center space-x-4">
          <button 
            @click="selectedDevice = 'desktop'"
            class="p-2 rounded-md" 
            :class="selectedDevice === 'desktop' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </button>
          <button 
            @click="selectedDevice = 'tablet'"
            class="p-2 rounded-md"
            :class="selectedDevice === 'tablet' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
          </button>
          <button 
            @click="selectedDevice = 'mobile'"
            class="p-2 rounded-md"
            :class="selectedDevice === 'mobile' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
          </button>
        </div>

        <div class="preview-container mb-4">
          <div 
            class="preview-frame border border-gray-300 rounded-md bg-gray-50 mx-auto overflow-hidden"
            :class="{
              'w-full h-96': selectedDevice === 'desktop',
              'w-3/4 h-96': selectedDevice === 'tablet',
              'w-1/2 h-96': selectedDevice === 'mobile'
            }"
          >
            <div v-if="!transformedContent" class="flex flex-col items-center justify-center h-full text-gray-400">
              <svg class="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <p>Preview will appear here</p>
            </div>
            <div v-else class="h-full overflow-auto p-4" v-html="transformedContent"></div>
          </div>
        </div>

        <div class="action-buttons flex space-x-3">
          <button 
            @click="saveProject" 
            class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Save Project
          </button>
          <button 
            @click="exportContent" 
            class="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            :disabled="!transformedContent"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, shallowRef } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import DOMPurify from 'dompurify';

// Data
const contentSource = ref('text');
const sourceContent = ref('');
const sourceUrl = ref('');
const uploadedFile = ref(null);
const contentAnalyzed = ref(false);
const contentElements = ref([]);
const selectedElementIndex = ref(null);
const selectedTransformation = ref('');
const transformationSettings = ref({});
const transformedContent = ref('');
const selectedDevice = ref('desktop');

// Computed
const hasContent = computed(() => {
  if (contentSource.value === 'text' || contentSource.value === 'html') {
    return sourceContent.value.trim().length > 0;
  } else if (contentSource.value === 'url') {
    return sourceUrl.value.trim().length > 0;
  } else if (contentSource.value === 'file') {
    return uploadedFile.value !== null;
  }
  return false;
});

const transformationSettingsComponent = computed(() => {
  // In a real implementation, this would dynamically return component references
  // based on the selected transformation type
  return null;
});

// Methods
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    uploadedFile.value = file;
    // In a real implementation, would read file contents
    const reader = new FileReader();
    reader.onload = (e) => {
      sourceContent.value = e.target.result;
    };
    reader.readAsText(file);
  }
};

const fetchUrl = async () => {
  // In a real implementation, would fetch content from URL
  // For demo purposes, simulate fetching
  try {
    // Simulated fetch
    sourceContent.value = `<h1>Content from ${sourceUrl.value}</h1>
      <p>This is a simulation of content fetched from a URL.</p>
      <p>In a real implementation, this would contain the actual content from the provided URL.</p>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>`;
  } catch (error) {
    console.error('Error fetching URL:', error);
  }
};

const analyzeContent = () => {
  // In a real implementation, would analyze content and identify elements
  // For demo purposes, create sample elements
  contentElements.value = [
    { id: uuidv4(), type: 'heading', content: 'Main Heading', level: 1 },
    { id: uuidv4(), type: 'paragraph', content: 'This is the first paragraph of content that can be transformed into something interactive.' },
    { id: uuidv4(), type: 'list', content: ['Item 1', 'Item 2', 'Item 3'], listType: 'unordered' },
    { id: uuidv4(), type: 'paragraph', content: 'This is another paragraph that contains information that could be presented in a different way.' },
    { id: uuidv4(), type: 'image', src: 'https://via.placeholder.com/600x400', alt: 'Placeholder image' }
  ];
  
  contentAnalyzed.value = true;
};

const getElementPreview = (element) => {
  if (element.type === 'heading') {
    return element.content;
  } else if (element.type === 'paragraph') {
    return element.content.length > 50 ? element.content.substring(0, 50) + '...' : element.content;
  } else if (element.type === 'list') {
    return `List: ${element.content.length} items`;
  } else if (element.type === 'image') {
    return `Image: ${element.alt || 'No alt text'}`;
  }
  return 'Element preview';
};

const selectElement = (index) => {
  selectedElementIndex.value = index;
  selectedTransformation.value = '';
  transformationSettings.value = {};
};

const applyTransformation = () => {
  if (selectedElementIndex.value === null || !selectedTransformation.value) {
    return;
  }

  const element = contentElements.value[selectedElementIndex.value];
  
  // Apply transformation based on type
  // This is a simplified example - in a real app, this would be more complex
  let transformed = '';

  if (selectedTransformation.value === 'quiz' && element.type === 'paragraph') {
    transformed = `
      <div class="interactive-quiz p-4 border rounded-lg bg-blue-50">
        <h3 class="text-lg font-medium mb-3">Quiz</h3>
        <p class="mb-3">${element.content}</p>
        <div class="question mb-4">
          <p class="font-medium mb-2">What does this paragraph describe?</p>
          <div class="options space-y-2">
            <label class="flex items-center space-x-2">
              <input type="radio" name="quiz-answer" value="1">
              <span>Option 1</span>
            </label>
            <label class="flex items-center space-x-2">
              <input type="radio" name="quiz-answer" value="2">
              <span>Option 2</span>
            </label>
            <label class="flex items-center space-x-2">
              <input type="radio" name="quiz-answer" value="3">
              <span>Option 3</span>
            </label>
          </div>
        </div>
        <button class="bg-blue-600 text-white px-4 py-2 rounded-md">Submit Answer</button>
      </div>
    `;
  } else if (selectedTransformation.value === 'accordion' && element.type === 'paragraph') {
    transformed = `
      <div class="interactive-accordion border rounded-lg overflow-hidden">
        <div class="accordion-header bg-gray-100 p-3 cursor-pointer flex justify-between items-center">
          <h3 class="font-medium">Expandable Content</h3>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
        <div class="accordion-content p-3">
          <p>${element.content}</p>
        </div>
      </div>
    `;
  } else if (selectedTransformation.value === 'timeline' && element.type === 'list') {
    const timelineItems = element.content.map((item, i) => `
      <div class="timeline-item flex">
        <div class="timeline-marker mr-4 relative">
          <div class="w-4 h-4 rounded-full bg-blue-500"></div>
          ${i < element.content.length - 1 ? '<div class="h-full w-0.5 bg-blue-300 absolute top-4 bottom-0 left-1.5"></div>' : ''}
        </div>
        <div class="timeline-content pb-6">
          <h4 class="font-medium">Event ${i + 1}</h4>
          <p>${item}</p>
        </div>
      </div>
    `).join('');

    transformed = `
      <div class="interactive-timeline p-4">
        <h3 class="text-lg font-medium mb-3">Timeline</h3>
        <div class="timeline-container">
          ${timelineItems}
        </div>
      </div>
    `;
  } else if (selectedTransformation.value === 'gallery' && element.type === 'image') {
    transformed = `
      <div class="interactive-gallery p-4">
        <h3 class="text-lg font-medium mb-3">Image Gallery</h3>
        <div class="gallery-container grid grid-cols-3 gap-2 mb-2">
          <img src="${element.src}" alt="${element.alt}" class="rounded cursor-pointer">
          <img src="https://via.placeholder.com/600x400?text=Image+2" alt="Gallery image 2" class="rounded cursor-pointer">
          <img src="https://via.placeholder.com/600x400?text=Image+3" alt="Gallery image 3" class="rounded cursor-pointer">
        </div>
        <div class="gallery-preview">
          <img src="${element.src}" alt="${element.alt}" class="rounded w-full">
        </div>
      </div>
    `;
  } else {
    // Default or unsupported transformation
    transformed = `
      <div class="transformation-error p-4 border rounded-lg bg-red-50 text-red-600">
        <p>Unsupported transformation for this element type.</p>
        <p>Please select a different element or transformation type.</p>
      </div>
    `;
  }

  // Sanitize the HTML before displaying
  transformedContent.value = DOMPurify.sanitize(transformed);
};

const saveProject = () => {
  // In a real implementation, would save project to storage
  alert('Project saved successfully!');
};

const exportContent = () => {
  // In a real implementation, would provide export options
  alert('Content exported successfully!');
};
</script>

<style scoped>
.content-transformer {
  @apply max-w-7xl mx-auto px-4 py-8;
}
</style>