import React from 'react';
import Button from '@atlaskit/button';

import Editor from './editor';

import { testTitle, testDoc } from './test-challenge';
import { Container, EditButtonContainer } from './styled';

export interface DescriptionProps {
  content: string;
}
export default class Description extends React.Component<DescriptionProps> {
  state = {
    isEditing: false,
    savedTitle: testTitle,
    draftTitle: testTitle,
    savedDoc: testDoc,
    draftDoc: testDoc,
  };

  render() {
    const { content } = this.props;
    const { isEditing, savedTitle, savedDoc, draftTitle, draftDoc } = this.state;
    const isEditable = true;

    const onDraftSave = (title: string, doc: any) => {
      this.setState({
        isEditing: false,
        draftTitle: title,
        draftDoc: doc,
      });
    };
    const onSave = (title: string, doc: any) => {
      // console.log('DOC', JSON.stringify(doc));
      this.setState({
        isEditing: false,
        savedTitle: title,
        savedDoc: doc,
        draftTitle: title,
        draftDoc: doc,
      });
    };
    const onCancel = () => {
      this.setState({
        isEditing: false,
        draftTitle: this.state.savedTitle,
        draftDoc: this.state.savedDoc,
      });
    };

    return (
      <Container>
        <Editor
          title={savedTitle}
          savedDoc={savedDoc}
          onDraftSave={onDraftSave}
          onEdit={() => this.setState({ isEditing: true })}
          onSave={onSave}
          onCancel={onCancel}
          isEditing={isEditing}
        />
        {/* {isEditable &&
          !isEditing && (
            <EditButtonContainer>
              <Button onClick={() => this.setState({ isEditing: true })}>Edit</Button>
            </EditButtonContainer>
          )} */}
      </Container>
    );
  }
}
