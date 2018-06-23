import React from 'react';
import Button from '@atlaskit/button';

import Editor from './editor';

import { testTitle, testDoc } from './test-challenge';
import { Container, EditButtonContainer } from './styled';

export interface Props {
  title: string;
  doc: any;
}
export interface State {
  isEditing: boolean;
  savedTitle: string;
  draftTitle: string;
  savedDoc: any;
  draftDoc: any;
}
export default class Description extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    console.log(props);
    this.state = {
      isEditing: false,
      savedTitle: props.title,
      draftTitle: props.title,
      savedDoc: props.doc,
      draftDoc: props.doc,
    };
  }

  render() {
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
      </Container>
    );
  }
}
