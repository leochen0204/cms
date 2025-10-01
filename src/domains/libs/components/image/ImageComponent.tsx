import React from 'react';
import styled from 'styled-components';
import { ImageProps } from '@src/shared/types';
import { imageDefaults } from './defaults';

interface ImageComponentProps {
  props: ImageProps;
  onClick?: (e: React.MouseEvent) => void;
}

const StyledImagePlaceholder = styled.div<{
  $width?: number;
  $height?: number;
}>`
  width: ${props => (props.$width !== undefined ? `${props.$width}px` : '120px')};
  height: ${props => (props.$height !== undefined ? `${props.$height}px` : '72px')};
  min-width: 80px;
  min-height: 40px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #666;
  cursor: pointer;
`;

const StyledImage = styled.img<{
  $width?: number;
  $height?: number;
  $borderRadius?: number;
}>`
  width: ${props => (props.$width !== undefined ? `${props.$width}px` : '120px')};
  height: ${props => (props.$height !== undefined ? `${props.$height}px` : '72px')};
  min-width: 80px;
  min-height: 40px;
  border: 1px solid #ddd;
  border-radius: ${props => (props.$borderRadius !== undefined ? `${props.$borderRadius}px` : '0')};
  display: inline-block;
  object-fit: ${props => props.style?.objectFit || 'cover'};
  object-position: ${props => props.style?.objectPosition || 'center'};
`;

export const ImageComponent: React.FC<ImageComponentProps> = ({
  props,
  onClick,
}) => {
  const {
    src = imageDefaults.src,
    alt = imageDefaults.alt,
    width = imageDefaults.width,
    height = imageDefaults.height,
    objectFit = imageDefaults.objectFit,
    objectPosition,
    borderRadius,
  } = props;
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  if (!src || imageError) {
    return (
      <StyledImagePlaceholder
        $width={width}
        $height={height}
        onClick={onClick}
      >
        {imageError ? '圖片載入失敗' : 'Image'}
      </StyledImagePlaceholder>
    );
  }

  return (
    <StyledImage
      src={src}
      alt={alt}
      $width={width}
      $height={height}
      $borderRadius={borderRadius}
      style={{ objectFit, objectPosition }}
      onClick={onClick}
      onError={handleImageError}
    />
  );
};
