import React, { Component } from 'react';
import { ADDoc } from '@atlaskit/editor-common';

import DocumentEditor from '../DocumentEditor';

import { Container } from './styled';

export interface Props {
  title: string;
  doc: ADDoc;
  draftTitle?: string;
  draftDoc?: ADDoc;
  onDraftSave?: (title: string, doc: ADDoc) => void;
  onSave?: (title: string, doc: ADDoc) => void;
}
export interface State {
  isEditing: boolean;
  title: string;
  doc: ADDoc;
  draftTitle: string;
  draftDoc: ADDoc | null;
}
export default class Description extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isEditing: false,
      title: props.title,
      doc: props.doc,
      draftTitle: props.draftTitle || '',
      draftDoc: props.draftDoc || null,
    };
  }

  render() {
    const { onDraftSave, onSave } = this.props;
    const { isEditing, title, doc } = this.state;

    return (
      <Container>
        <DocumentEditor
          title={title}
          doc={doc}
          removeContentPadding
          isEditing={isEditing}
          onEdit={() => this.setState({ isEditing: true })}
          onDraftSave={(title: string, doc: any) => {
            this.setState({ draftTitle: title, draftDoc: doc });
            if (onDraftSave) onDraftSave(title, doc);
          }}
          onSave={(title: string, doc: any) => {
            this.setState({ isEditing: false, title, doc, draftTitle: '', draftDoc: null });
            if (onSave) onSave(title, doc);
          }}
          onCancel={() => {
            this.setState({ isEditing: false, draftTitle: '', draftDoc: null });
          }}
        />
      </Container>
    );
  }
}
