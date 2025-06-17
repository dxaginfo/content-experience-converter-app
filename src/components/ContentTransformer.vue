<template>
  <div class="content-transformer">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Panel: Content Source -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">Content Source</h2>
        
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
        
        <!-- Text Input Tab -->
        <div v-if="activeSourceTab === 'text'" class="source-tab-content">
          <div class="mb-4">
            <label for="content-title" class="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input 
              type="text" 
              id="content-title" 
              v-model="contentTitle"
              placeholder="Enter content title"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div class="mb-4">
            <label for="content-text" class="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea 
              id="content-text" 
              v-model="contentText"
              rows="12"
              placeholder="Paste or type your content here..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          
          <button 
            @click="analyzeContent"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium"
            :disabled="!contentText.trim()"
          >
            Analyze Content
          </button>
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
          
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Content Selection
            </label>
            <div class="space-y-2">
              <div class="flex items-center">
                <input type="checkbox" id="select-text" v-model="urlContentOptions.text" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                <label for="select-text" class="ml-2 block text-sm text-gray-700">Text Content</label>
              </div>
              <div class="flex items-center">
                <input type="checkbox" id="select-images" v-model="urlContentOptions.images" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                <label for="select-images" class="ml-2 block text-sm text-gray-700">Images</label>
              </div>
              <div class="flex items-center">
                <input type="checkbox" id="select-videos" v-model="urlContentOptions.videos" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                <label for="select-videos" class="ml-2 block text-sm text-gray-700">Videos</label>
              </div>
            </div>
          </div>
          
          <button 
            @click="fetchUrl"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium"
            :disabled="!contentUrl.trim()"
          >
            Fetch Content
          </button>
        </div>
        
        <!-- File Upload Tab -->
        <div v-if="activeSourceTab === 'file'" class="source-tab-content">
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Upload File
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
                      accept=".html,.txt,.md,.doc,.docx,.pdf"
                    >
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs text-gray-500">
                  HTML, TXT, Markdown, Word, or PDF up to 10MB
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
          
          <button 
            @click="processFile"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium"
            :disabled="!uploadedFile"
          >
            Process File
          </button>
        </div>
      </div>
      
      <!-- Middle Panel: Transform Tools -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">Transform Content</h2>
        
        <div v-if="contentAnalyzed" class="transform-tools">
          <!-- Content Elements -->
          <div class="mb-6">
            <h3 class="text-md font-medium text-gray-700 mb-2">Content Elements</h3>
            <div class="space-y-3">
              <div 
                v-for="(element, index) in contentElements" 
                :key="index"
                class="content-element p-3 border border-gray-200 rounded-md hover:border-blue-300 cursor-pointer transition-colors"
                :class="{ 'border-blue-500 bg-blue-50': selectedElement === index }"
                @click="selectElement(index)"
              >
                <div class="flex justify-between items-center">
                  <div class="flex items-center">
                    <span class="content-element-type px-2 py-1 text-xs rounded-full" :class="getElementTypeClass(element.type)">
                      {{ element.type }}
                    </span>
                    <span class="ml-2 text-sm font-medium text-gray-800 truncate max-w-[150px]">
                      {{ element.preview }}
                    </span>
                  </div>
                  <div class="flex space-x-1">
                    <button class="p-1 text-gray-500 hover:text-blue-600">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Transformation Options -->
          <div v-if="selectedElement !== null" class="transformation-options mb-6">
            <h3 class="text-md font-medium text-gray-700 mb-2">Transformation Options</h3>
            
            <!-- Text Transformation Options -->
            <div v-if="selectedElementType === 'text'" class="space-y-3">
              <div class="p-3 border border-gray-200 rounded-md hover:border-blue-300 cursor-pointer transition-colors">
                <div class="flex items-center">
                  <input type="radio" id="transform-accordion" v-model="transformationType" value="accordion" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300">
                  <label for="transform-accordion" class="ml-2 block text-sm font-medium text-gray-700">Expandable Accordion</label>
                </div>
              </div>
              
              <div class="p-3 border border-gray-200 rounded-md hover:border-blue-300 cursor-pointer transition-colors">
                <div class="flex items-center">
                  <input type="radio" id="transform-tabs" v-model="transformationType" value="tabs" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300">
                  <label for="transform-tabs" class="ml-2 block text-sm font-medium text-gray-700">Tabbed Content</label>
                </div>
              </div>
              
              <div class="p-3 border border-gray-200 rounded-md hover:border-blue-300 cursor-pointer transition-colors">
                <div class="flex items-center">
                  <input type="radio" id="transform-callout" v-model="transformationType" value="callout" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300">
                  <label for="transform-callout" class="ml-2 block text-sm font-medium text-gray-700">Highlight Callout</label>
                </div>
              </div>
              
              <div class="p-3 border border-gray-200 rounded-md hover:border-blue-300 cursor-pointer transition-colors">
                <div class="flex items-center">
                  <input type="radio" id="transform-tooltip" v-model="transformationType" value="tooltip" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300">
                  <label for="transform-tooltip" class="ml-2 block text-sm font-medium text-gray-700">Interactive Tooltips</label>
                </div>
              </div>
            </div>
            
            <!-- Image Transformation Options -->
            <div v-if="selectedElementType === 'image'" class="space-y-3">
              <div class="p-3 border border-gray-200 rounded-md hover:border-blue-300 cursor-pointer transition-colors">
                <div class="flex items-center">
                  <input type="radio" id="transform-gallery" v-model="transformationType" value="gallery" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300">
                  <label for="transform-gallery" class="ml-2 block text-sm font-medium text-gray-700">Image Gallery</label>
                </div>
              </div>
              
              <div class="p-3 border border-gray-200 rounded-md hover:border-blue-300 cursor-pointer transition-colors">
                <div class="flex items-center">
                  <input type="radio" id="transform-zoom" v-model="transformationType" value="zoom" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300">
                  <label for="transform-zoom" class="ml-2 block text-sm font-medium text-gray-700">Zoom & Pan</label>
                </div>
              </div>
              
              <div class="p-3 border border-gray-200 rounded-md hover:border-blue-300 cursor-pointer transition-colors">
                <div class="flex items-center">
                  <input type="radio" id="transform-hotspots" v-model="transformationType" value="hotspots" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300">
                  <label for="transform-hotspots" class="ml-2 block text-sm font-medium text-gray-700">Interactive Hotspots</label>
                </div>
              </div>
              
              <div class="p-3 border border-gray-200 rounded-md hover:border-blue-300 cursor-pointer transition-colors">
                <div class="flex items-center">
                  <input type="radio" id="transform-before-after" v-model="transformationType" value="before-after" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300">
                  <label for="transform-before-after" class="ml-2 block text-sm font-medium text-gray-700">Before/After Slider</label>
                </div>
              </div>
            </div>
            
            <!-- List Transformation Options -->
            <div v-if="selectedElementType === 'list'" class="space-y-3">
              <div class="p-3 border border-gray-200 rounded-md hover:border-blue-300 cursor-pointer transition-colors">
                <div class="flex items-center">
                  <input type="radio" id="transform-quiz" v-model="transformationType" value="quiz" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300">
                  <label for="transform-quiz" class="ml-2 block text-sm font-medium text-gray-700">Interactive Quiz</label>
                </div>
              </div>
              
              <div class="p-3 border border-gray-200 rounded-md hover:border-blue-300 cursor-pointer transition-colors">
                <div class="flex items-center">
                  <input type="radio" id="transform-checklist" v-model="transformationType" value="checklist" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300">
                  <label for="transform-checklist" class="ml-2 block text-sm font-medium text-gray-700">Interactive Checklist</label>
                </div>
              </div>
              
              <div class="p-3 border border-gray-200 rounded-md hover:border-blue-300 cursor-pointer transition-colors">
                <div class="flex items-center">
                  <input type="radio" id="transform-timeline" v-model="transformationType" value="timeline" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300">
                  <label for="transform-timeline" class="ml-2 block text-sm font-medium text-gray-700">Interactive Timeline</label>
                </div>
              </div>
              
              <div class="p-3 border border-gray-200 rounded-md hover:border-blue-300 cursor-pointer transition-colors">
                <div class="flex items-center">
                  <input type="radio" id="transform-cards" v-model="transformationType" value="cards" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300">
                  <label for="transform-cards" class="ml-2 block text-sm font-medium text-gray-700">Card Carousel</label>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Transformation Settings -->
          <div v-if="transformationType" class="transformation-settings mb-6">
            <h3 class="text-md font-medium text-gray-700 mb-2">Settings</h3>
            
            <div class="space-y-4 p-4 border border-gray-200 rounded-md">
              <!-- Accordion Settings -->
              <div v-if="transformationType === 'accordion'" class="space-y-3">
                <div>
                  <label for="accordion-style" class="block text-sm font-medium text-gray-700 mb-1">Style</label>
                  <select id="accordion-style" v-model="transformationSettings.style" class="w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 px-3 py-2">
                    <option value="default">Default</option>
                    <option value="minimal">Minimal</option>
                    <option value="boxed">Boxed</option>
                  </select>
                </div>
                
                <div class="flex items-center">
                  <input type="checkbox" id="allow-multiple" v-model="transformationSettings.allowMultiple" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                  <label for="allow-multiple" class="ml-2 block text-sm text-gray-700">Allow Multiple Open Sections</label>
                </div>
                
                <div>
                  <label for="animation-speed" class="block text-sm font-medium text-gray-700 mb-1">Animation Speed</label>
                  <input type="range" id="animation-speed" v-model="transformationSettings.animationSpeed" min="100" max="1000" step="100" class="w-full">
                  <div class="flex justify-between text-xs text-gray-500">
                    <span>Fast</span>
                    <span>Slow</span>
                  </div>
                </div>
              </div>
              
              <!-- Gallery Settings -->
              <div v-if="transformationType === 'gallery'" class="space-y-3">
                <div>
                  <label for="gallery-layout" class="block text-sm font-medium text-gray-700 mb-1">Layout</label>
                  <select id="gallery-layout" v-model="transformationSettings.layout" class="w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 px-3 py-2">
                    <option value="grid">Grid</option>
                    <option value="masonry">Masonry</option>
                    <option value="carousel">Carousel</option>
                  </select>
                </div>
                
                <div class="flex items-center">
                  <input type="checkbox" id="lightbox" v-model="transformationSettings.lightbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                  <label for="lightbox" class="ml-2 block text-sm text-gray-700">Enable Lightbox</label>
                </div>
                
                <div class="flex items-center">
                  <input type="checkbox" id="captions" v-model="transformationSettings.captions" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                  <label for="captions" class="ml-2 block text-sm text-gray-700">Show Captions</label>
                </div>
              </div>
              
              <!-- Quiz Settings -->
              <div v-if="transformationType === 'quiz'" class="space-y-3">
                <div>
                  <label for="quiz-type" class="block text-sm font-medium text-gray-700 mb-1">Quiz Type</label>
                  <select id="quiz-type" v-model="transformationSettings.quizType" class="w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 px-3 py-2">
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="true-false">True/False</option>
                    <option value="matching">Matching</option>
                  </select>
                </div>
                
                <div class="flex items-center">
                  <input type="checkbox" id="immediate-feedback" v-model="transformationSettings.immediateFeedback" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                  <label for="immediate-feedback" class="ml-2 block text-sm text-gray-700">Immediate Feedback</label>
                </div>
                
                <div class="flex items-center">
                  <input type="checkbox" id="show-results" v-model="transformationSettings.showResults" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                  <label for="show-results" class="ml-2 block text-sm text-gray-700">Show Results Summary</label>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Apply Transformation Button -->
          <button 
            @click="applyTransformation"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium"
            :disabled="!transformationType"
          >
            Apply Transformation
          </button>
        </div>
        
        <div v-else class="flex flex-col items-center justify-center py-10 text-center">
          <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-1">No Content Analyzed</h3>
          <p class="text-gray-500 mb-4">Add content from the source panel to begin transforming</p>
        </div>
      </div>
      
      <!-- Right Panel: Preview -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">Preview</h2>
        
        <!-- Preview Tabs -->
        <div class="mb-6">
          <div class="flex border-b border-gray-200">
            <button 
              v-for="tab in previewTabs" 
              :key="tab.id"
              @click="activePreviewTab = tab.id"
              class="py-2 px-4 text-sm font-medium"
              :class="activePreviewTab === tab.id ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'"
            >
              {{ tab.name }}
            </button>
          </div>
        </div>
        
        <!-- Desktop Preview -->
        <div v-if="activePreviewTab === 'desktop'" class="preview-container h-[500px] overflow-auto border border-gray-200 rounded-md">
          <div v-if="contentAnalyzed && transformedContent" class="p-4" v-html="transformedContent"></div>
          <div v-else class="flex flex-col items-center justify-center h-full text-center">
            <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-1">No Preview Available</h3>
            <p class="text-gray-500 mb-4">Transform your content to see a preview</p>
          </div>
        </div>
        
        <!-- Mobile Preview -->
        <div v-if="activePreviewTab === 'mobile'" class="preview-container flex justify-center">
          <div class="mobile-frame w-[320px] h-[600px] border-8 border-gray-800 rounded-[32px] overflow-hidden relative">
            <div class="absolute top-0 w-1/3 h-6 bg-gray-800 left-1/3 rounded-b-lg"></div>
            <div v-if="contentAnalyzed && transformedContent" class="h-full overflow-auto" v-html="transformedContent"></div>
            <div v-else class="flex flex-col items-center justify-center h-full text-center p-4">
              <svg class="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
              <h3 class="text-md font-medium text-gray-900 mb-1">No Preview Available</h3>
              <p class="text-sm text-gray-500">Transform your content to see a preview</p>
            </div>
          </div>
        </div>
        
        <!-- Code Preview -->
        <div v-if="activePreviewTab === 'code'" class="preview-container">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-medium text-gray-700">Generated Code</h3>
            <button 
              v-if="transformedContent"
              @click="copyCode"
              class="text-xs px-2 py-1 text-blue-700 hover:bg-blue-50 rounded-md"
            >
              Copy Code
            </button>
          </div>
          <pre v-if="transformedContent" class="bg-gray-800 text-gray-200 p-4 rounded-md overflow-auto h-[460px] text-sm"><code>{{ generatedCode }}</code></pre>
          <div v-else class="flex flex-col items-center justify-center h-[500px] text-center border border-gray-200 rounded-md">
            <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-1">No Code Generated</h3>
            <p class="text-gray-500 mb-4">Transform your content to see the generated code</p>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex justify-between mt-6">
          <button 
            @click="saveToProject"
            class="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md font-medium"
            :disabled="!transformedContent"
          >
            Save to Project
          </button>
          
          <button 
            @click="exportContent"
            class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium"
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
import { ref, computed } from 'vue';

