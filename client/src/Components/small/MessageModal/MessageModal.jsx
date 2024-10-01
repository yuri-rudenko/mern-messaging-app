import React from 'react';
import { Popover, Whisper } from 'rsuite';
import DropdownItem from 'rsuite/esm/Dropdown/DropdownItem';
import DropdownMenu from 'rsuite/esm/Dropdown/DropdownMenu';

const MessageModal = React.forwardRef(({ onSelect, ...rest }, ref) => (
    <Popover ref={ref} {...rest} full>
        <DropdownMenu onSelect={onSelect}>
            <DropdownItem eventKey={1}>Reply</DropdownItem>
            <DropdownItem eventKey={2}>Edit</DropdownItem>
            <DropdownItem eventKey={3}>Copy text</DropdownItem>
            <DropdownItem eventKey={4}>Delete</DropdownItem>
        </DropdownMenu>
    </Popover>
))

export default MessageModal;
