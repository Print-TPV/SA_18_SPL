import React, { useContext, createContext } from 'react'
import PropTypes from 'prop-types'

export const CustomContext = createContext()
export const TabsContext = createContext()
export const AccordionContext = createContext()
export const AccordionItemContext = createContext()
export const LinearThermometerContext = createContext()
export const ToggleContext = createContext()
export const QuantityContext = createContext()
export const DropdownContext = createContext()
export const VisualFilterContext = createContext()

export const CustomProvider = ({ children, value }) => (
  <CustomContext.Provider value={value}>{children}</CustomContext.Provider>
)

export const useCustomContext = (Context) => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useCustomContext must be used within a component')
  }
  return context
}

/** Props **/
CustomProvider.defaultProps = {
  value: {},
  children: null,
}
CustomProvider.propTypes = {
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}