// State
const activeSourceTab = ref('text');
const activePreviewTab = ref('desktop');
const contentTitle = ref('');
const contentText = ref('');
const contentUrl = ref('');
const uploadedFile = ref(null);
const contentAnalyzed = ref(false);
const contentElements = ref([
  {
    type: 'text',
    preview: 'Introduction paragraph',
    content: 'This is the first paragraph of content that can be transformed into interactive elements.'
  },
  {
    type: 'list',
    preview: 'Feature list',
    content: ['Feature 1', 'Feature 2', 'Feature 3']
  },
  {
    type: 'text',
    preview: 'Description paragraph',
    content: 'This is a detailed description of the product and its features.'
  },
  {
    type: 'image',
    preview: 'Product image',
    content: 'https://via.placeholder.com/600x400'
  }
]);
const selectedElement = ref(null);
const transformationType = ref('');
const transformedContent = ref('');
const fileInput = ref(null);

// Options and Settings
const urlContentOptions = ref({
  text: true,
  images: true,
  videos: false
});

const transformationSettings = ref({
  // Accordion settings
  style: 'default',
  allowMultiple: false,
  animationSpeed: 300,
  
  // Gallery settings
  layout: 'grid',
  lightbox: true,
  captions: true,
  
  // Quiz settings
  quizType: 'multiple-choice',
  immediateFeedback: true,
  showResults: true
});

