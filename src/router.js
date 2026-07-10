import { createRouter, createWebHistory } from 'vue-router'
import { user } from './session'
import { pushToast } from './toast'
import Chat from './components/Chat.vue'
import AsambleaList from './pages/AsambleaList.vue'
import AsambleaDetail from './pages/AsambleaDetail.vue'
import MultaDetail from './pages/MultaDetail.vue'
import PagoAtrasadoDetail from './pages/PagoAtrasadoDetail.vue'
import AdminPanel from './pages/AdminPanel.vue'
import Account from './pages/Account.vue'

const ALL_ROLES = ['resident', 'admin']

const routes = [
  { path: '/', name: 'chat', component: Chat, meta: { roles: ALL_ROLES } },
  { path: '/asambleas', name: 'asambleas', component: AsambleaList, meta: { roles: ALL_ROLES } },
  { path: '/asambleas/:id', name: 'asamblea-detail', component: AsambleaDetail, props: true, meta: { roles: ALL_ROLES } },
  { path: '/multas/:id', name: 'multa-detail', component: MultaDetail, props: true, meta: { roles: ALL_ROLES } },
  { path: '/pagos-atrasados/:id', name: 'pago-detail', component: PagoAtrasadoDetail, props: true, meta: { roles: ALL_ROLES } },
  { path: '/admin', name: 'admin', component: AdminPanel, meta: { roles: ['admin'] } },
  { path: '/cuenta', name: 'account', component: Account, meta: { roles: ALL_ROLES } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Role-based access middleware: every navigation is checked against the
// destination route's allowed roles before it's permitted to proceed. When
// there's no user at all, App.vue renders the login screen instead of this
// router's views, so there's nothing to guard — and redirecting to "chat"
// in that case would just fail its own role check and loop forever.
router.beforeEach((to) => {
  if (!user.value) return

  const allowedRoles = to.meta.roles

  if (allowedRoles && !allowedRoles.includes(user.value.role)) {
    pushToast('No tienes permiso para acceder a esta sección.', 'error')
    return { name: 'chat' }
  }
})

export default router
