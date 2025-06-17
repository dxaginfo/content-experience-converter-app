<template>
  <div class="editor-view">
    <div class="page-header">
      <h2 class="text-2xl font-bold mb-6">Content Transformation Editor</h2>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Panel: Content Input -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-4">Source Content</h3>
        
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
          <select v-model="contentType" class="form-select w-full">
            <option value="text">Text Content</option>
            <option value="html">HTML Content</option>
            <option value="url">Website URL</option>
            <option value="file">File Upload</option>
          </select>
        </div>
        
        <!-- Text Area Input -->
        <div v-if="contentType === 'text' || contentType === 'html'" class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Paste Your Content</label>
          <textarea 
            v-model="sourceContent" 
            class="form-textarea w-full h-64"
            placeholder="Paste your content here..."
          ></textarea>
        </div>
        
        <!-- URL Input -->
        <div v-if="contentType === 'url'" class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
          <input 
            type="url" 
            v-model="sourceUrl" 
            class="form-input w-full"
            placeholder="https://example.com/article"
          >
          <button 
            @click="fetchContent" 
            class="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Fetch Content
          </button>
        </div>
        
        <!-- File Upload Input -->
        <div v-if="contentType === 'file'" class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input 
              type="file" 
              id="fileUpload" 
              class="hidden"
              @change="handleFileUpload"
              accept=".txt,.html,.md,.pdf,.docx,.pptx"
            >
            <label for="fileUpload" class="cursor-pointer">
              <span class="block text-gray-500 mb-2">Click to browse files</span>
              <span class="block text-xs text-gray-400">Supported formats: TXT, HTML, MD, PDF, DOCX, PPTX</span>
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
        
        <!-- Control Buttons -->
        <div class="flex space-x-2">
          <button 
            @click="analyzeContent" 
            class="btn-primary flex-grow"
            :disabled="!hasContent"
          >
            Analyze Content
          </button>
          <button 
            @click="clearContent" 
            class="btn-secondary flex-grow"
            :disabled="!hasContent"
          >
            Clear
          </button>
        </div>
      </div>
      
      <!-- Middle Panel: Transformation Tools -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-4">Transformation Tools</h3>
        
        <div v-if="contentAnalyzed" class="space-y-6">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Content Elements</label>
            <div class="max-h-64 overflow-y-auto border border-gray-200 rounded">
              <div 
                v-for="(element, index) in contentElements" 
                :key="index"
                class="p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                :class="{ 'bg-indigo-50': selectedElementIndex === index }"
                @click="selectElement(index)"
              >
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium">{{ element.type }}</span>
                  <span class="text-xs text-gray-500">{{ truncateText(element.content, 30) }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="selectedElement" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Transform to</label>
            <select v-model="selectedTransformation" class="form-select w-full mb-3">
              <option value="">Select transformation type...</option>
              <option v-for="transform in availableTransformations" :key="transform.id" :value="transform.id">
                {{ transform.name }}
              </option>
            </select>
            
            <div v-if="selectedTransformation" class="p-4 border border-gray-200 rounded-lg">
              <component 
                :is="getTransformationComponent(selectedTransformation)" 
                :element="selectedElement"
                @update="updateTransformedElement"
              ></component>
            </div>
          </div>
          
          <div class="flex space-x-2">
            <button 
              @click="applyTransformation" 
              class="btn-primary flex-grow"
              :disabled="!selectedTransformation"
            >
              Apply
            </button>
            <button 
              @click="resetTransformation" 
              class="btn-secondary flex-grow"
              :disabled="!selectedTransformation"
            >
              Reset
            </button>
          </div>
        </div>
        
        <div v-else class="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
          <p class="text-gray-500">
            Please input and analyze your content to access transformation tools
          </p>
        </div>
      </div>
      
      <!-- Right Panel: Preview -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-4">Preview</h3>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Device Preview</label>
          <select v-model="previewDevice" class="form-select w-full">
            <option value="desktop">Desktop</option>
            <option value="tablet">Tablet</option>
            <option value="mobile">Mobile</option>
          </select>
        </div>
        
        <div class="preview-container mb-6" :class="previewDevice">
          <div class="preview-content" v-if="hasTransformedContent">
            <div v-for="(element, index) in transformedElements" :key="index">
              <component 
                :is="getPreviewComponent(element.type)" 
                :element="element"
              ></component>
            </div>
          </div>
          <div v-else class="flex items-center justify-center h-64 text-gray-500">
            <p>Your transformed content will appear here</p>
          </div>
        </div>
        
        <div class="flex space-x-2">
          <button 
            @click="saveProject" 
            class="btn-primary flex-grow"
            :disabled="!hasTransformedContent"
          >
            Save Project
          </button>
          <button 
            @click="exportContent" 
            class="btn-secondary flex-grow"
            :disabled="!hasTransformedContent"
          >
            Export
          </button>
        </div>
      </div>
    </div>
    
    <!-- Bottom Panel: Platform Consistency -->
    <div class="mt-6 bg-white rounded-lg shadow-md p-6">
      <h3 class="text-lg font-semibold mb-4">Multi-platform Consistency Checker</h3>
      
      <div v-if="hasTransformedContent" class="mb-6">
        <div class="consistency-scores grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="consistency-score p-4 rounded-lg bg-indigo-50">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Overall Score</h4>
            <div class="flex items-end">
              <span class="text-3xl font-bold text-indigo-600">{{ consistencyScores.overall }}%</span>
              <span class="ml-2 text-sm text-gray-500">consistency</span>
            </div>
          </div>
          
          <div class="consistency-score p-4 rounded-lg bg-blue-50">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Visual Consistency</h4>
            <div class="flex items-end">
              <span class="text-3xl font-bold text-blue-600">{{ consistencyScores.visual }}%</span>
              <span class="ml-2 text-sm text-gray-500">across platforms</span>
            </div>
          </div>
          
          <div class="consistency-score p-4 rounded-lg bg-green-50">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Functional Consistency</h4>
            <div class="flex items-end">
              <span class="text-3xl font-bold text-green-600">{{ consistencyScores.functional }}%</span>
              <span class="ml-2 text-sm text-gray-500">across platforms</span>
            </div>
          </div>
        </div>
        
        <div class="consistency-issues mb-6">
          <h4 class="text-sm font-medium text-gray-700 mb-2">Consistency Issues</h4>
          <div v-if="consistencyIssues.length > 0" class="border border-gray-200 rounded divide-y">
            <div v-for="(issue, index) in consistencyIssues" :key="index" class="p-3">
              <div class="flex items-start">
                <div class="issue-severity mr-3 mt-1" :class="'severity-' + issue.severity">
                  <span class="sr-only">{{ issue.severity }}</span>
                </div>
                <div>
                  <h5 class="text-sm font-medium">{{ issue.title }}</h5>
                  <p class="text-xs text-gray-600">{{ issue.description }}</p>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-6 text-gray-500">
            No consistency issues detected!
          </div>
        </div>
        
        <button 
          @click="runConsistencyCheck" 
          class="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Run Consistency Check
        </button>
      </div>
      
      <div v-else class="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
        <p class="text-gray-500">
          Transform your content to check cross-platform consistency
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditorView',
  data() {
    return {
      contentType: 'text',
      sourceContent: '',
      sourceUrl: '',
      selectedFile: null,
      contentAnalyzed: false,
      contentElements: [],
      selectedElementIndex: -1,
      selectedTransformation: '',
      transformedElements: [],
      previewDevice: 'desktop',
      consistencyScores: {
        overall: 95,
        visual: 90,
        functional: 98
      },
      consistencyIssues: [
        {
          severity: 'warning',
          title: 'Interactive gallery may have limited functionality on mobile',
          description: 'Consider simplifying the gallery navigation for smaller screens.'
        },
        {
          severity: 'info',
          title: 'Text contrast could be improved for accessibility',
          description: 'The current text/background contrast ratio is 3.5:1, aim for at least 4.5:1.'
        }
      ],
      availableTransformations: [
        { id: 'quiz', name: 'Interactive Quiz' },
        { id: 'gallery', name: 'Image Gallery' },
        { id: 'accordion', name: 'Expandable Accordion' },
        { id: 'timeline', name: 'Interactive Timeline' },
        { id: 'chart', name: 'Data Visualization' },
        { id: 'poll', name: 'Interactive Poll' }
      ]
    }
  },
  computed: {
    hasContent() {
      if (this.contentType === 'text' || this.contentType === 'html') {
        return this.sourceContent.trim().length > 0
      } else if (this.contentType === 'url') {
        return this.sourceUrl.trim().length > 0
      } else if (this.contentType === 'file') {
        return this.selectedFile !== null
      }
      return false
    },
    selectedElement() {
      return this.selectedElementIndex >= 0 ? this.contentElements[this.selectedElementIndex] : null
    },
    hasTransformedContent() {
      return this.transformedElements.length > 0
    }
  },
  methods: {
    truncateText(text, length) {
      if (!text) return ''
      return text.length > length ? text.substring(0, length) + '...' : text
    },
    analyzeContent() {
      // Simulating content analysis - in a real app, this would use NLP or other content processing
      if (this.hasContent) {
        // Creating dummy content elements based on the source content
        let content = this.sourceContent
        if (this.contentType === 'text') {
          const paragraphs = content.split('\n\n')
          this.contentElements = paragraphs.map((p, index) => ({
            id: 'el_' + index,
            type: 'paragraph',
            content: p.trim(),
            originalContent: p.trim()
          }))
        } else {
          // Simplified for demo - would need proper HTML parsing in a real app
          this.contentElements = [
            { id: 'el_1', type: 'heading', content: 'Sample Heading', originalContent: 'Sample Heading' },
            { id: 'el_2', type: 'paragraph', content: 'This is sample paragraph content.', originalContent: 'This is sample paragraph content.' },
            { id: 'el_3', type: 'image', content: 'sample-image.jpg', originalContent: 'sample-image.jpg' },
            { id: 'el_4', type: 'paragraph', content: 'Another paragraph with more content to transform.', originalContent: 'Another paragraph with more content to transform.' }
          ]
        }
        
        this.contentAnalyzed = true
      }
    },
    clearContent() {
      this.sourceContent = ''
      this.sourceUrl = ''
      this.selectedFile = null
      this.contentAnalyzed = false
      this.contentElements = []
      this.selectedElementIndex = -1
      this.transformedElements = []
    },
    fetchContent() {
      // Simulating content fetching from URL - would use fetch or axios in a real app
      if (this.sourceUrl) {
        // Dummy content for demo
        this.sourceContent = 'Content fetched from URL: ' + this.sourceUrl + '\n\n'
          + 'This is the first paragraph of fetched content.\n\n'
          + 'This is the second paragraph with more details.'
        
        this.analyzeContent()
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (file) {
        this.selectedFile = file
        
        // In a real app, we would read the file content
        // For the demo, we'll just simulate it
        const reader = new FileReader()
        reader.onload = (e) => {
          this.sourceContent = e.target.result
        }
        reader.readAsText(file)
      }
    },
    removeFile() {
      this.selectedFile = null
      document.getElementById('fileUpload').value = ''
    },
    selectElement(index) {
      this.selectedElementIndex = index
      this.selectedTransformation = ''
    },
    getTransformationComponent(transformationType) {
      // In a real app, these would be imported components
      // For this demo, we'll return dummy components
      return 'div'
    },
    getPreviewComponent(elementType) {
      // Similar to above, these would be imported components
      return 'div'
    },
    updateTransformedElement(updatedElement) {
      // This would be called by transformation components to update the element data
      console.log('Element updated:', updatedElement)
    },
    applyTransformation() {
      if (this.selectedElement && this.selectedTransformation) {
        // Create a transformed version of the selected element
        const transformedElement = {
          ...this.selectedElement,
          transformationType: this.selectedTransformation,
          // In a real app, this would include transformation-specific data
        }
        
        // Add to transformed elements or update existing
        const existingIndex = this.transformedElements.findIndex(el => el.id === transformedElement.id)
        if (existingIndex >= 0) {
          this.transformedElements[existingIndex] = transformedElement
        } else {
          this.transformedElements.push(transformedElement)
        }
      }
    },
    resetTransformation() {
      this.selectedTransformation = ''
    },
    saveProject() {
      // In a real app, this would save to localStorage or a server
      alert('Project saved successfully!')
    },
    exportContent() {
      // In a real app, this would generate exportable HTML/JS
      alert('Content exported successfully!')
    },
    runConsistencyCheck() {
      // In a real app, this would analyze the content across platforms
      // For the demo, we'll just show a success message
      alert('Consistency check completed successfully!')
    }
  }
}
</script>

<style scoped>
.editor-view {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 1.5rem;
}

.form-select,
.form-input,
.form-textarea {
  @apply rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50;
}

.btn-primary {
  @apply bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply bg-white text-indigo-600 border border-indigo-600 px-4 py-2 rounded hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed;
}

.preview-container {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  height: 400px;
  overflow: auto;
  padding: 1rem;
  background: #f9fafb;
}

.preview-container.desktop {
  width: 100%;
}

.preview-container.tablet {
  width: 768px;
  max-width: 100%;
  margin: 0 auto;
}

.preview-container.mobile {
  width: 375px;
  max-width: 100%;
  margin: 0 auto;
}

.issue-severity {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.severity-error {
  background-color: #ef4444;
}

.severity-warning {
  background-color: #f59e0b;
}

.severity-info {
  background-color: #3b82f6;
}
</style>