// Tabs configuration
const contentSourceTabs = [
  { id: 'text', name: 'Text' },
  { id: 'url', name: 'URL' },
  { id: 'file', name: 'File' }
];

const previewTabs = [
  { id: 'desktop', name: 'Desktop' },
  { id: 'mobile', name: 'Mobile' },
  { id: 'code', name: 'Code' }
];

// Computed properties
const selectedElementType = computed(() => {
  if (selectedElement.value === null) return null;
  return contentElements.value[selectedElement.value]?.type;
});

const generatedCode = computed(() => {
  if (!transformedContent.value) return '';
  return transformedContent.value;
});

// Methods
const analyzeContent = () => {
  if (!contentText.value.trim()) return;
  
  contentAnalyzed.value = true;
};

const fetchUrl = () => {
  if (!contentUrl.value.trim()) return;
  
  // In a real app, this would fetch and parse content from the URL
  setTimeout(() => {
    contentText.value = 'Content fetched from URL: ' + contentUrl.value;
    contentAnalyzed.value = true;
  }, 500);
};

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

const processFile = () => {
  if (!uploadedFile.value) return;
  
  // In a real app, this would parse the file contents
  setTimeout(() => {
    contentText.value = 'Content from file: ' + uploadedFile.value.name;
    contentAnalyzed.value = true;
  }, 500);
};

