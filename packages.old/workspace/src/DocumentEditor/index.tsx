import React, { Component } from 'react';

import { Editor, EditorContext, WithEditorActions } from '@atlaskit/editor-core';
import { ReactRenderer } from '@atlaskit/renderer';

import Button, { ButtonGroup } from '@atlaskit/button';

import { TitleInput, TitleHeading, Content, EditButtonContainer, TitleContainer } from './styled';
// import { emojiProvider } from '../../../mocks/emoji';

// import {
//   storyMediaProviderFactory,
//   storyContextIdentifierProviderFactory,
//   extensionProvider,
// } from '@atlaskit/editor-test-helpers';
// import { mention, emoji } from '@atlaskit/util-data-test';
// import { MockActivityResource } from '@atlaskit/activity/dist/es5/support';
// import { EmojiResource, EmojiProvider } from '@atlaskit/emoji';

interface TitleProps {
  isEditing: boolean;
  text: string;
  inputProps?: any;
}
const Title = ({ isEditing, text, inputProps }: TitleProps) =>
  isEditing ? (
    <TitleInput defaultValue={text} {...inputProps} />
  ) : (
    <TitleHeading>{text}</TitleHeading>
  );

const providers = {
  // emojiProvider: Promise.resolve(emojiProvider),
  // mentionProvider: Promise.resolve(mention.storyData.resourceProvider),
  // taskDecisionProvider: Promise.resolve(taskDecision.getMockTaskDecisionResource()),
  // contextIdentifierProvider: storyContextIdentifierProviderFactory(),
  // activityProvider: Promise.resolve(new MockActivityResource()),
  // extensionProvider: Promise.resolve(extensionProvider),
};
// const mediaProvider = storyMediaProviderFactory({
//   includeUserAuthProvider: true,
// });

export interface Props {
  title: string;
  doc: any;
  isEditing: boolean;
  removeContentPadding?: boolean;
  onEdit: () => void;
  onSave: (title: string, doc: any) => void;
  onDraftSave: (title: string, doc: any) => void;
  onCancel: () => void;
}
export interface State {
  disabled: boolean;
}

/**
 * Visual editor for human-readable documents (such as wiki pages or problem statements).
 */
export default class DocumentEditor extends Component<Props, State> {
  state = { disabled: false };

  render() {
    const { doc, title, onSave, onCancel, isEditing, onEdit, removeContentPadding } = this.props;
    const { disabled } = this.state;
    const appearance = isEditing ? 'full-page' : 'chromeless';
    return (
      <Content
        removeContentPadding={removeContentPadding}
        height={appearance === 'full-page' ? '100%' : 'auto'}
      >
        {isEditing ? (
          <EditorContext>
            <Editor
              appearance={appearance}
              // Liberally enable styling
              allowTextColor={true}
              allowTables={{ advanced: true }}
              allowCodeBlocks
              allowLists
              // Disable random Atlassian stuff
              allowJiraIssue={false}
              allowPanel={false}
              // analyticsHandler={analyticsHandler}
              // allowExtension={true}
              // allowRule={true}
              // allowDate={true}
              // allowTemplatePlaceholders={{ allowInserting: true }}
              {...providers}
              // media={{ provider: mediaProvider, allowMediaSingle: true }}
              popupsMountPoint={document.body}
              placeholder={isEditing ? 'Enter task description here...' : ''}
              disabled={!isEditing || disabled}
              shouldFocus={isEditing}
              defaultValue={doc}
              contentComponents={
                <TitleContainer>
                  <Title
                    isEditing={isEditing}
                    text={title}
                    inputProps={{
                      placeholder: 'Enter challenge name here...',
                      innerRef: this.titleElementOnRef,
                      onFocus: this.titleElementOnFocus,
                      onBlur: this.titleElementOnBlur,
                    }}
                  />

                  {!isEditing && (
                    <EditButtonContainer>
                      <Button onClick={onEdit}>Edit</Button>
                    </EditButtonContainer>
                  )}
                </TitleContainer>
              }
              primaryToolbarComponents={
                <WithEditorActions
                  render={actions => (
                    <ButtonGroup>
                      <Button
                        appearance="primary"
                        onClick={async () => {
                          const doc = await actions.getValue();
                          onSave(this.titleElement!.value, doc);
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        appearance="subtle"
                        onClick={() => {
                          actions.replaceDocument(doc);
                          onCancel();
                        }}
                      >
                        Cancel
                      </Button>
                    </ButtonGroup>
                  )}
                />
              }
              onSave={editor => onSave(this.titleElement!.value, editor.state.doc.toJSON())}
            />
          </EditorContext>
        ) : (
          <div>
            <TitleContainer>
              <Title isEditing={false} text={title} />
              <EditButtonContainer>
                <Button onClick={onEdit}>Edit</Button>
              </EditButtonContainer>
            </TitleContainer>
            <ReactRenderer document={doc} />
          </div>
        )}
      </Content>
    );
  }

  private titleElement?: HTMLInputElement;
  private titleElementOnFocus = () => this.setState({ disabled: true });
  private titleElementOnBlur = () => this.setState({ disabled: false });
  private titleElementOnRef = (ref?: HTMLInputElement) => {
    if (ref) {
      this.titleElement = ref;
      if (this.props.isEditing) {
        this.titleElement.focus();
      }
    }
  };
}
