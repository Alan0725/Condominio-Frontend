import { createRouter, createWebHistory } from 'vue-router'
import { user } from './session'
import Chat from './components/Chat.vue'
import AsambleaList from './pages/AsambleaList.vue'
import AsambleaDetail from './pages/AsambleaDetail.vue'
import MultaDetail from './pages/MultaDetail.vue'
import PagoAtrasadoDetail from './pages/PagoAtrasadoDetail.vue'
import AdminPanel from './pages/AdminPanel.vue'

const routes = [
  { path: '/', name: 'chat', component: Chat },
  { path: '/asambleas', name: 'asambleas', component: AsambleaList },
  { path: '/asambleas/:id', name: 'asamblea-detail', component: AsambleaDetail, props: true },
  { path: '/multas/:id', name: 'multa-detail', component: MultaDetail, props: true },
  { path: '/pagos-atrasados/:id', name: 'pago-detail', component: PagoAtrasadoDetail, props: true },
  { path: '/admin', name: 'admin', component: AdminPanel, meta: { requiresAdmin: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  if (to.meta.requiresAdmin && !user.value?.is_admin) {
    return { name: 'chat' }
  }
})

export default router
