import React from 'react';
import styled from 'styled-components';
import { ContainerProps } from '@src/shared/types';
import { containerDefaults } from './defaults';

interface ContainerComponentProps {
  props: ContainerProps;
  children: React.ReactNode;
}

const StyledContainer = styled.div<{
  $backgroundColor: string;
  $padding: number;
  $borderWidth?: number;
  $borderStyle?: string;
  $borderColor?: string;
  $borderRadius?: number;
  $width?: number | string;
  $height?: number | string;
  $hasChildren: boolean;
  $flexDirection?: string;
  $justifyContent?: string;
  $alignItems?: string;
  $flexWrap?: string;
  $gap?: number;
}>`
  background-color: ${props => props.$backgroundColor};
  padding: ${props => props.$padding}px;
  border: ${props =>
    (props.$borderWidth ?? 0) > 0
      ? `${props.$borderWidth}px ${props.$borderStyle ?? 'solid'} ${props.$borderColor ?? '#e0e0e0'}`
      : 'none'};
  border-radius: ${props => props.$borderRadius ?? 0}px;
  box-sizing: border-box;
  width: ${props => {
    if (props.$width === 'auto') return 'auto';
    if (typeof props.$width === 'number') return `${props.$width}px`;
    if (typeof props.$width === 'string') return props.$width;
    return props.$hasChildren ? 'auto' : '320px';
  }};
  height: ${props => {
    if (props.$height === 'auto') return 'auto';
    if (typeof props.$height === 'number') return `${props.$height}px`;
    if (typeof props.$height === 'string') return props.$height;
    return 'auto';
  }};
  min-height: ${props => (props.$hasChildren || props.$height === 'auto' ? 'auto' : '240px')};
  min-width: ${props => (props.$hasChildren || props.$width === 'auto' ? 'auto' : '320px')};
  max-width: 100%;

  display: flex;
  flex-direction: ${props => props.$flexDirection ?? 'column'};
  justify-content: ${props => props.$justifyContent ?? 'flex-start'};
  align-items: ${props => props.$alignItems ?? 'stretch'};
  flex-wrap: ${props => props.$flexWrap ?? 'nowrap'};
  gap: ${props => (props.$gap ? `${props.$gap}px` : '0')};
`;

const EmptyPlaceholder = styled.div`
  font-size: 12px;
  color: #999;
  font-style: italic;
  text-align: center;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ContainerComponent: React.FC<ContainerComponentProps> = React.memo(
  ({ props, children }) => {
    const {
      backgroundColor = containerDefaults.backgroundColor,
      padding = containerDefaults.padding,
      borderColor,
      borderWidth,
      borderStyle,
      borderRadius,
      width,
      height,
      flexDirection,
      justifyContent,
      alignItems,
      flexWrap,
      gap,
    } = props;
    const hasChildren = React.Children.count(children) > 0;

    return (
      <StyledContainer
        $backgroundColor={backgroundColor}
        $padding={padding}
        $borderWidth={borderWidth}
        $borderStyle={borderStyle}
        $borderColor={borderColor}
        $borderRadius={borderRadius}
        $width={width}
        $height={height}
        $hasChildren={hasChildren}
        $flexDirection={flexDirection}
        $justifyContent={justifyContent}
        $alignItems={alignItems}
        $flexWrap={flexWrap}
        $gap={gap}
      >
        {!hasChildren ? (
          <EmptyPlaceholder>拖拽組件到這裡</EmptyPlaceholder>
        ) : (
          children
        )}
      </StyledContainer>
    );
  }
);
