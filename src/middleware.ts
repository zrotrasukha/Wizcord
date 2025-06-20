import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/', '/dashboard(.*)', '/forum(.*)']);

const isPublicRoute = createRouteMatcher(['/api/uploadthing']);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth()

  if( isPublicRoute(req)) return; 

  if (!userId && isProtectedRoute(req)) {
    // Add custom logic to run before redirecting
    console.log('🪵 You must be signed in to view this page');
    return redirectToSignIn()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
