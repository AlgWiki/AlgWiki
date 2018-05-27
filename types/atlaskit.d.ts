declare module '@atlaskit/*';

declare module '@atlaskit/size-detector' {
  import React, { ReactNode, CSSProperties } from 'react';
  export interface SizeMetrics {
    width: number;
    height: number;
  }
  export interface Props {
    children: (size: SizeMetrics) => ReactNode;
    containerStyle?: CSSProperties;
    onResize?: (size: SizeMetrics) => void;
  }
  export interface State {
    sizeMetrics?: SizeMetrics;
  }
  export default class SizeDetector extends React.Component<Props, State> {}
}
