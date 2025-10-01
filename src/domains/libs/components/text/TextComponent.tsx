import React from 'react';
import styled from 'styled-components';
import { TextProps } from '@src/shared/types';
import { textDefaults } from './defaults';

interface TextComponentProps {
  props: TextProps;
  onClick?: (e: React.MouseEvent) => void;
}

const StyledText = styled.div<{
  $fontSize: number;
  $color: string;
  $fontWeight: string;
  $lineHeight: number;
  $isEmpty: boolean;
}>`
  font-size: ${props => props.$fontSize}px;
  color: ${props => props.$color};
  font-weight: ${props => props.$fontWeight};
  line-height: ${props => props.$lineHeight};
  font-style: ${props => (props.$isEmpty ? 'italic' : 'normal')};
  min-width: 40px;
  min-height: 16px;
  display: inline-block;
`;

export const TextComponent: React.FC<TextComponentProps> = ({
  props,
  onClick,
}) => {
  const {
    content = textDefaults.content,
    fontSize = textDefaults.fontSize,
    color = textDefaults.color,
    fontWeight = textDefaults.fontWeight,
    lineHeight = textDefaults.lineHeight,
  } = props;

  const isEmpty = !content || content.trim() === '';
  const displayText = isEmpty ? 'Text' : content;
  const displayColor = isEmpty ? '#999999' : color;

  return (
    <StyledText
      $fontSize={fontSize}
      $color={displayColor}
      $fontWeight={fontWeight}
      $lineHeight={lineHeight}
      $isEmpty={isEmpty}
      onClick={onClick}
    >
      {displayText}
    </StyledText>
  );
};
