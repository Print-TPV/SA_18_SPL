import React from 'react'
import PropTypes from 'prop-types'
import { validIcons, specialIcons } from '../styles/svg'
import { exists } from '../utility/helpers'
import { Svg, Number, NumberWrapper } from './Icon.styles'
// eslint-disable-next-line import/no-cycle
import { DoubleIcon } from './DoubleIcon'

/* Component */

export function Icon(props) {
  const { name, block, size, children, color, ...rest } = props
  if (name === 'number') {
    // Special icons
    return (
      <NumberWrapper {...rest}>
        <Number color={color} size={size}>
          {children}
        </Number>
      </NumberWrapper>
    )
  }
  if (Object.keys(specialIcons).includes(name)) {
    return <DoubleIcon name={name} size={size} color={color} {...rest} />
  }
  if (exists(validIcons[name])) {
    return (
      // Normal icon
      <Svg
        viewBox={
          exists(validIcons[name].viewHeight)
            ? `0 0 ${validIcons[name].viewWidth} ${validIcons[name].viewHeight}`
            : '0 0 40 40'
        }
        block={block}
        focusable={false}
        aria-hidden
        style={exists(validIcons[name].style) ? validIcons[name].style : null}
        size={size}
        height={`${size}px`}
        width={`${size}px`}
        color={color}
        {...rest}
      >
        <g fillRule="evenodd">
          {validIcons[name].paths.map((path, index) => (
            <path
              key={index}
              d={path}
              fill={
                exists(validIcons[name].pathColors)
                  ? validIcons[name].pathColors[index]
                  : 'inherit'
              }
            />
          ))}
        </g>
      </Svg>
    )
  }
  return (
    // Generic unrecoginized icon
    <Number color="light_gray_2" size={size}>
      ?
    </Number>
  )
}

/* Props */

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  block: PropTypes.bool,
  size: PropTypes.number,
  color: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

Icon.defaultProps = {
  block: false,
  size: 40,
  color: 'black',
  children: 0,
}
