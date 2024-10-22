import React from 'react'
import './Footer.scss'
import { Slot } from '$core-components'

/**
 * This component represents the footer in the store
 */
const Footer = () => {
  return (
    <div className="footer">
      <Slot name="footer" />
    </div>
  )
}

export default Footer
