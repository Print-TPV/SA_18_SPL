import React, { useState, useRef, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import find from 'lodash/find'
import { DropdownMenu } from '../Common-components/DropdownMenu'

import { DropdownButton } from './sub-components/DropdownButton'
import { DropdownContext } from '../utility/useCustomContext'
import { DropdownContainer } from './sub-components/DropdownContainer'
import { useOnClickOutside, getInitialBreakpoint } from '../utility/helpers'
import { Breakpoint } from '../Breakpoint/Breakpoint'
import { ErrorMessage } from '../ErrorMessage/ErrorMessage'
import { getTypeAhead } from '../utility/TypeAhead'

export const Dropdown = (props) => {
  const {
    options,
    disabled,
    dropdownDirection,
    dropdownHeight,
    label,
    defaultValue,
    onChange,
    id,
    customCSS,
    issortDropdown,
    align,
    labelBGColor,
    deliveryIcon,
    labelFontsize,
    labelFontfamily,
    dropDownType,
    height,
    isDefaultLoad,
    width,
    ariaLabel,
    onHoverDropdown,
    ...rest
  } = props

  const getCurrentValue = () => {
    let currentValue = ''
    if (defaultValue) {
      currentValue = find(options, (option) => {
        if (option instanceof Object) {
          return option.value === defaultValue
        }
        if (typeof option === 'number') {
          return option === defaultValue
        }
        return option?.toLowerCase() === defaultValue?.toLowerCase()
      })
    }
    return currentValue
  }

  const [open, setOpen] = useState(false)
  const [currValue, setCurrValue] = useState(getCurrentValue())
  const [dropdownPosition, setDropdownPosition] = useState(dropdownDirection)
  const [dropdownIndex, setDropdownIndex] = useState(0)
  const [currentBreakpoint, setCurrentBreakpoint] = useState(
    getInitialBreakpoint()
  )

  // Filter result
  const [filteredResults, setFilteredResults] = useState(false)
  const [filteredObj, setFilteredObj] = useState(false)
  const [inputValue, setInputValue] = useState('')

  useMemo(() => {
    if (dropDownType === 'typeAhead') {
      setFilteredResults(
        options.length > 0 && typeof options[0] === 'object'
          ? options.map((item) => item.text)
          : options
      )
      setFilteredObj(
        options.length > 0 && typeof options[0] === 'object' ? options : false
      )
    } else {
      setFilteredResults('')
      setFilteredObj('')
    }
  }, [options, dropDownType])

  const wrapperRef = useRef(null)
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)

  let keysSoFar = ''
  let searchTimeout = null

  useOnClickOutside(wrapperRef, () => setOpen(false))

  const handleChange = (e) => {
    setOpen(true)
    setCurrValue('')
    setInputValue(e.target.value)
    getTypeaheadResults(e.target.value)
  }

  const getTypeaheadResults = (searchValue) => {
    let typeaheadResults = []
    if (filteredResults) {
      if (filteredObj) {
        const textArray = options.map((item) => item.text)
        typeaheadResults = getTypeAhead(textArray, searchValue)
        const filtered = options.filter((item) =>
          typeaheadResults.includes(item.text)
        )
        setFilteredObj(filtered)
      } else {
        typeaheadResults = getTypeAhead(options, searchValue)
      }
      setFilteredResults(typeaheadResults)
    }
  }

  const breakpointCallback = (breakpoint) => {
    if (currentBreakpoint !== breakpoint) {
      setCurrentBreakpoint(breakpoint)
    }
  }
  const selectOption = (e, item) => {
    setOpen(false)
    changeValue(e, item)
    if (dropDownType === 'typeAhead' && inputRef && inputRef.current) {
      inputRef.current.blur()
    }
  }

  const changeValue = (e, item) => {
    // set state value and send callback to consumer
    setCurrValue(item)
    setDropdownIndex(options.indexOf(item))
    if (dropDownType === 'typeAhead') {
      setInputValue(item && item.text ? item.text : item)
    }
    onChange(e, item)
  }

  const openDropdown = () => {
    setOpen(!open)
    if (dropdownDirection === 'auto') dropdownMenuPosition()
  }

  const dropdownMenuPosition = () => {
    const pageHeight = window && window.innerHeight
    const dropdownBtnPosition =
      wrapperRef && wrapperRef.current
        ? wrapperRef.current.getBoundingClientRect()
        : false
    const dropdownMenuRef =
      dropdownRef && dropdownRef.current ? dropdownRef.current : false
    if (dropdownBtnPosition && dropdownMenuRef) {
      setDropdownPosition(
        pageHeight - dropdownBtnPosition.bottom >
          dropdownMenuRef.clientHeight + dropdownBtnPosition.bottom
          ? 'down'
          : 'up'
      )
    }
  }

  const filterOptions = (fOptions = [], filter, exclude = []) =>
    fOptions.filter((option) => {
      const matches =
        option &&
        typeof option !== 'object' &&
        option?.toLowerCase().indexOf(filter.toLowerCase()) === 0
      return matches && exclude.indexOf(option) < 0
    })

  const getIndexByLetter = (searchString, searchIndex) => {
    const orderedOptions = [
      ...options.slice(searchIndex),
      ...options.slice(0, searchIndex),
    ]

    const firstMatch = filterOptions(orderedOptions, searchString)[0]
    const allSameLetter = (array) =>
      array.every((letter) => letter === array[0])

    // first check if there is an exact match for the typed string
    if (firstMatch) {
      return options.indexOf(firstMatch)
    }

    // if the same letter is being repeated, cycle through first-letter matches
    if (allSameLetter(searchString.split(''))) {
      const matches = filterOptions(orderedOptions, searchString[0])
      return options.indexOf(matches[0])
    }

    // if no matches, return -1
    return -1
  }
  const getSearchString = (char) => {
    // reset typing timeout and start new timeout
    // this allows us to make multiple-letter matches, like a native select
    if (typeof searchTimeout === 'number') {
      window.clearTimeout(searchTimeout)
    }
    searchTimeout = window.setTimeout(() => {
      keysSoFar = ''
    }, 500)

    keysSoFar += char

    return keysSoFar
  }

  const findItemToFocus = (letter) => {
    if (dropDownType === 'standard') {
      const searchString = getSearchString(letter)
      const activeIndex = dropdownIndex + 1
      // find the index of the first matching option
      const searchIndex = getIndexByLetter(searchString, activeIndex)
      // if a match was found, go to it
      if (searchIndex >= 0) {
        setDropdownIndex(searchIndex)
      } else {
        window.clearTimeout(searchTimeout)
        keysSoFar = ''
      }
    }
  }

  const focusItem = (optionIndexValue) => {
    document.getElementById(`itemQty_${optionIndexValue}`).focus()
  }

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'Enter':
        if (open) {
          selectOption(e, options[dropdownIndex])
          e.preventDefault()
        } else {
          setOpen(true)
        }
        break
      case 'Tab':
        setOpen(true)
        break
      case 'Escape':
        setOpen(false)
        break
      case 'ArrowUp':
        if (open) {
          const index = dropdownIndex > 0 ? dropdownIndex - 1 : 0
          setDropdownIndex(index)
          if (dropdownRef.current.scrollTop === 0) e.preventDefault()
          focusItem(index)
          setOpen(true)
        }
        break
      case 'ArrowDown':
        if (open) {
          const index =
            dropdownIndex <= options.length - 2
              ? dropdownIndex + 1
              : options.length - 1
          setDropdownIndex(index)
          if (
            dropdownRef.current.scrollHeight -
            dropdownRef.current.offsetHeight ===
            dropdownRef.current.scrollTop
          )
            e.preventDefault()
          focusItem(index)
          setOpen(true)
        }
        break
      default:
        findItemToFocus(e.key)
        break
    }
  }

  useEffect(() => {
    if (defaultValue && isDefaultLoad) {
      setCurrValue(
        find(options, (option) => {
          if (option instanceof Object) {
            return option.value === defaultValue
          }
          if (typeof option === 'number') {
            return option === defaultValue
          }
          return option?.toLowerCase() === defaultValue?.toLowerCase()
        })
      )
    }
  }, [defaultValue, options, isDefaultLoad])

  useEffect(() => {
    if (open && dropdownRef && dropdownRef.current) {
      dropdownRef.current.focus()
    }
    if (dropDownType === 'typeAhead' && open && inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open, dropDownType])

  // only runs on initial load
  useEffect(() => {
    const defaultIndex = options.indexOf(currValue)
    if (defaultIndex > -1 && defaultIndex !== 0) {
      setDropdownIndex(defaultIndex)
    }
  }, [options, currValue])

  return (
    <DropdownContext.Provider
      value={{
        setOpen,
        wrapperRef,
        disabled,
        open,
        openDropdown,
        currValue,
        handleKeyDown,
        selectOption,
        dropdownIndex,
        dropdownPosition,
        dropdownRef,
        dropDownType,
        inputValue,
        filteredResults,
        dropdownDirection,
        ...rest,
      }}
    >
      <DropdownContainer id={id} customCSS={customCSS}>
        {(
          <DropdownButton
            label={label}
            issortDropdown={issortDropdown}
            labelBGColor={labelBGColor}
            labelFontsize={labelFontsize}
            labelFontfamily={labelFontfamily}
            handleChange={handleChange}
            inputValue={inputValue}
            dropDownType={dropDownType}
            setOpen={setOpen}
            inputRef={inputRef}
            height={height}
            width={width}
            ariaLabel={ariaLabel}
            {...rest}
          />
        )}
        <DropdownMenu
          dropdownHeight={dropdownHeight}
          align={align}
          issortDropdown={issortDropdown}
          onHoverDropdown={onHoverDropdown}
          options={
            dropDownType === 'typeAhead'
              ? !filteredObj
                ? filteredResults
                : filteredObj
              : options
          }
          {...rest}
        />
        {rest.errorMsg && <ErrorMessage>{rest.errorMsg}</ErrorMessage>}
        <Breakpoint onBreakpointChange={breakpointCallback} />
      </DropdownContainer>
    </DropdownContext.Provider>
  )
}

