import React from 'react';
import styled from 'styled-components';
import { LinkProps } from '@src/shared/types';
import { linkDefaults } from './defaults';

interface LinkComponentProps {
  props: LinkProps;
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
}

const StyledLink = styled.a<{
  $color?: string;
  $underline?: string;
  $hasChildren: boolean;
}>`
  color: ${props => props.$color || linkDefaults.color};
  text-decoration: ${props => props.$underline || 'none'};
  display: ${props => (props.$hasChildren ? 'inline-block' : 'inline')};
  cursor: pointer;
  font-size: 14px;

  /* 當包含子元素時，移除文字相關樣式 */
  ${props =>
    props.$hasChildren &&
    `
    color: inherit;
    text-decoration: none;
  `}
`;

const EmptyPlaceholder = styled.span`
  font-size: 12px;
  color: #999;
  font-style: italic;
`;

export const LinkComponent: React.FC<LinkComponentProps> = ({ props, onClick, children }) => {
  const {
    href = linkDefaults.href,
    text = linkDefaults.text,
    target = linkDefaults.target,
    rel,
    color = linkDefaults.color,
    underline = linkDefaults.underline,
  } = props;

  const hasChildren = React.Children.count(children) > 0;

  return (
    <StyledLink
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      $color={color}
      $underline={underline}
      $hasChildren={hasChildren}
    >
      {hasChildren ? (
        children
      ) : text ? (
        text
      ) : (
        <EmptyPlaceholder>拖拽組件到這裡</EmptyPlaceholder>
      )}
    </StyledLink>
  );
};
