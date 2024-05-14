import { createRouter, createWebHistory } from 'vue-router';
//import AppLayout from '@/layout/AppLayout.vue';
import AppLayout from '@/layout/AppLayoutNew.vue';
import { useAuthStore } from '@/stores'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/DashboardNew.vue')
                },
                {
                    path: '/store',
                    name: 'store',
                    component: () => import('@/views/TheStore.vue')
                },
                {
                    path: '/partner',
                    name: 'partner',
                    component: () => import('@/views/ThePartner.vue')
                },
                {
                    path: '/EMP-GOTP',
                    name: 'emp-gotp',
                    component: () => import('@/views/TheEmpGOTP.vue')
                },
                {
                    path: '/home',
                    name: 'dashboardNew',
                    component: () => import('@/views/DashboardNew.vue')
                },
                {
                    path: '/activeUsers',
                    name: 'activeUsers',
                    component: () => import('@/views/ActiveUsersTable.vue')
                },
                {
                    path: '/users/:realm/:username',
                    name: 'usertable',
                    component: () => import('@/views/UserTable.vue'),
                    props: true,
                },
                {
                    path: '/users/create',
                    name: 'userCreate',
                    component: () => import('@/views/UserCreate.vue'),
                    props: true,
                },
                {
                    path: '/account',
                    name: 'account',
                    component: () => import('@/views/auth/AdminList.vue')
                },
                {
                    path: '/account/add',
                    name: 'accountadd',
                    component: () => import('@/views/auth/AdminEdit.vue')
                },
                {
                    path: '/account/edit/:uid',
                    name: 'accountedit',
                    component: () => import('@/views/auth/AdminEdit.vue')
                },
                {
                    path: '/account/files',
                    name: 'filemanager',
                    component: () => import('@/views/auth/FileManager.vue')
                }
            ]
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

router.beforeEach(async (to) => {
  
    // redirect to login page if not logged in and trying to access a restricted page 
    const publicPages = ['/auth/login', '/pages/notfound'];
    const authRequired = !publicPages.includes(to.path);
    const adminPages = ['/EMP-GOTP','/account/add', '/account/files']
    const adminRquired = adminPages.includes(to.path)
  
    const authStore = useAuthStore()
   
    // if (authStore.userinfo.exp*1000 < Date.now()) {
    //   console.log(authStore.userinfo.exp*1000,", ",Date.now())
    //   console.log("token expired at:" + new Date(authStore.userinfo.exp*1000))
    // }

    if (authRequired && !authStore.userinfo.jwtToken) {
        return '/auth/login';
    } else if (adminRquired && !authStore.userinfo.isAdmin) {
      return '/auth/access'
    }
  })

export default router;