Dropdown.defaultProps = {
  options: null,
  disabled: false,
  dropdownHeight: '20vh',
  dropdownDirection: 'auto',
  label: '',
  defaultValue: '',
  onChange: () => { },
  id: '',
  customCSS: null,
  issortDropdown: false,
  align: 'left',
  isRequired: false,
  errorMsg: null,
  labelBGColor: 'white',
  ariaLabel: 'Dropdown',
  deliveryIcon: 'union',
  labelFontsize: '',
  labelFontfamily: 'motiva-light',
  placeholder: '',
  dropDownType: 'standard',
  size: 'md',
  height: '40px',
  isDefaultLoad: true,
  width: '230px',
  onHoverDropdown: () => {},
}

Dropdown.propTypes = {
  options: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.any,
        optionHTML: PropTypes.any,
      })
    ),
  ]),
  disabled: PropTypes.bool,
  dropdownHeight: PropTypes.string,
  dropdownDirection: PropTypes.string,
  label: PropTypes.string,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  id: PropTypes.string,
  customCSS: PropTypes.string,
  issortDropdown: PropTypes.bool,
  align: PropTypes.oneOf(['left', 'right']),
  isRequired: PropTypes.bool,
  errorMsg: PropTypes.string,
  labelBGColor: PropTypes.string,
  ariaLabel: PropTypes.string,
  deliveryIcon: PropTypes.string,
  labelFontsize: PropTypes.string,
  labelFontfamily: PropTypes.oneOf(['motiva-light', 'motiva']),
  placeholder: PropTypes.string,
  dropDownType: PropTypes.oneOf(['standard', 'typeAhead', 'delivery']),
  size: PropTypes.oneOf(['sm', 'md']),
  height: PropTypes.string,
  isDefaultLoad: PropTypes.bool,
  width: PropTypes.string,
  onHoverDropdown: PropTypes.func,
}