import React from 'react'
import PropTypes from 'prop-types'
import { hasProperty } from '../utility/helpers'
import { specialIcons } from '../styles/svg'
// eslint-disable-next-line import/no-cycle
import { Icon } from './Icon'
import { Double } from './DoubleIcon.styles'
import { InnerCircle } from './Icon.styles'

/** Component **/

export function DoubleIcon(props) {
  const { size, colors, color, children, name, backgroundColor, customCSS, id, ...rest } = props

  return (
    <Double
      customCSS={customCSS}
      id={id}
      size={size || children[0]?.props.size}
      {...rest}
    >
      {name ? (
        <SpecialDouble
          name={name} size={size} color={color}
          background={backgroundColor} />
      ) : (
        children
      )}
    </Double>
  )
}

function SpecialDouble(props) {
  const { size, name, background, color } = props
  const data = specialIcons[name]
  return (
    <>
      <Icon name={data?.icons[0]} size={size} color={hasProperty(data, 'colors') ? data.colors[0] : color || 'black'} />
      {data?.middle !== undefined ? (
        <InnerCircle
          size={size * data?.middle.size}
          top={size * data?.middle.top}
          left={size * data?.middle.left}
          background={background || data?.middle.background}
        />
      ) : (
        ''
      )}
      <Icon name={data?.icons[1]} size={size} color={hasProperty(data, 'colors') ? data.colors[1] : color || 'black'} />
    </>
  )
}

/** Props **/

SpecialDouble.defaultProps = {
  name: null,
  size: null,
  color: null,
  background: 'white',
}

SpecialDouble.propTypes = {
  name: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.string,
  background: PropTypes.string,
}

DoubleIcon.defaultProps = {
  name: null,
  colors: [],
  color: null,
  size: null,
  id: null,
  children: null,
  customCSS: null,
  backgroundColor: null,
  invert: false,
}

DoubleIcon.propTypes = {
  name: PropTypes.string,
  colors: PropTypes.arrayOf(PropTypes.string),
  color: PropTypes.string,
  size: PropTypes.number,
  id: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.node),
  customCSS: PropTypes.string,
  backgroundColor: PropTypes.string,
  invert: PropTypes.bool,
}