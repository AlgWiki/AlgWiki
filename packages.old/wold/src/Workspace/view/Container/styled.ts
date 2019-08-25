import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme';

export const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  text-align: left;
  background: #fff;
`;
Container.displayName = 'Container';

export const TabsContainer = styled.div`
  display: flex;
  width: 50%;
  flex-grow: 1;
`;
TabsContainer.displayName = 'TabsContainer';

export const EditorContainer = styled.div`
  flex-grow: 1;
  width: 50%;
  border-left: 1px solid #ccc;
`;
EditorContainer.displayName = 'EditorContainer';

export const TabContent = styled.div`
  display: flex;
  flex-grow: 1;
  min-height: 0%;
  padding: ${gridSize}px;
  overflow: auto;
`;
TabContent.displayName = 'TabContent';
