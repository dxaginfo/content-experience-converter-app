import { createRouter, createWebHistory } from 'vue-router';

// Lazy load views for better performance
const Dashboard = () => import('../views/Dashboard.vue');
const ContentTransform = () => import('../views/ContentTransform.vue');
const ConsistencyCheck = () => import('../views/ConsistencyCheck.vue');
const EngagementOptimize = () => import('../views/EngagementOptimize.vue');
const Projects = () => import('../views/Projects.vue');
const NotFound = () => import('../views/NotFound.vue');

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      title: 'Dashboard - Content-to-Experience Converter'
    }
  },
  {
    path: '/transform',
    name: 'ContentTransform',
    component: ContentTransform,
    meta: {
      title: 'Content Transformer - Content-to-Experience Converter'
    }
  },
  {
    path: '/consistency',
    name: 'ConsistencyCheck',
    component: ConsistencyCheck,
    meta: {
      title: 'Consistency Checker - Content-to-Experience Converter'
    }
  },
  {
    path: '/optimize',
    name: 'EngagementOptimize',
    component: EngagementOptimize,
    meta: {
      title: 'Engagement Optimizer - Content-to-Experience Converter'
    }
  },
  {
    path: '/projects',
    name: 'Projects',
    component: Projects,
    meta: {
      title: 'Projects - Content-to-Experience Converter'
    }
  },
  // Legacy routes for backward compatibility
  {
    path: '/editor',
    redirect: '/transform'
  },
  {
    path: '/templates',
    redirect: '/projects'
  },
  {
    path: '/analytics',
    redirect: '/optimize'
  },
  {
    path: '/consistency-checker',
    redirect: '/consistency'
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: 'Page Not Found - Content-to-Experience Converter'
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// Update page title
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Content-to-Experience Converter';
  next();
});

export default router;