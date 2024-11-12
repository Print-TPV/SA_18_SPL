import React, { useEffect, useState, useCallback } from 'react'
import './Header.scss'
import { ReactComponent as BackArrow } from '$assets/icons/back-arrow-navigation.svg'
import LoadingDots from '$core-components/LoadingDots';
import { ReactComponent as ShutterStock } from '$assets/icons/shutterStock.svg'

import { Modal } from '../../products/StaplesUI/Modal/Modal';
import { Breakpoint } from '../../products/StaplesUI/Breakpoint/Breakpoint';
import { Button } from "../../products/StaplesUI/Button/Button";
import { Icon } from '../../products/StaplesUI/Icon/Icon'
import { TextInput } from '../../products/StaplesUI/TextInput/TextInput'
import { Popover } from '../../products/StaplesUI/Popover/Popover'
import { Link } from '../../products/StaplesUI/Link/Link';

import { CookiesManager } from '$ustoreinternal/services/cookies';

import Price from '../../products/static/Price';

const ProjectDetails = ({ projectName, editProjectName, id, disablePopover, isSimplePrintProduct, downloadProof }) => {

  return (
    <div className="project-name">
      <span className="project-name-bold">
        <span className="project_name">Project name -</span>&nbsp;
        <div className="tooltip_wrapper">
          <span className="heading_small">{projectName} </span>
          <span className="tooltip_text">{projectName} </span>
        </div>
      </span>
      <span className="project-name-cursor">
        <Popover
          id={`${id}`}
          position="bottom"
          minWidth={120}
          maxWidth={170}
          customCSS={`${disablePopover ? "display:flex;justify-content:center;align-items:center;z-index:99997 !important;pointer-events: none;"
            : "display:flex;justify-content:center;align-items:center;z-index:99997 !important;"}`}
          triggerElement={<Icon name="caret-thin-down" height="12px" />}
          tabIndex="0"
          ariaLabel="More"
        >
          <div className="dropdownItem" onClick={editProjectName} tabIndex={0}>
            <Icon name="edit" size={16} aria-label="Rename" />
            <span className='dropdownItem_text'>Rename</span>
          </div>
          {
            isSimplePrintProduct && downloadProof && (
              <div className="dropdownItem" onClick={downloadProof} tabIndex={0}>
                <Icon name="download" size={16} aria-label="DownloadProof" />
                <span className='dropdownItem_text'>Download Proof</span>
              </div>
            )
          }
        </Popover>

      </span>
    </div>
  )
}

