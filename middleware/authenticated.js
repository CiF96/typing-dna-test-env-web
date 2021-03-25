export default async function ({ store, redirect, route }) {
  await store.dispatch('silentLogin')

  const isAuthenticated = store.getters.isAuthenticated

  console.log({ isAuthenticated })

  if (route.name == null) {
    return redirect('/login')
  }

  if (!isAuthenticated) {
    if (['same-text', 'any-text', 'extended'].includes(route.name)) {
      return redirect('/login')
    }
    return
  }
  if (['login', 'register'].includes(route.name)) {
    return redirect('/same-text')
  }
}