const selectElement = (index) => {
  selectedElement.value = index;
  transformationType.value = '';
};

const getElementTypeClass = (type) => {
  switch (type) {
    case 'text':
      return 'bg-blue-100 text-blue-800';
    case 'image':
      return 'bg-green-100 text-green-800';
    case 'list':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const applyTransformation = () => {
  if (selectedElement.value === null || !transformationType.value) return;
  
  const element = contentElements.value[selectedElement.value];
  const elementType = element.type;
  
  let html = '';
  
  if (elementType === 'text' && transformationType.value === 'accordion') {
    html = `
      <div class="interactive-accordion">
        <div class="accordion-item">
          <button class="accordion-header p-4 bg-gray-100 w-full text-left font-medium hover:bg-gray-200 transition-colors">
            Section 1
            <svg class="inline-block w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <div class="accordion-content p-4 border border-gray-200">
            <p>${element.content}</p>
          </div>
        </div>
        <div class="accordion-item mt-2">
          <button class="accordion-header p-4 bg-gray-100 w-full text-left font-medium hover:bg-gray-200 transition-colors">
            Section 2
            <svg class="inline-block w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <div class="accordion-content p-4 border border-gray-200 hidden">
            <p>Additional content would go here.</p>
          </div>
        </div>
      </div>
    `;
  } else if (elementType === 'image' && transformationType.value === 'gallery') {
    html = `
      <div class="interactive-gallery grid grid-cols-2 gap-4">
        <div class="gallery-item">
          <img src="https://via.placeholder.com/300x200" alt="Image 1" class="w-full h-auto rounded-md">
        </div>
        <div class="gallery-item">
          <img src="https://via.placeholder.com/300x200" alt="Image 2" class="w-full h-auto rounded-md">
        </div>
        <div class="gallery-item">
          <img src="https://via.placeholder.com/300x200" alt="Image 3" class="w-full h-auto rounded-md">
        </div>
        <div class="gallery-item">
          <img src="https://via.placeholder.com/300x200" alt="Image 4" class="w-full h-auto rounded-md">
        </div>
      </div>
    `;
  } else if (elementType === 'list' && transformationType.value === 'quiz') {
    html = `
      <div class="interactive-quiz">
        <div class="quiz-question mb-6">
          <h3 class="text-lg font-medium mb-2">Question 1</h3>
          <p class="mb-4">What is the main benefit of interactive content?</p>
          <div class="quiz-options space-y-2">
            <label class="flex items-center p-3 border border-gray-200 rounded-md hover:border-blue-300 cursor-pointer">
              <input type="radio" name="q1" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300">
              <span class="ml-2">Higher engagement</span>
            </label>
            <label class="flex items-center p-3 border border-gray-200 rounded-md hover:border-blue-300 cursor-pointer">
              <input type="radio" name="q1" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300">
              <span class="ml-2">Lower costs</span>
            </label>
            <label class="flex items-center p-3 border border-gray-200 rounded-md hover:border-blue-300 cursor-pointer">
              <input type="radio" name="q1" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300">
              <span class="ml-2">Faster loading</span>
            </label>
          </div>
        </div>
        <div class="quiz-question mb-6">
          <h3 class="text-lg font-medium mb-2">Question 2</h3>
          <p class="mb-4">Which of these is an interactive content type?</p>
          <div class="quiz-options space-y-2">
            <label class="flex items-center p-3 border border-gray-200 rounded-md hover:border-blue-300 cursor-pointer">
              <input type="radio" name="q2" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300">
              <span class="ml-2">Static PDF</span>
            </label>
            <label class="flex items-center p-3 border border-gray-200 rounded-md hover:border-blue-300 cursor-pointer">
              <input type="radio" name="q2" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300">
              <span class="ml-2">Interactive Quiz</span>
            </label>
            <label class="flex items-center p-3 border border-gray-200 rounded-md hover:border-blue-300 cursor-pointer">
              <input type="radio" name="q2" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300">
              <span class="ml-2">Plain Text</span>
            </label>
          </div>
        </div>
        <button class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium">Submit Answers</button>
      </div>
    `;
  } else {
    // Default fallback
    html = `<div class="transformed-content">${element.content}</div>`;
  }
  
  transformedContent.value = html;
};

const copyCode = () => {
  navigator.clipboard.writeText(generatedCode.value);
  // In a real app, show a toast notification here
};

const saveToProject = () => {
  // In a real app, this would save to a project
  alert('Content saved to project!');
};

const exportContent = () => {
  // In a real app, this would open an export dialog
  alert('Content exported!');
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>