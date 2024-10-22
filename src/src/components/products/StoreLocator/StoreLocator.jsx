import React, {Fragment, useRef, useEffect, useState} from 'react';
import './StoreLocator.scss'
import {Icon} from '../StaplesUI/Icon/Icon';
import {Button} from "../StaplesUI/Button/Button";
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

function StoreLocator(props) {

    const {insideTabNavigation, applyPadding, storeNumber, makeMyStore} = props;
    const [showDropdown, setShowDropdown] = useState(false);
    const [myStoreNumber, setMyStoreNumber] = useState(storeNumber);
    const [storeSearchRadius, setStoreSearchRadius] = useState("20mi");
    const [storeSearchResult, setStoreSearchResult] = useState({});
    const [invalidStore, setInvalidStore] = useState(false);
    let searchBarInputRef = useRef(null);
    const isClicked = useRef(false);
    const ref = useRef(null);
    const dropdownRef = useRef(null);

    const getStoreCB = (e) => {
        e.preventDefault();
        const requestBody = {
            'address': searchBarInputRef.value,
            'radius': parseInt(storeSearchRadius)
        }
        fetch(storeFinderURL, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(data => {
                setInvalidStore(false);
                console.log(data);
                setStoreSearchResult(data);
            }).catch((error) => {
            setInvalidStore(true);
            console.log('Error ' + error)
        });
    };
    const list = ["20mi", "50mi", "100mi"];
    const removeOutlineOnClick = (event, isTargetElem) => {
        if (event) {
            const element = isTargetElem ? event.target : event.currentTarget;
            if (element && element.classList) {
                element.classList.add('noBlueOutlineOnFocus');
            }
        }
    };
    const onMenuItemHandler = (event, item) => {
        setStoreSearchRadius(item);
        if (event.key !== 'Enter') {
            setShowDropdown(false);
        }
        if (event.type === 'keydown' && ref && ref.current && ref.current.firstElementChild) {
            ref.current.firstElementChild.focus();
        }
    };

    const addOutlineOnKeyPress = (event, isTargetElem) => {
        if (event) {
            const element = isTargetElem ? event.target : event.currentTarget;
            if (element && element.classList) {
                if (!(event.key === 'Meta' || event.key === 'Control')) {
                    element.classList.remove('noBlueOutlineOnFocus');
                }
            }
        }
    };

    const onArrowKeyHandler = (event, index) => {
        const moveFocus = (pos) => {
            event.preventDefault();
            if (dropdownRef && dropdownRef.current && dropdownRef.current.children[pos]) {
                dropdownRef.current.children[pos].focus();
            }
        };
        if (event.key === 'ArrowDown' || event.keyCode === 40 || event.which === 40) {
            moveFocus(index + 1);
        }
        if (event.key === 'ArrowUp' || event.keyCode === 38 || event.which === 38) {
            moveFocus(index - 1);
        }
    };

    const isTabPressed = (e) => {
        const event = e ? e : window.event;
        const x = event.which || event.keyCode;
        const KEYCODE_TAB = 9;
        return (event.key === 'Tab' || x === KEYCODE_TAB);
    };

    const onSubmitHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'click') {
            isClicked.current = true;
        }
        if (e.type === 'keydown') {
            isClicked.current = false;
        }
        setShowDropdown((prev) => !prev);
    };

    const setSearchInputRef = (elem) => {
        searchBarInputRef = elem;
    };

    const onClickHandler = (item) => {
        setMyStoreNumber(item?.storeNumber);
        makeMyStore(item);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref && ref.current && !ref.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        showDropdown && dropdownRef && dropdownRef.current && dropdownRef.current.firstElementChild && dropdownRef.current.firstElementChild.focus();
        showDropdown && !isClicked.current && dropdownRef.current.firstElementChild && dropdownRef.current.firstElementChild.classList.add('noBlueOutlineOnFocus');
        return () => {
        };
    }, [showDropdown]);


    return (
        <Fragment>
            <div
                className="change_store_section applyPadding">
                <div className="new_store_input border_light_gray store_input_insideTab">
                    <form onSubmit={getStoreCB}
                          className="searchInputForm">
                        <label htmlFor='storeSearchInput1'
                               className="section_content_title">
                            {"Find a Store"}
                        </label>
                        <div className="searchBarWrapper">
                            <input type='text'
                                   autoComplete='off'
                                   placeholder={"Search city, state, zip"}
                                   ref={setSearchInputRef}
                                   id='storeSearchInput1'/>
                            <button
                                className="search_button"
                                id='search_button'
                                type='submit'
                                aria-label='Store Search'
                                onClick={getStoreCB}
                                tabIndex='0'>
                <span
                    role='link'
                    className="mmx_icon_search"
                    tabIndex='-1'>
                  <Icon
                      name='search'
                      size={16}
                      color='light_gray_4'/>
                </span>
                            </button>
                        </div>
                    </form>
                    <form className="radius-option__radiusOptionWrapper"
                          onSubmit={onSubmitHandler}>
                        <div
                            className="navigation-text__navigationText navigation-text__noanchor navigation-text__navigationActionText null radius-option__radius_label noBlueOutlineOnFocus">
                            <span tabIndex="-1" className="navigation-text__headlinerText">{"Distance"}</span>
                        </div>
                        <div ref={ref}
                             onKeyDown={(event) => {
                                 if (!isTabPressed(event)) {
                                     return;
                                 }
                                 if (event.shiftKey) {
                                     showDropdown && setShowDropdown(false);
                                 }
                                 event.stopPropagation();
                             }}>
                            <button className="radius-option__radiusButton"
                                    onKeyDown={addOutlineOnKeyPress}
                                    onKeyUp={addOutlineOnKeyPress}
                                    onMouseDown={removeOutlineOnClick}
                                    type="submit">
                                <div className="radius-option__selectedValue">{storeSearchRadius}</div>
                                <Icon name='caret_down'
                                      size={12}
                                      color='medium_gray'/>
                            </button>

                            {showDropdown ? <div className="radiusDropdown"
                                                 ref={dropdownRef}>
                                {!isEmpty(list) ? list.map((item, index) => (
                                    <div key={`${index}_${item}`}
                                         className="radiusDropdownOption"
                                         onMouseDown={removeOutlineOnClick}
                                         onClick={(event) => onMenuItemHandler(event, item)}
                                         onKeyUp={addOutlineOnKeyPress}
                                         onKeyDown={(event) => {
                                             addOutlineOnKeyPress(event);
                                             event.stopPropagation();
                                             onArrowKeyHandler(event, index);
                                             if (event.key === 'Enter' || event.keyCode === 13) {
                                                 onMenuItemHandler(event, item);
                                             }
                                             if (index === list.length - 1 && isTabPressed(event)) {
                                                 setShowDropdown(false);
                                             }
                                         }}
                                         tabIndex='0'
                                         data-value={parseInt(item)}>{item}</div>)
                                ) : null}
                            </div> : null}
                        </div>
                    </form>
                </div>
                {!isEmpty(storeSearchResult?.results?.stores) ? storeSearchResult.results.stores.map((item, index) => (

                    <div className="store_details_storeDetailsWrapper">
                        <div className="store_details_storeDetailsSection">
                            <div className="store-details__storeAddressWrapper">
                                <div className="navigation-text__navigationText">
                                    <div className="navigation-text__headsubContainer">
                                        <div>
                                        <span className="navigation_text_headlinerText">
                                            {item?.address?.addressLine1}
                                        </span>
                                        </div>
                                        <div>
                                        <span className="navigation_text_headlinerText">
                                            {item?.address?.city}{", "}{item?.address?.state}{" "}{item?.address?.zipcode}
                                        </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="navigation-text__navigationText store-details__distance">
                                        <span className="navigation-text__headlinerText">
                                            {item?.distance?.toFixed(2)}{" mi"}
                                        </span>
                                </div>
                            </div>
                            <div>
                               <span className={`${
                                   item?.storeStatus?.toUpperCase() === 'OPEN'
                                       ? "open"
                                       : item?.storeStatus?.toUpperCase() === 'CLOSING SOON'
                                       ? "closing_soon"
                                       : "closed"
                               }`}>{item?.storeStatus?.toUpperCase()}</span>
                                <span className="store_details_storeStatusTime"> {" · "} {item.storeStatusTime}</span>
                            </div>
                            {item?.storeNumber == myStoreNumber ?
                                <div className="current_store"><span>My store</span>
                                    <Icon name="check" size={14} color="forest"/>
                                </div> :
                                <span className="navigation-text__linkButton">
                                    <Button size={"sm"} onClickHandler={() => {
                                        onClickHandler(item)
                                    }}>
                                        Make my store
                                    </Button>
                                </span>
                            }
                        </div>
                    </div>
                )) : null}
                {invalidStore && (
                    <div className="store_input_error">
                        <section className="errorMessageWrapper">
                            <div className="navigation-text__headsubContainer">
                                <div>
                                    <div className="store_error_headSubText_bold"><span
                                        className="navigation-text__Bold  navigation-text__headlinerText font_bold">{"We can't find a store near "}{searchBarInputRef.value}</span>
                                    </div>
                                    <div className="store_error_headSubText"><span
                                        className="store_error_text">Please try again.</span>
                                    </div>
                                </div>
                            </div>
                            <a className="navigation-text__navigationText" rel="follow" aria-label="More search options"
                               role="link" tabIndex="0" target="_blank"
                               href="https://stores.staples.com/search"><span
                                className="navigation-text__link store_error_navigation">More search options</span></a>

                        </section>
                    </div>
                )}


            </div>
        </Fragment>
    );
};

StoreLocator.propTypes = {
    applyPadding: PropTypes.bool,
    insideTabNavigation: PropTypes.bool,
    myStore: PropTypes.object,
    makeMyStore: PropTypes.func

};

StoreLocator.defaultProps = {
    applyPadding: true,
    insideTabNavigation: false,
    myStore: {},
    makeMyStore: () => {}
};

export default StoreLocator;
