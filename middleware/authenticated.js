export default async function ({ store, redirect, route }) {
  const isAuthenticated = await store.dispatch('silentLogin')

  console.log({ isAuthenticated })

  if (!isAuthenticated) {
    if (route.name === 'login') {
      return
    }
    return redirect('/login')
  } else {
    if (route.name === 'dashboard') {
      return
    }
    return redirect('/dashboard')
  }
}
