declare module 'react-native-canvas' {
    import React from 'react';
    import { ViewProps } from 'react-native';
  
    export interface CanvasProps extends ViewProps {
      onCanvasCreate?: (canvas: any) => void;
    }
  
    export default class Canvas extends React.Component<CanvasProps> {
      src: any;
}
  }