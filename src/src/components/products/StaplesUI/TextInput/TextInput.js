import React, {
    useState,
    useRef,
    useEffect,
    useMemo,
    useImperativeHandle,
    forwardRef,
  } from 'react'
  import PropTypes from 'prop-types'
  import { stopProp, KEYCODES } from '../utility/helpers'
  import {
    Input,
    Label,
    InputWrapper,
    MainWrapper,
    InputWrapperContainer,
    InputTagContainer,
  } from './TextInput.style'
  import { DropdownContext } from '../utility/useCustomContext'
  
  /** Component **/
  export const TextInput = forwardRef((props, ref) => {
    const inputRef = useRef(null)
    const wrapperRef = useRef(null)
    const dropdownRef = useRef(null)
  
    const {
      disabled,
      label,
      placeholder,
      showCloseBtn,
      clearInput,
      onChange,
      onBlur,
      value,
      type,
      maxLength,
      id,
      errorMsg,
      isRequired,
      name,
      noSpaces,
      customCSS,
      onFocus,
      charLimit,
      hint,
      callbackFnOnEdit,
      convertToUppercase,
      size,
      showEdit,
      labelBGColor,
      ariaLabel,
      textInputType,
      options,
      onSelect,
      resetInput,
      showDropdown,
      onSearch,
      onFilter,
      autoCompleteValue,
      allowNewEntry,
      multiple,
      onDelete,
      keyDownHandler,
      isDecimal,
      previousValue,
      ...rest
    } = props
  
    const [activeState, setActiveState] = useState(false)
    const [focusState, setFocusState] = useState(false)
    const [inputValue, setInputValue] = useState(value || '')
    const [previousInputValue, setPreviousInputValue] = useState(previousValue || '')
    const [edit, setEdit] = useState(showEdit)
    const [error, setError] = useState('')
  
    // Filter result
    const [filteredResults, setFilteredResults] = useState(false)
    const [filteredObj, setFilteredObj] = useState(false)
    const [dropdownIndex, setDropdownIndex] = useState(-1)
    const [tempSearchVal, setTempSearchVal] = useState('')
    const [multipleSelection, setMultipleSelection] = useState([])
    const [inputFocus, setInputFocus] = useState(false)
  
    useMemo(() => {
      if (textInputType === 'typeAhead') {
        setFilteredResults(
          options.length > 0 && typeof options[0] === 'object'
            ? options.map((item) => item.text)
            : options
        )
        setFilteredObj(
          options.length > 0 && typeof options[0] === 'object' ? options : false
        )
      } else {
        setFilteredResults(false)
        setFilteredObj(false)
      }
    }, [options, textInputType])
  
    const focusHandler = () => {
      setActiveState(true)
      setInputFocus(true)
      addEventListener()
      if (onFocus) {
        onFocus()
      }
      if (textInputType === 'typeAhead') {
        //setDropdownIndex(resetDropdownIndex)
        setError('')
      }
    }
  
    const handleClickOutside = (e) => {
      if (
        wrapperRef &&
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target)
      ) {
        setActiveState(false)
      }
    }
  
    const addEventListener = () => {
      document.addEventListener('click', handleClickOutside, false)
    }
  
    const handleChange = (e) => {
      stopProp(e)
      const val = e.currentTarget.value
      setInputValue(val)
      setFocusState(false)
      if (onChange) {
        onChange.call(this, e, val)
      }
      if (textInputType === 'typeAhead') {
        setInputValue(e.target.value)
        setActiveState(true)
      }
    }
  
    const handleBlur = (e) => {
      stopProp(e)
      setFocusState(false)
      setInputFocus(false)
      const val = noSpaces ? e.currentTarget.value.trim() : e.currentTarget.value
      setInputValue(val)
      if (onBlur) {
        onBlur.call(this, e, val)
      }
      if (
        textInputType === 'typeAhead' &&
        filteredResults.length === 0 &&
        !id.includes('subSearch') &&
        !allowNewEntry
      ) {
        setError('Invalid Entry')
      }
    }
  
    useEffect(() => {
      setEdit(showEdit)
    }, [showEdit])
  
    const onkeyup = (e) => {
      if (e.keyCode === KEYCODES.tab) {
        setFocusState(true)
      }
    }
  
    const handleKeyDown = (e) => {
      if (keyDownHandler) {
        keyDownHandler(e)
      }
      if (type === 'number') {
        if (
          // e.key === '.' ||
          e.key === '+' ||
          e.key === '-' ||
          e.key === 'e' ||
          e.key === 'E'
        ) {
          e.preventDefault()
        }
      }
      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowUp':
          if (!activeState) {
            setActiveState(true)
          }
          keyPressHandler(e)
          break
        case 'Escape':
          setActiveState(false)
          setTempSearchVal('')
          setPreviousInputValue('')
          break
        case 'Shift':
          setActiveState(false)
          break
        case 'Enter':
          setActiveState(false)
          // if user selects enter from item in dropdown
          if (
            filteredResults &&
            filteredResults.length &&
            inputValue !== '' &&
            dropdownIndex >= 0
          ) {
            setActiveState(false)
            setInputValue(multiple ? '' : filteredResults[dropdownIndex])
            // if the autoResults is an object, send the object back in callback
            if (filteredObj) {
              const multipleItems = handleMultipleOptions(
                e,
                filteredObj.find(
                  (item) => item.text === filteredResults[dropdownIndex]
                )
              )
  
              const selectedValues = multiple
                ? multipleItems
                : filteredObj.find(
                    (item) => item.text === filteredResults[dropdownIndex]
                  )
              onSelect(e, selectedValues)
            } else {
              onSelect(
                e,
                multiple ? multipleSelection : filteredResults[dropdownIndex]
              )
            }
            // if user did not select from the dropdown and just searched, send back entered string
          } else {
            setInputValue(multiple ? '' : e.target.value)
  
            const selectedValues =
              filteredObj &&
              filteredObj.find(
                (item) => item.text === filteredResults[dropdownIndex]
              )
            const multipleItems = handleMultipleOptions(e, selectedValues)
  
            onSelect(e, multiple ? multipleItems : inputValue)
          }
          setTempSearchVal('')
          setPreviousInputValue('')
          break
        case 'Tab':
          setActiveState(false)
          break
        default:
          setInputValue(e.target.value)
          setDropdownIndex(-1)
          setActiveState(true)
          setTempSearchVal('')
          setPreviousInputValue('')
          break
      }
    }
  
    const focusItem = (optionIndexValue) => {
      if (filteredResults.length && activeState && showDropdown) {
        document.getElementById(`itemQty_${optionIndexValue}`).focus()
      }
      return false
    }
  
    const keyPressHandler = (event) => {
      let currValue
  
      switch (event.key) {
        case 'ArrowDown':
          if (dropdownIndex === filteredResults.length - 1) {
            setDropdownIndex(0)
            setTempSearchVal(filteredResults[0])
            if (activeState) {
              event.preventDefault()
              focusItem(0)
            }
          } else {
            currValue = dropdownIndex === undefined ? 0 : dropdownIndex + 1
            setDropdownIndex(currValue)
            setTempSearchVal(filteredResults[currValue])
            if (activeState) {
              event.preventDefault()
              focusItem(currValue)
            }
          }
          break
        case 'ArrowUp':
          currValue =
            dropdownIndex === 0 ? filteredResults.length - 1 : dropdownIndex - 1
          setDropdownIndex(currValue)
          setTempSearchVal(filteredResults[currValue])
          if (activeState) {
            event.preventDefault()
            focusItem(currValue)
          }
          break
        default:
          break
      }
    }
  
    const selectOption = (e, item) => {
      const multipleItems = handleMultipleOptions(e, item)
      e.preventDefault()
      // checks if no entry matching condition is met and if so, the value should not be selected and the dropdown should close
      if (textInputType === 'typeAhead' && !allowNewEntry) {
        setInputValue(item.text ? item.text : item)
        setActiveState(false)
        onSelect(e, item)
        setTempSearchVal('')
        if (multiple) {
          setInputValue('')
        }
      } else {
        const currentItem =
          allowNewEntry && filteredResults.length === 0
            ? inputValue
            : item.text
            ? item.text
            : item
        setInputValue(currentItem)
        setActiveState(false)
        setTempSearchVal('')
        if (filteredObj) {
          // checks whether filteredObj has any length (it won't for new entries) and then set either the find result or current item
          const selectedItem =
            filteredObj.length > 0
              ? filteredObj.find((result) => result.text === item.text)
              : { id: currentItem, text: currentItem }
          onSelect(e, multiple ? multipleItems : selectedItem)
        } else {
          onSelect(e, multiple ? multipleItems : currentItem)
        }
      }
    }
  
    useEffect(() => {
      if (resetInput) {
        setInputValue('')
      }
    }, [resetInput])

    useEffect(() => {
      setInputValue(value)
    }, [value])

    useEffect(() => {
      setPreviousInputValue(previousValue)
    }, [previousValue])
  
    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current.focus()
      },
    }))
  
    const handleMultipleOptions = (e, item) => {
      if (item) {
        const fintIndexItem = multipleSelection.findIndex(
          (multiItem) => multiItem.id === item.id
        )
  
        if (fintIndexItem === -1) {
          const multipleItems = [...multipleSelection, item]
          setMultipleSelection(multipleItems)
          return multipleItems
        }
      }
      return multipleSelection
    }
  
    return (
      <DropdownContext.Provider
        value={{
          inputValue,
          dropdownIndex,
          activeState,
          filteredResults,
          selectOption,
          dropdownRef,
          handleKeyDown,
        }}
      >
        <MainWrapper ref={wrapperRef}>
          <InputWrapper>
            {label && (
              <Label labelBGColor={labelBGColor} disabled={disabled || edit}>
                {label}
                {isRequired && <span aria-hidden>*</span>}
              </Label>
            )}
            <InputWrapperContainer
              inputFocus={inputFocus}
              focusState={focusState}
              size={size}
              multiple={multiple}
              disabled={disabled || edit}
              error={error !== '' ? error : errorMsg}
              customCSS={customCSS}
              aria-label="inputBoxWrapper"
            >
              <InputTagContainer>
                <Input
                  onFocus={focusHandler}
                  onBlur={handleBlur}
                  name={name}
                  disabled={disabled || edit}
                  placeholder={placeholder}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  onKeyUp={onkeyup}
                  error={errorMsg}
                  value={tempSearchVal !== '' ? tempSearchVal : inputValue !== '' ? inputValue : previousInputValue}
                  ref={inputRef}
                  type={type}
                  maxLength={maxLength}
                  convertToUppercase={convertToUppercase}
                  id={id}
                  showSearchBtn={rest.showSearchBtn}
                  autoComplete={autoCompleteValue}
                  {...(ariaLabel && {
                    'aria-label': ariaLabel,
                  })}
                  {...(isRequired && {
                    'aria-required': true,
                  })}
                  {...(charLimit && { maxLength: charLimit.limit })}
                  {...rest}
                  {...(textInputType === 'typeAhead' && {
                    'aria-expanded':
                      inputValue && inputValue.length > 0 && activeState,
                    'aria-activedescendant': dropdownIndex,
                  })}
                  className={rest.haveFSClass ? 'fs-exclude' : ''}
                />
              </InputTagContainer>
            </InputWrapperContainer>
          </InputWrapper>
        </MainWrapper>
      </DropdownContext.Provider>
    )
  })
  
  /** Props **/
  TextInput.defaultProps = {
    disabled: false,
    label: '',
    placeholder: '',
    showCloseBtn: false,
    clearInput: null,
    searchClickHandler: null,
    onChange: null,
    onBlur: null,
    value: '',
    type: 'text',
    maxLength: null,
    minLength: null,
    id: '',
    errorMsg: '',
    isRequired: false,
    name: '',
    noSpaces: false,
    onFocus: null,
    customCSS: null,
    charLimit: null,
    hint: '',
    callbackFnOnEdit: null,
    convertToUppercase: false,
    size: 'md',
    showEdit: false,
    labelBGColor: 'white',
    ariaLabel: '',
    textInputType: 'standard',
    options: null,
    onSelect: () => {},
    resetInput: false,
    haveFSClass: false,
    showDropdown: true,
    onSearch: () => {},
    onFilter: () => {},
    autoCompleteValue: 'on',
    allowNewEntry: false,
    multiple: false,
    onDelete: () => {},
    keyDownHandler: () => {},
    isDecimal: false,
    previousValue:''
  }
  
  TextInput.propTypes = {
    disabled: PropTypes.bool,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    showCloseBtn: PropTypes.bool,
    clearInput: PropTypes.func,
    searchClickHandler: PropTypes.func,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    value: PropTypes.string,
    type: PropTypes.oneOf(['text', 'number', 'password', 'email', 'phone']),
    maxLength: PropTypes.number,
    minLength: PropTypes.number,
    id: PropTypes.string,
    errorMsg: PropTypes.string,
    isRequired: PropTypes.bool,
    name: PropTypes.string,
    noSpaces: PropTypes.bool,
    customCSS: PropTypes.string,
    onFocus: PropTypes.func,
    charLimit: PropTypes.shape({
      maxCharText: PropTypes.string,
      remainingCharText: PropTypes.string,
      limit: PropTypes.number,
    }),
    hint: PropTypes.string,
    callbackFnOnEdit: PropTypes.func,
    convertToUppercase: PropTypes.bool,
    size: PropTypes.oneOf(['sm', 'md']),
    showEdit: PropTypes.bool,
    labelBGColor: PropTypes.string,
    ariaLabel: PropTypes.string,
    textInputType: PropTypes.oneOf(['standard', 'typeAhead']),
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
    onSelect: PropTypes.func,
    resetInput: PropTypes.bool,
    haveFSClass: PropTypes.bool,
    showDropdown: PropTypes.bool,
    onSearch: PropTypes.func,
    onFilter: PropTypes.func,
    autoCompleteValue: PropTypes.oneOf(['on', 'off']),
    allowNewEntry: PropTypes.bool,
    multiple: PropTypes.bool,
    onDelete: PropTypes.func,
    keyDownHandler: PropTypes.func,
    isDecimal: PropTypes.bool,
    previousValue:PropTypes.string
  }