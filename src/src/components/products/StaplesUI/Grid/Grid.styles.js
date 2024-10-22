/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unreachable */
import { Children } from 'react'
import styled from 'styled-components'
import { isNumber } from 'lodash'
import { BREAKPOINTS } from '../utility/helpers'

const getColumnRules = (spanType, children, IEOnly) => {
  let spanRules = ''
  let repeatNum = children.length
  const spanDefinitions = []
  children.forEach((child) => {
    spanDefinitions.push(isNumber(child.props[spanType]) ? child.props[spanType] : null)
  })
  let nullResult = spanDefinitions.includes(null)
  let allEqual = spanDefinitions.every((val) => val === spanDefinitions[0])
  if (!nullResult) {
    if (allEqual) {
      repeatNum = 12 / spanDefinitions[0]
      spanRules = IEOnly ? `(${spanDefinitions[0]}fr)[${repeatNum}]` : `repeat(${repeatNum}, ${spanDefinitions[0]}fr)`
    } else {
      spanRules = `${spanDefinitions.filter((val) => val !== 0).join('fr ')}fr`
    }

    spanRules = IEOnly ? `${spanRules};` : `grid-template-columns: ${spanRules};`
  }

  return spanRules
}

const IERowRules = () => {
  let ruleStr = ''
  for (let i = 1; i <= 12; i++) {
    ruleStr += `> div:nth-child(${i}) {
      -ms-grid-column: ${i};
     }`
  }

  return ruleStr
}

/* Row notes: MSIE cannot use repeat() but will use (numfr)[numTimes] syntax to repeat rules */
export const StyledRow = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  display: -ms-grid;
  -ms-grid-columns: ${(props) =>
  Children.toArray(props.children).length !== undefined && Children.toArray(props.children).length > 0
    ? `(1fr)[${Children.toArray(props.children).length}]`
    : '1fr'};
  // LG
  ${(props) => getColumnRules('spanLG', Children.toArray(props.children))}
  -ms-grid-columns: ${(props) => getColumnRules('spanLG', Children.toArray(props.children), 'IE11')}

  @media all and (max-width: ${BREAKPOINTS.md}px) {
    ${(props) => getColumnRules('spanMD', Children.toArray(props.children))}
    -ms-grid-columns:  ${(props) => getColumnRules('spanMD', Children.toArray(props.children), 'IE11')}
  }

  @media all and (max-width: ${BREAKPOINTS.sm}px) {
    ${(props) => getColumnRules('spanSM', Children.toArray(props.children))}
    -ms-grid-columns:  ${(props) => getColumnRules('spanSM', Children.toArray(props.children), 'IE11')}
  }

  @media all and (max-width: ${BREAKPOINTS.xs}px) {
    ${(props) => getColumnRules('spanXS', Children.toArray(props.children))}
    -ms-grid-columns:  ${(props) => getColumnRules('spanXS', Children.toArray(props.children), 'IE11')}
  }

  ${(props) => getColumnRules('span', Children.toArray(props.children))}
  -ms-grid-columns:  ${(props) => getColumnRules('span', Children.toArray(props.children), 'IE11')}

  ${IERowRules()} // for IE
  ${(props) => (props.customCSS ? props.customCSS : '')}
`

export const StyledColumn = styled.div`
  margin: ${(props) => (props.noMargin ? '0' : '6px')};
  -ms-grid-row: 1; // for IE
  /* Hide columns that are set to zero in breakpoint */
  display: ${(props) => (props.span !== 0 ? 'block' : 'none')};

  @media all and (max-width: ${BREAKPOINTS.lg}px) {
    display: ${(props) => (props.spanLG !== 0 ? 'block' : 'none')};
  }
  @media all and (max-width: ${BREAKPOINTS.md}px) {
    display: ${(props) => (props.spanMD !== 0 ? 'block' : 'none')};
  }
  @media all and (max-width: ${BREAKPOINTS.sm}px) {
    display: ${(props) => (props.spanSM !== 0 ? 'block' : 'none')};
  }
  @media all and (max-width: ${BREAKPOINTS.xs}px) {
    display: ${(props) => (props.spanXS !== 0 ? 'block' : 'none')};
  }
  ${(props) => (props.customCSS ? props.customCSS : '')}
`

export const StyledContainer = styled.div`
  max-width: 1440px;
  width: 100%;
  margin: ${(props) => (props.noMargin ? '0 auto' : '12px auto')};
  padding: ${(props) => (props.noMargin ? '0' : '0 12px')};
  ${(props) => (props.customCSS ? props.customCSS : '')}
`