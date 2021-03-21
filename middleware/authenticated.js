export default async function ({ store, redirect, route }) {
  await store.dispatch('silentLogin')

  const isAuthenticated = store.getters.isAuthenticated

  console.log({ isAuthenticated })

  if (!isAuthenticated) {
    if (['any-text', 'any-text', 'extended'].includes(route.name)) {
      return redirect('/login')
    }
    return
  }
  if (['login', 'register'].includes(route.name)) {
    return redirect('/same-text')
  }
}