function SubHeader({ isPriceLoading, saveDesign, exportDesignComplete, showSaveAndContinueButton, isPriceCalculating, price, showMinimumPrice, closeEditorHandler, isSstkOrSimplePrintProduct, projectName, getUpdatedProjectName, disablePopover, isSimplePrintProduct, downloadProof, orderProductId, isEditCartMode, removeEventListenerWrapper, backButtonHandler, subHeaderProps, fileUploadDiv, fileName, activeDivider }) {

  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState('')
  const [showEditModal, setShowEditModal] = useState(false);
  const [showModalDuringEdit, setShowModalDuringEdit] = useState(false)
  const [currentBreakpoint, setCurrentBreakpoint] = useState('')
  const [activeDividerId, setActiveDividerId]=useState(null)

  useEffect(() => {
    setActiveDividerId(activeDivider)
  }, [activeDivider]);
  const breakpointCallback = (breakpoint) => {
    if (breakpoint !== currentBreakpoint) {
      setCurrentBreakpoint(breakpoint);
    }
  }
  const onClickLeaveButton = () => {
    setShowModal(false);
    document.getElementsByClassName("sstk-editor")[0].style.display = "none";
    document.getElementsByTagName("body")[0].style.overflowY = 'visible';
    closeEditorHandler && closeEditorHandler();
    if(backButtonHandler) {
      backButtonHandler();
    }
    // window.history.back()
  };

  const handleDuringEditModalLeaveButton = () => {
    setShowModalDuringEdit(false)
    removeEventListenerWrapper && removeEventListenerWrapper();
    window.history.back()
  }

  const closeModal = () => {
    setShowModal(false);
  };
  const closeModalDuringEdit = () => {
    setShowModalDuringEdit(false)
  }

  const onClickBackLink = () => {
    if (showSaveAndContinueButton) {
      setShowModal(true);
    } else {
      setShowModalDuringEdit(true)
    }
  }

  const editProjectName = () => {
    setShowEditModal(true)
  }

  const closeEditModal = () => {
    setShowEditModal(false)
    setInputValue(projectName)
  }

  const handleTextInput = (e) => {
    setInputValue(e.target.value)
  }

  const handleProjectName = () => {
    getUpdatedProjectName(inputValue)
    setShowEditModal(false)
  }

  const handleProjectNameOnEnterPress = (event) => {
    if (event.key === 'Enter') {
      getUpdatedProjectName(inputValue)
      setShowEditModal(false)
    }
  }

  const handleProjectNameOnCancel = (event) => {
    if (event.key === 'Enter') {
      setShowEditModal(false)
      setInputValue(projectName)
    }
  }

  const handleDownloadProof = () => {
    downloadProof().then((proofBlob) => {
      const url = window.URL.createObjectURL(proofBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', "proof_" + orderProductId + ".pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    }).catch((e) => {
      console.error("Unable to download the proof", e);
    });
  }

  useEffect(() => {
    setInputValue(projectName)
  }, [projectName])

  const getWhiteLabel = () => {
    try {
      const _logoutUrl = CookiesManager.getCookie("_logoutUrl");
      const decodedUrl = decodeURIComponent(_logoutUrl);
      const urlParts = decodedUrl.split("&");
      return urlParts.find(part => part.startsWith("whiteLabel"));
    } catch (e) {
      //fail silently
    }
    return null;
  }

  const getSubHeaderColor = () => {
    const whiteLabel = getWhiteLabel();
    if (whiteLabel) {
      const type = whiteLabel.split("=")[1];
      return type === 'SWS' || type === 'HIT';
    }
    return false;
  }

  const propertyClickHandler = (property) => {
    try {
      if(property.key.toLowerCase().indexOf("upload") > 0 && !fileName) {
        fileUploadDiv && fileUploadDiv.current && fileUploadDiv.current.focus();
        const ele = document.getElementById("file_Upload_card");
        ele.focus();
        const rightTopElement = document.getElementById("right_section");
        rightTopElement.scrollIntoView({ behavior:'smooth',inline: 'start' });
        setTimeout(() => setActiveDividerId(property.key), 800);
      } else {
          const element =document.getElementById(property.key)
          element.scrollIntoView({ behavior:'smooth',inline: 'start' });
      }
    } catch(e) {
      // fail silently
    }
  }

  const RenderProperty = ({property}) => {
    return (<div className={(property.key == activeDividerId) ? 'property_container_active' : 'property_container'} onClick={() => propertyClickHandler(property)}>
      {(currentBreakpoint == 'lg' || currentBreakpoint == 'md') && <Icon name={property.iconName} size={20} />}
      <span className='property_label'>{property.label}</span>
    </div>)
  }

  return (
    <>
      <Breakpoint
        onBreakpointChange={breakpointCallback} />
      {showModal ?
        <Modal hasCloseButton showModal={showModal} onClose={closeModal}>
          <div className="modal-wrapper">
            <h1 className="modal-heading">Are you sure you want to leave?</h1>
            <div className="modal-text">Design changes may not be saved if you navigate away from this page.</div>
            <div className="modal-button-wrapper">
              <Link
                onClick={closeModal}
                color={'black'}
                underline={true}
              >Back to my design</Link>
              <Button onClickHandler={onClickLeaveButton}>Leave</Button>
            </div>
          </div>

        </Modal> : null}

      {showModalDuringEdit ?
        <div className="modal-width">
          <Modal customCSS={(currentBreakpoint === 'lg' || currentBreakpoint === 'md') ? 'width:648px' : currentBreakpoint === 'sm' ? 'width:601px' : currentBreakpoint === 'xs' && 'width:312px'} hasCloseButton showModal={showModalDuringEdit} onClose={closeModalDuringEdit}>
            <div className="modal-wrapper-second">
              <h1 className="modal-heading-second">Are you sure you want to leave?</h1>
              <div className="modal-text-second">Your project may not be saved if you navigate away from this page.</div>
              <div className="modal-button-wrapper-second">
                <a className="modal-link-second" onClick={closeModalDuringEdit}>Back to my project</a>
                <Button onClickHandler={handleDuringEditModalLeaveButton}>Leave</Button>
              </div>
            </div>

          </Modal> </div> : null}
      <div className="header-sub" id="header-sub">
        <div className={`${getSubHeaderColor() ? 'header-bg-grey' : 'header-bg'} sub-container sub-container-box-shadow`}>
          <div className={`${getSubHeaderColor() ? "header-bg-grey" : "header-bg"} header-subleft`} onClick={onClickBackLink}><BackArrow width="15px" height="15px" /><span className="back-text">Back</span></div>
          {isSstkOrSimplePrintProduct && !showSaveAndContinueButton ? (
            <ProjectDetails projectName={projectName} editProjectName={editProjectName} id={'popover'} disablePopover={disablePopover} isSimplePrintProduct={isSimplePrintProduct} downloadProof={downloadProof ? handleDownloadProof : ''} />
          ) : null}

          {showEditModal ? (
            <Modal
              hasCloseButton
              showModal={showEditModal}
              onClose={closeEditModal}
              customCSS={"width: 600px; z-index: 101 !important; padding-left: 25px; padding-right: 15px; position: relative"}
            >
              <h1
                className='modal_title_text'
              >
                Rename project
              </h1>

              <TextInput
                label={'Project name'}
                value={projectName}
                onChange={handleTextInput}
                customCSS={"width: 525px; margin-bottom: 12px"}
                isRequired={true}
                maxLength={120}
              />
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'flex-end',
                  alignItems: 'center'
                }}
              >
                <Link
                  onClick={closeEditModal}
                  color={'black'}
                  customCSS={"margin-right: 16px"}
                >Cancel</Link>

                <Button
                  onClick={handleProjectName}
                  onKeyDown={handleProjectNameOnEnterPress}
                  disabled={inputValue === projectName || !inputValue}
                  customCSS={"margin-left: 0px"}
                >
                  Save
                </Button>
              </div>
            </Modal>
          ) : null}



          {showSaveAndContinueButton ? <ShutterStock width="36px" height="36px" /> : null}
          <div className="edit-header">
            <div className="edit-left">
              {showSaveAndContinueButton ? (
                <ProjectDetails projectName={projectName} editProjectName={editProjectName} id={'sstk-popover'} disablePopover={disablePopover} isSimplePrintProduct={isSimplePrintProduct} downloadProof={downloadProof ? handleDownloadProof : ''} />
              ) : <></>}
            </div>
            <div className="edit-right">

              {showSaveAndContinueButton ?
                <div>
                  {/* <Button variant="secondary" onClickHandler={saveDesign}>Save project</Button>*/}
                  <Button onClickHandler={exportDesignComplete}>Continue</Button>
                </div>

                : null}
              {showSaveAndContinueButton ?
                <div className="edit-price">
                  {isPriceLoading ?
                    <LoadingDots /> :
                    <Price
                      isPriceCalculating={isPriceCalculating}
                      price={price} showMinimumPrice={showMinimumPrice}
                    />}
                </div> : <></>}
                {subHeaderProps && subHeaderProps.length > 0 ? [...subHeaderProps].map((prop, idx) => { return (<RenderProperty key={idx} property={prop} />) }) : <></>}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SubHeader;