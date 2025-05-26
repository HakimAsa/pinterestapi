import helmet from 'helmet'
import compression from 'compression'

export default function (app) {
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        //CSP issue on production
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            // Add the hash from my browser error: need to be updated
            "'sha256-ZomnyosL2bmZ79LmErHEhL+1fVaBj9NngvpOK/l4qio='",
          ],
          styleSrc: ["'self'", "'unsafe-inline'"], // Optional, needed if styles are inline too
          objectSrc: ["'none'"],
          imgSrc: ["'self'", 'data:'], // Allow images if needed
        },
      },
    })
  )
  app.use(compression())
}
