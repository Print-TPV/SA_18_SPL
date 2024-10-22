import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '../StaplesUI/Icon/Icon';
import './DocumentPreview.scss';
import { Popover } from '../StaplesUI/Popover/Popover';
import { Tooltip } from '../StaplesUI/Tooltip/Tooltip';

const FileDragableList = ({ fileList, forwardedRef, updateFileList, setTempFileList, tempFileList, isAddMoreFileEnabled }) => {
  const [fileOrder, setFileOrder] = useState(isAddMoreFileEnabled ? tempFileList : fileList);
  const draggingItem = useRef(null);
  const dragOverItem = useRef(null);
  const [removingId, setRemovingId] = useState(null);

  React.useImperativeHandle(forwardedRef, () => ({
    updateFileOrder
  }));

  const updateFileOrder = () => {
    updateFileList([...tempFileList]);
  }

  const handleDragStart = (e, index) => {
    draggingItem.current = index;
    e.target.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    draggingItem.current = null;
  };

  const handleDragOver = (index) => {
    dragOverItem.current = index;
  };

  const handleDrop = () => {
    const newOrder = [...fileOrder];
    const draggingIndex = draggingItem.current;
    const dragOverIndex = dragOverItem.current;

    const [draggedItem] = newOrder.splice(draggingIndex, 1);
    newOrder.splice(dragOverIndex, 0, draggedItem);

    setFileOrder(newOrder);
    dragOverItem.current = null;
  };

  // Function to move an item up in the order
  const moveItemUp = (currentIndex) => {
    if (currentIndex <= 0) return; // Prevent moving beyond the start of the array
    const newOrder = [...fileOrder];
    const itemToMove = newOrder.splice(currentIndex, 1)[0];
    newOrder.splice(currentIndex - 1, 0, itemToMove);
    setFileOrder(newOrder);
  };

  // Function to move an item down in the order
  const moveItemDown = (currentIndex) => {
    if (currentIndex >= fileOrder.length - 1) return; // Prevent moving beyond the end of the array
    const newOrder = [...fileOrder];
    const itemToMove = newOrder.splice(currentIndex, 1)[0];
    newOrder.splice(currentIndex + 1, 0, itemToMove);
    setFileOrder(newOrder);
  };

  const deleteClickHandler = (name, idx) => {
    setRemovingId(idx);
    setTimeout(() => {
      const newOrder = fileOrder.filter((_, i) => i !== idx);
      setFileOrder(newOrder);
      setRemovingId(null);
    }, 1000);
  }

  useEffect(() => {
    setTempFileList(fileOrder);
  }, [fileOrder]);

  useEffect(() => {
    if (isAddMoreFileEnabled) {
      setFileOrder(tempFileList);
    }
  }, [isAddMoreFileEnabled]);

  const getFileSizeFromBytes = (bytes) => {
    try {
      const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
      let i = 0, n = parseInt(bytes, 10) || 0;
      while (n >= 1024 && ++i) {
        n = n / 1024;
      }
      return (n.toFixed(n < 10 && i > 0 ? 1 : 0) + ' ' + units[i]);
    } catch (e) {
      return bytes;
    }
  }

  return (
    <div className="file-list">
      {fileOrder.map((file, index) => (
        <div
          key={file?.name + index}
          tabIndex={0}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => {
            e.preventDefault(); // Necessary to allow a drop
            handleDragOver(index);
          }}
          onDrop={(e) => {
            e.preventDefault();
            handleDrop();
          }}
          className={`file-item ${removingId === index ? "remove_animation" : ""}`}

        >
          <div className='file-navigation-container'>
            <span className={`file-navigation-icon ${(index === 0 ? 'disable_icon' : '')}`} onClick={() => moveItemUp(index)}>
              <Icon name="caret_up" color={index === 0 ? 'medium_gray_2' : 'black'} size={14} />
            </span>
            <span className={`file-navigation-icon ${((index + 1) === fileOrder.length ? 'disable_icon' : '')}`} onClick={() => moveItemDown(index)}>
              <Icon name="caret_down" color={(index + 1) === fileOrder.length ? 'medium_gray_2' : 'black'} size={14} />
            </span>
          </div>
          <div className='file-name-tile'>
            <div className='tooltip_wrapper_drag_list'>
              {file.name.length < 50 && <span className='file_name_container_drag_list'>{file.name}</span>}
              {file.name.length > 50 && <Tooltip
                customCSS={"width: 86%;"}
                id="file_draggable_tile_tooltip"
                delayHide={100}
                position="top"
                maxWidth={400}
                triggerElement={<span className='file_name_container_drag_list'>{file.name}</span>}>
                <span className='file_name_tooltip_text'>{file.name}</span>
              </Tooltip>}
            </div>
            <div className='file-detail-variables'>{file.page} page{file.page > 1 ? 's' : ''} {file.pageSize ? `| ${file.pageSize}` : ''} | {getFileSizeFromBytes(file.size)}</div>
          </div>
          <div>
            {removingId === index ? <div className='options-container'><Icon name="more-top" size={20} /></div> : <Popover
              id={`cardPopover-${index}`}
              position="left"
              showCaret={false}
              scrollHide
              minWidth={200}
              triggerElement={<div className='options-container'><Icon name="more-top" size={20} /></div>}
            >
              <div className='popover-container'>
                <div className={`more-option-action ${fileOrder?.length == 1 ? 'disable_tile' : ''}`} onClick={() => { deleteClickHandler(file, index) }}>
                  <Icon name="delete" color={fileOrder?.length == 1 ? 'dark_gray_2' : 'black'} size={14} />
                  Remove from project
                </div>
                {/* <div className='more-option-action'>
                  <Icon name="upload" size={14} />
                  Replace file
                </div> */}
              </div>
            </Popover>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileDragableList;