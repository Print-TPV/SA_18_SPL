import React from 'react'
import PropTypes from 'prop-types'
import { GridContainer, CardWrapper } from './UtilityGrid.styles'

/** Component **/

export function UtilityGrid(props) {
  const { customCSS, id, children } = props

  return (<GridContainer id={id} customCSS={customCSS}>
    {children &&
    children.map((item, index) => (
      <CardWrapper
        name={`grid-card-${index + 1}`}
        key={index}>
        {item}
      </CardWrapper>
    ))}
  </GridContainer>)
}

/** Props **/

UtilityGrid.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string
  ]),
  id: PropTypes.string,
  customCSS: PropTypes.string
}

UtilityGrid.defaultProps = {
  children: null,
  id: null,
  customCSS: null
}