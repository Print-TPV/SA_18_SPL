import React from 'react';
import { Column, Row } from '../StaplesUI/Grid/Grid';
import { Icon } from '../StaplesUI/Icon/Icon';
import './DocumentPreview.scss';
import { NotificationBubble } from '../StaplesUI/NotificationBubble/NotificationBubble';
import { Link } from '../StaplesUI/Link/Link';
import { Tooltip } from '../StaplesUI/Tooltip/Tooltip';
function FileOperationWizard({ fileName, viewFileDetailsClickHandler, selectedFileSource, replaceFileClickHandler, addToMyFileClickHandler, addToMyFileState, fileList, manageFileHandler, navigateToFileHandler, isMultiFileProduct, showReplaceFileLink,allowUploadEdit }) {

    const showMyFile = selectedFileSource === 'LocalFile' && (addToMyFileState === 'initial' || addToMyFileState === 'uploading' || addToMyFileState === 'error') && allowUploadEdit
    
    return (
        <div>
            <div className='file_operation_heading_container'>
                <div className='file_operation_title'>Selected file(s)</div>
                {isMultiFileProduct && showReplaceFileLink && <Link underline color={"link_blue"} onClick={manageFileHandler}>
                    Manage files
                </Link>}
            </div>
            {addToMyFileState === 'uploading' && <NotificationBubble
                variant='info'
                customCSS={'margin: 12px 0 16px;'}
                maxWidth={true}>Your file is being added to My Files and can be accessed there when complete.</NotificationBubble>}
            {addToMyFileState === 'error' && <NotificationBubble
                variant='failure'
                customCSS={'margin: 12px 0 16px;'}
                maxWidth={true}>Something went wrong. We were unable to add your file to My Files, please try again.</NotificationBubble>}
            <div className='file_operation_container'>
                <Row>
                    <Column span={12}>
                        {(isMultiFileProduct) ? fileList.map((_file, idx) => (<div key={idx} className="file_name_wrapper" onClick={() => {
                            let startIndex = 0;
                            for (let i = 0; i < idx; i++) {
                                startIndex += fileList[i].page;
                            }
                            navigateToFileHandler(startIndex);
                        }}>
                            {_file.name.length < 50 && <span className='file_name_container_'>{_file.name}</span>}
                            {_file.name.length > 50 && <Tooltip
                                customCSS={"width: 86%;"}
                                id="file_operation_list_tooltip"
                                delayHide={100}
                                position="top"
                                maxWidth={400}
                                triggerElement={<span className='file_name_container_'>{_file.name}</span>}>
                                <span className='file_name_tooltip_text'>{_file.name}</span>
                            </Tooltip>}
                            <span className='file_page_container'>{_file.page} page{_file.page > 1 ? 's' : ''}</span>
                        </div>)) : <div className="tooltip_wrapper">
                            <span className='file_name_container'>{fileName}</span>
                            {fileName.length > 50 && <span className="tooltip_text">{fileName}</span>}
                        </div>}
                    </Column>
                </Row>
                {!isMultiFileProduct && <Row customCSS={"margin-bottom: 16px"}>
                    <Column spanLG={4} customCSS={"border-right: 1px solid #C0C0C0"}>
                        <div className='file_action' onClick={viewFileDetailsClickHandler}>
                            <Icon name="view-details" size={16} />
                            <span className='mar_left_8'>View details</span>
                        </div>
                    </Column>
                    {showReplaceFileLink && <Column spanLG={4} customCSS={`${showMyFile ? 'border-right: 1px solid #C0C0C0' : ''}`}>
                        <div className='file_action' onClick={replaceFileClickHandler}>
                            <Icon name="upload_preview" size={16} />
                            <span className='mar_left_8'>Replace file</span>
                        </div>
                    </Column>}
                    <Column spanLG={showMyFile ? 4 : 0}>
                        {showMyFile && <div className={`${addToMyFileState === 'uploading' ? 'file_action_disabled' : 'file_action'}`} onClick={addToMyFileClickHandler}>
                            <Icon name="plus" size={16} color={`${addToMyFileState === 'uploading' ? 'dark_gray_2' : 'black'}`} />
                            <span className='mar_left_8'>Add to My Files</span>
                        </div>}
                    </Column>
                </Row>}
            </div>
        </div>
    )
}

export default FileOperationWizard;