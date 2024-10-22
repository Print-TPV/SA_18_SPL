/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import {
  PaginationWrapper,
  PaginationText,
  PaginationControlWrapper,
  PaginationControl,
  CountText,
  ViewAll,
  SelectionContainer,
} from './Pagination.styles'
import { Icon } from '../Icon/Icon'
import { TextInput } from '../TextInput/TextInput'

export function Pagination(props) {
  const {
    totalItems,
    itemsPerPage,
    startIndex,
    showControls,
    showViewAll,
    id,
    customCSS,
    onPageSelect,
    size,
    showLabel,
    customText,
    isDoubleSidedView,
    resetPagination,
    resetPaginationForTabs,
    pagesArr,
    ...rest
  } = props

  // constants
  const endItemNumber = startIndex * itemsPerPage

  const totalPages = pagesArr.length;

  // state
  const [startingItem, setStartingItem] = useState(
    startIndex ? (startIndex - 1) * itemsPerPage + 1 : 1
  )
  const [endingItem, setEndingItem] = useState(
    startIndex
      ? totalItems < endItemNumber
        ? totalItems
        : endItemNumber
      : itemsPerPage
  )
  const [currentPage, setCurrentPage] = useState(startIndex)
  const [inputValue, setInputValue] = useState('')
  const [previousInputValue, setPreviousInputValue] = useState('')
  const [page, setPage] = useState(0)

  // methods

  useEffect(() => {
    setStartingItem((currentPage - 1) * itemsPerPage + 1)
    setEndingItem(currentPage * itemsPerPage)
  }, [currentPage, itemsPerPage])

  useEffect(() => {
    if(startIndex !== 0) {
      setCurrentPage(startIndex)
    }
  }, [startIndex, resetPagination])

  useEffect( ()=>{
    setPreviousInputValue('')
    setInputValue(pagesArr[currentPage-1])
  }, [currentPage, resetPagination])

  useEffect(() => {
    let pageIndex = 0
    if (startIndex !== 1) {
      if (page && page.toString().includes('Front')) {
        pageIndex = 0
      } else if (page && page.toString().includes('End')) {
        pageIndex = pagesArr.length - 1
      } else {
        const _currentPage = page && page.toString().includes(',') ? page.split(',')[0] : page.toString()
        const _nextPage = page && page.toString().includes(',') ? page.split(',')[1] : null
        pageIndex = getPageIndex(_currentPage, _nextPage)
      }
      if (pageIndex === -1) {
        // no page index found. Set to start page
        pageIndex = 0
      }
      _onPageSelect(pagesArr[pageIndex], pageIndex)
      setCurrentPage(pageIndex + 1)
      if (previousInputValue !== '') {
        setInputValue(pagesArr[pageIndex])
        setPreviousInputValue('')
      } else {
        setPreviousInputValue(pagesArr[pageIndex])
        setInputValue('')
      }
    }
  }, [isDoubleSidedView])

  const _onPageSelect = (_page, index) => {
    setPage(_page)
    onPageSelect(_page, index)
  }

  const prevClickHandler = () => {
    _onPageSelect(pagesArr[currentPage-2], currentPage-2)
    setCurrentPage(currentPage - 1)
  }

  const firstClickHandler = () => {
    _onPageSelect(pagesArr[0], 0)
    setCurrentPage(1)
  }

  const lastClickHandler = () => {
    _onPageSelect(pagesArr[totalPages-1] , totalPages-1)
    setCurrentPage(totalPages)
  }

  const nextClickHandler = () => {
    _onPageSelect(pagesArr[currentPage], currentPage)
    setCurrentPage(currentPage + 1)
  }

  const getPageIndex = (_currentPage, _nextPage) => pagesArr.findIndex(function (element) {
    if (element.toString().includes(',')) {
      return element.toString() === _currentPage || element.toString() === _nextPage
          || element.split(',')[0] === _currentPage || element.split(',')[0] === _nextPage
          || element.split(',')[1] === _currentPage || element.split(',')[1] === _nextPage;
    } else {
      return (element.toString() === _currentPage || element.toString() === _nextPage)
    }
  })

  const selectPage = (_, page) => {
    const pageIndex = getPageIndex(page)
    if (pageIndex === -1) {
      if (previousInputValue !== '') {
        setInputValue(previousInputValue)
        setPreviousInputValue('')
      } else {
        setPreviousInputValue(inputValue)
        setInputValue('')
      }
    } else {
      _onPageSelect(pagesArr[pageIndex], pageIndex)
      setCurrentPage(pageIndex+1)
      if (previousInputValue !== '') {
        setInputValue(pagesArr[pageIndex])
        setPreviousInputValue('')
      } else {
        setPreviousInputValue(pagesArr[pageIndex])
        setInputValue('')
      }
    }
  }

  const viewingAriaLabel = `Viewing ${startingItem}-${totalItems} of ${totalItems} items`

  return (
    <PaginationWrapper
      role="navigation"
      aria-label="Pagination"
      id={id}
      customCSS={customCSS}
      {...rest}
    >
      {showLabel && (
        <PaginationText aria-label={viewingAriaLabel}>
          Viewing
          <span>
            {startingItem}-{endingItem > totalItems ? totalItems : endingItem}
          </span>
          of <span>{totalItems}</span> {customText}
          {showViewAll && <ViewAll aria-label="View all">View all</ViewAll>}
        </PaginationText>
      )}

      {showControls && (
        <PaginationControlWrapper showLabel={showLabel}>
          <PaginationControl
            aria-label="First page of results"
            onClick={firstClickHandler}
            onKeyPress={currentPage <= 1 ? null : firstClickHandler}
            disabled={currentPage <= 1}
            tabIndex={currentPage <= 1 ? -1 : 0}
            custCSS={{"margin-right": "12px"}}
          >
            <Icon size={size === 'lg' ? 15 : 12} color={`${(currentPage <= 1) ? "dark_gray_1" : "black"}`} name="caret_left_double" />
          </PaginationControl>
          <PaginationControl
            aria-label="Previous page of results"
            onClick={prevClickHandler}
            onKeyPress={currentPage <= 1 ? null : prevClickHandler}
            disabled={currentPage <= 1}
            tabIndex={currentPage <= 1 ? -1 : 0}
          >
            <Icon size={size === 'lg' ? 15 : 12} color="dark_gray_1" name="caret_left" />
          </PaginationControl>
          <CountText size={size}>
            {size === 'lg' && 'Page'}
            {/* {currentPage}  */}
            <SelectionContainer size={size}>
              <TextInput
                disabled={totalPages === 1}
                value={`${inputValue}`}
                previousValue={`${previousInputValue}`}
                onSelect={(e, page) => selectPage(e, page)}
                customCSS={`width: ${dropdownWidth}`}
              />
            </SelectionContainer>
            {size === 'lg' && `of ${totalItems}`}
          </CountText>

          <PaginationControl
            aria-label="Next page of results"
            onClick={nextClickHandler}
            onKeyPress={totalPages <= currentPage ? null : nextClickHandler}
            disabled={totalPages <= currentPage}
            tabIndex={totalPages <= currentPage ? -1 : 0}
          >
            <Icon size={size === 'lg' ? 15 : 12} color="dark_gray_1" name="caret_right" />
          </PaginationControl>
          <PaginationControl
            aria-label="Last page of results"
            onClick={lastClickHandler}
            onKeyPress={totalPages <= currentPage ? null : lastClickHandler}
            disabled={totalPages <= currentPage}
            tabIndex={totalPages <= currentPage ? -1 : 0}
            custCSS={{"margin-left": "12px"}}
          >
            <Icon size={size === 'lg' ? 15 : 12} color="dark_gray_1" name="caret_right_double" />
          </PaginationControl>
        </PaginationControlWrapper>
      )}
    </PaginationWrapper>
  )
}

// constants
const dropdownWidth = '88px'

Pagination.defaultProps = {
  startIndex: 1,
  showControls: true,
  showViewAll: true,
  customCSS: null,
  onPageSelect: () => {},
  id: '',
  size: 'lg',
  showLabel: true,
  customText: 'items',
}

Pagination.propTypes = {
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  startIndex: PropTypes.number,
  showControls: PropTypes.bool,
  showViewAll: PropTypes.bool,
  customCSS: PropTypes.string,
  onPageSelect: PropTypes.func,
  id: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'lg']),
  showLabel: PropTypes.bool,
  customText: PropTypes.string,
}