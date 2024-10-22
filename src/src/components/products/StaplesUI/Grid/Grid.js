/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { StyledColumn, StyledRow, StyledContainer } from './Grid.styles'

const NoMarginContext = React.createContext(false)

export const Row = (props) => {
  const noMargin = useContext(NoMarginContext)
  return <StyledRow noMargin={noMargin} {...props}>{props.children}</StyledRow>
}

Row.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string
  ]),
  id: PropTypes.string,
  customCSS: PropTypes.string
}

Row.defaultProps = {
  children: null,
  id: null,
  customCSS: null
}

export const Column = (props) => {
  const noMargin = useContext(NoMarginContext)
  return <StyledColumn noMargin={noMargin} {...props}>{props.children}</StyledColumn>
}

Column.propTypes = {
  span: PropTypes.number,
  spanXS: PropTypes.number,
  spanSM: PropTypes.number,
  spanMD: PropTypes.number,
  spanLG: PropTypes.number,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string
  ]),
  customCSS: PropTypes.string
}

Column.defaultProps = {
  span: null,
  spanXS: null,
  spanSM: null,
  spanMD: null,
  spanLG: null,
  children: null,
  customCSS: null
}

export const Container = (props) => (
  <NoMarginContext.Provider value={props.noMargin}>
    <StyledContainer customCSS={props.customCSS} id={props.id} {...props}>
      {props.children}
    </StyledContainer>
  </NoMarginContext.Provider>
)

Container.propTypes = {
  id: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string
  ]),
  noMargin: PropTypes.bool,
  customCSS: PropTypes.string
}

Container.defaultProps = {
  id: null,
  children: null,
  customCSS: null,
  noMargin: false
}