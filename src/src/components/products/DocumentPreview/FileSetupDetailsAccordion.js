import React from 'react'
import { Accordion } from '../StaplesUI/Accordion/Accordion'
import { AccordionContainer } from './FileSetupDetails.styles'
import { FileSetupDetails } from './FileSetupDetails'

export const FileSetupDetailsAccordion = ({ isBookletProduct, fileUploaded }) => {

  return (
    <AccordionContainer lockAccordion={fileUploaded}>
      <Accordion activeKey="ShowFileSetupDetails" variant="gray">
        <Accordion.Item eventKey={fileUploaded ? 'hideFileSetupDetails' : 'ShowFileSetupDetails'}
                        subTitle={isBookletProduct ? 'Learn how to prepare a print file for your booklet.' : 'Learn how to prepare your print file.'}>
          <Accordion.Header customCSS={ 'padding: 16px 16px' }>{'Questions on file setup?'}</Accordion.Header>
          <Accordion.Body  customCSS={'max-width: 100%'}>
            <FileSetupDetails isBookletProduct={isBookletProduct}/>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </AccordionContainer>
  )
}