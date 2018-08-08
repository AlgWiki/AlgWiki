import styled from 'styled-components';

import { akColorN300 } from '@atlaskit/util-shared-styles';

import {
  akEditorCodeBackground,
  akEditorCodeBlockPadding,
  akEditorCodeFontFamily,
} from '@atlaskit/editor-core/dist/es5/styles';

import { akBorderRadius } from '@atlaskit/util-shared-styles';

export const Content: any = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;

  & .ProseMirror {
    & pre {
      font-family: ${akEditorCodeFontFamily};
      background: ${akEditorCodeBackground};
      padding: ${akEditorCodeBlockPadding};
      border-radius: ${akBorderRadius};
    }
  }

  ${({ removeContentPadding }: any) =>
    removeContentPadding &&
    `
      .content-area {
        margin: -50px 0;
        padding: 0 !important;
      }
    `};
`;
Content.displayName = 'Content';

export const TitleContainer = styled.div`
  display: flex;
  padding-top: 8px;
`;
TitleContainer.displayName = 'TitleContainer';

export const EditButtonContainer = styled.div`
  position: sticky;
  bottom: 4px;
  right: 4px;
`;
EditButtonContainer.displayName = 'EditButtonContainer';

export const TitleInput: any = styled.input`
  border: none;
  outline: none;
  font-size: 1.4em;
  margin: 0 0 21px;
  padding: 0;
  width: 100%;

  &::placeholder {
    color: ${akColorN300};
  }
`;
TitleInput.displayName = 'TitleInput';

export const TitleHeading: any = styled.h2`
  font-size: 1.4em;
  font-weight: normal;
  padding: 0 0 18px 0;
  margin: 0;
  width: 100%;
`;
TitleHeading.displayName = 'TitleHeading';
