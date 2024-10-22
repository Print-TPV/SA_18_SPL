import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { checkWindow, getBreakpoint, getInitialBreakpoint } from '../utility/helpers'

/** Component **/

export function Breakpoint(props) {
  const { onResize, onBreakpointChange } = props
  const [breakpoint, setBreakpoint] = useState(getInitialBreakpoint())
  const [resizeTimeout, setResizeTimeout] = useState(null)

  useEffect(() => {
    const width = window.innerWidth
    const currBreakpoint = getBreakpoint()
    onBreakpointChange(currBreakpoint)
    onResize(width)
    if (checkWindow()) window.addEventListener('resize', resizeThrottler, false)
    return () => {
      if (checkWindow()) window.removeEventListener('resize', resizeThrottler, false)
    }
  })

  const handleResize = () => {
    if (checkWindow()) {
      const width = window.innerWidth
      const currBreakpoint = getBreakpoint()
      // Only notify consumers if the breakpoint changes
      if (breakpoint !== currBreakpoint && onBreakpointChange) {
        setBreakpoint(currBreakpoint)
        onBreakpointChange(currBreakpoint)
      }
      if (onResize) {
        onResize(width)
      }
    }
  }

  const resizeThrottler = () => {
    if (!resizeTimeout) {
      setResizeTimeout(true)
      setTimeout(() => {
        setResizeTimeout(null)
        handleResize()
      }, TIMEOUT_TIMER)
    }
  }

  return null
}

/** Constants **/

const TIMEOUT_TIMER = 100

/** Props **/

Breakpoint.defaultProps = {
  onBreakpointChange: () => { },
  onResize: () => { },
}

Breakpoint.propTypes = {
  onBreakpointChange: PropTypes.func, //send breakpoint as parameter to callback
  onResize: PropTypes.func, //on all resizes, send window size as parameter
}