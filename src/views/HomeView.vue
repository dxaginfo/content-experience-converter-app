<template>
  <div class="home">
    <section class="hero bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20">
      <div class="container mx-auto px-6">
        <div class="flex flex-col lg:flex-row items-center">
          <div class="lg:w-1/2 mb-10 lg:mb-0">
            <h2 class="text-4xl font-bold mb-6">Transform Static Content Into Interactive Experiences</h2>
            <p class="text-xl mb-8">
              Convert your articles, reports, and presentations into engaging, 
              interactive content that drives higher engagement and retention.
            </p>
            <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <router-link to="/editor" class="btn-primary">
                Start Creating
              </router-link>
              <button @click="scrollToFeatures" class="btn-secondary">
                Learn More
              </button>
            </div>
          </div>
          <div class="lg:w-1/2 flex justify-center">
            <div class="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
              <img src="../assets/dashboard-preview.png" alt="Application Preview" class="w-full">
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="features" class="py-16">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold text-center mb-12">Key Features</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="feature-card">
            <div class="icon-wrapper">
              <i class="fas fa-magic text-3xl text-indigo-600"></i>
            </div>
            <h3 class="text-xl font-bold mb-3">Content Transformation</h3>
            <p class="text-gray-600">
              Convert static text, images, and videos into interactive elements 
              that engage your audience and enhance content retention.
            </p>
          </div>
          
          <!-- Feature 2 -->
          <div class="feature-card">
            <div class="icon-wrapper">
              <i class="fas fa-sync-alt text-3xl text-indigo-600"></i>
            </div>
            <h3 class="text-xl font-bold mb-3">Multi-platform Consistency</h3>
            <p class="text-gray-600">
              Ensure your brand and message remain consistent across different 
              platforms and device types with our consistency checker.
            </p>
          </div>
          
          <!-- Feature 3 -->
          <div class="feature-card">
            <div class="icon-wrapper">
              <i class="fas fa-chart-line text-3xl text-indigo-600"></i>
            </div>
            <h3 class="text-xl font-bold mb-3">Engagement Optimization</h3>
            <p class="text-gray-600">
              Receive AI-powered suggestions to improve engagement metrics 
              and maximize the impact of your interactive content.
            </p>
          </div>
          
          <!-- Feature 4 -->
          <div class="feature-card">
            <div class="icon-wrapper">
              <i class="fas fa-calculator text-3xl text-indigo-600"></i>
            </div>
            <h3 class="text-xl font-bold mb-3">ROI Measurement</h3>
            <p class="text-gray-600">
              Track and measure the impact of your interactive content compared 
              to static content with detailed analytics and reporting.
            </p>
          </div>
          
          <!-- Feature 5 -->
          <div class="feature-card">
            <div class="icon-wrapper">
              <i class="fas fa-cubes text-3xl text-indigo-600"></i>
            </div>
            <h3 class="text-xl font-bold mb-3">Interactive Templates</h3>
            <p class="text-gray-600">
              Choose from a library of ready-to-use templates for common content 
              scenarios to speed up your creation process.
            </p>
          </div>
          
          <!-- Feature 6 -->
          <div class="feature-card">
            <div class="icon-wrapper">
              <i class="fas fa-mobile-alt text-3xl text-indigo-600"></i>
            </div>
            <h3 class="text-xl font-bold mb-3">Responsive Design</h3>
            <p class="text-gray-600">
              All interactive experiences automatically adapt to different 
              screen sizes for optimal viewing on any device.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-gray-100 py-16">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold text-center mb-12">How It Works</h2>
        
        <div class="max-w-4xl mx-auto">
          <div class="steps">
            <!-- Step 1 -->
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-content">
                <h3 class="text-xl font-bold mb-2">Upload Your Content</h3>
                <p class="text-gray-600">
                  Start by uploading your static content - text documents, 
                  presentations, images, or videos.
                </p>
              </div>
            </div>
            
            <!-- Step 2 -->
            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-content">
                <h3 class="text-xl font-bold mb-2">Transform Elements</h3>
                <p class="text-gray-600">
                  Use our intuitive editor to transform static elements into 
                  interactive components like quizzes, galleries, and more.
                </p>
              </div>
            </div>
            
            <!-- Step 3 -->
            <div class="step-item">
              <div class="step-number">3</div>
              <div class="step-content">
                <h3 class="text-xl font-bold mb-2">Preview Across Platforms</h3>
                <p class="text-gray-600">
                  Preview your interactive experience on different devices 
                  and platforms to ensure consistency.
                </p>
              </div>
            </div>
            
            <!-- Step 4 -->
            <div class="step-item">
              <div class="step-number">4</div>
              <div class="step-content">
                <h3 class="text-xl font-bold mb-2">Optimize & Deploy</h3>
                <p class="text-gray-600">
                  Apply optimization suggestions, then deploy your interactive 
                  content to your website, blog, or social media.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16">
      <div class="container mx-auto px-6 text-center">
        <h2 class="text-3xl font-bold mb-8">Ready to Transform Your Content?</h2>
        <p class="text-xl mb-10 max-w-3xl mx-auto">
          Start creating engaging interactive experiences today with our 
          easy-to-use Content-to-Experience Converter.
        </p>
        <router-link to="/editor" class="btn-primary text-lg px-8 py-4">
          Get Started Now
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  methods: {
    scrollToFeatures() {
      document.getElementById('features').scrollIntoView({
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style scoped>
.btn-primary {
  @apply bg-indigo-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out text-center;
}

.btn-secondary {
  @apply bg-white text-indigo-600 font-medium py-3 px-6 rounded-lg border border-indigo-600 hover:bg-indigo-50 transition duration-300 ease-in-out text-center;
}

.feature-card {
  @apply bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out;
}

.icon-wrapper {
  @apply mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100;
}

.steps {
  @apply space-y-12;
}

.step-item {
  @apply flex items-start;
}

.step-number {
  @apply flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-bold mr-4;
}

.step-content {
  @apply flex-grow;
}
</style>