import endpoints from './endpoints.js'

const { FORWARDSLASH } = endpoints
export const doSetForwardslash = (...args) => {
  // This function sets the forward slash in the URL
  // It takes multiple arguments and joins them with a forward slash
  if (args.length === 0) {
    return FORWARDSLASH
  }
  if (args.length === 1) {
    return FORWARDSLASH + args[0]
  }

  return FORWARDSLASH + args.join(FORWARDSLASH).replace(/\/+/g, FORWARDSLASH)
}
