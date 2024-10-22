import React from 'react'
import PropTypes from 'prop-types'
import DOMPurify from 'dompurify'
import {
  StyledDropdownMenu,
  StyledDropdownItem,
  WithoutIconStyleWrap,
  BoldSpan,
  AddEntryIcon,
  SubText,
  StyledFlex,
} from './DropdownMenu.styles'
import { Icon } from '../Icon/Icon'
import { useCustomContext, DropdownContext } from '../utility/useCustomContext'

export const DropdownMenu = (props) => {
  const {
    onHoverDropdown,
    options,
    dropdownHeight,
    withoutIcons,
    align,
    size,
    allowNewEntry,
  } = props
  const sanitizeHTML = (html) => DOMPurify.sanitize(html)
  const getBoldedSuggestion = (suggestion, query) => {
    const queryRegex = new RegExp(query, 'gi')
    return sanitizeHTML(
      suggestion.replace(queryRegex, (matchCase) => `<span>${matchCase}</span>`)
    )
  }
  const {
    currValue,
    dropdownIndex,
    open,
    selectOption,
    handleKeyDown,
    dropdownPosition,
    dropdownRef,
    filteredResults,
    activeState,
    inputValue,
  } = useCustomContext(DropdownContext)

  const getDisplayValue = (item) => {
    if (item && item.optionHTML) {
      return item.optionHTML
    }
    if (item && item.text) {
      return item.text
    }
    return item
  }

  const ddOptions = options.map((item, index) => {
    const itemSelect = item && item.text ? item.text : item
    const currValueSelect =
      currValue && currValue.text ? currValue.text : currValue
    const selected = itemSelect === currValueSelect

    return (
      <StyledDropdownItem
        value={currValue || inputValue}
        item={item}
        index={index}
        dropdownIndex={dropdownIndex}
        onKeyDown={(e) => handleKeyDown(e)}
        role="listitem"
        id={`itemQty_${index}`}
        key={index}
        tabIndex={open ? '1' : '0'}
        onClick={(e) => selectOption(e, item, index)}
        onMouseDown={(e) => selectOption(e, item, index)}
        onMouseEnter={(e) => onHoverDropdown?.(e, item)}
        size={size}
      >
        {!withoutIcons && (
          <WithoutIconStyleWrap>
            {selected && (
              <span>
                <Icon name="check" size={16} />
              </span>
            )}
          </WithoutIconStyleWrap>
        )}
        {allowNewEntry && filteredResults.length === 0 && (
          <AddEntryIcon>
            <Icon name="cancel" size={22} />
          </AddEntryIcon>
        )}
        {filteredResults ? (
          <StyledFlex>
            <BoldSpan>
              <div
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: `${getBoldedSuggestion(
                    getDisplayValue(item),
                    inputValue
                  )}`,
                }}
              />
            </BoldSpan>
            {item.subText && <SubText>{item.subText}</SubText>}
          </StyledFlex>
        ) : (
          getDisplayValue(item)
        )}
      </StyledDropdownItem>
    )
  })

  return (
    <StyledDropdownMenu
      role="list"
      aria-label="dropdown"
      style={{
        maxHeight: dropdownHeight,
        bottom: `${dropdownPosition === 'up' ? 'calc(100% + 8px)' : 'initial'}`,
      }}
      isOpen={open || (filteredResults && activeState)}
      ref={dropdownRef}
      align={align}
    >
      {ddOptions}
    </StyledDropdownMenu>
  )
}

DropdownMenu.defaultProps = {
  options: null,
  dropdownHeight: '40vh',
  withoutIcons: false,
  align: 'left',
  size: 'md',
  allowNewEntry: false,
}

DropdownMenu.propTypes = {
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
  dropdownHeight: PropTypes.string,
  withoutIcons: PropTypes.bool,
  align: PropTypes.oneOf(['left', 'right']),
  size: PropTypes.oneOf(['md', 'sm']),
  allowNewEntry: PropTypes.bool,
}