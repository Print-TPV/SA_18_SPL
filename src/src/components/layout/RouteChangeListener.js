import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getCssSelector } from 'css-selector-generator'
import legacyIframeHandler from '$ustoreinternal/services/legacyIframeHandler'

let lastSelectedNode

function RouteChangeListener () {
  const location = useLocation()

  useEffect(() => {
    document.body.addEventListener('focusin', (e) => {
      lastSelectedNode = getCssSelector(e.target)
    })
  }, [])

  useEffect(() => {
    // This callback will be invoked every time the location (route) changes
    legacyIframeHandler.handleRoute(location.pathname + location.search)

    if (lastSelectedNode) {
      document.querySelector(lastSelectedNode)?.focus()
    }
  }, [location])  // The effect will re-run when the location changes

  return null  // This component doesn't render anything
}

export default RouteChangeListener
