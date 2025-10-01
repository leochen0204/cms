import React from 'react';
import styled from 'styled-components';
import { VideoProps } from '@src/shared/types';
import { videoDefaults } from './defaults';

interface VideoComponentProps {
  props: VideoProps;
  onClick?: (e: React.MouseEvent) => void;
}

const StyledVideoEmbed = styled.div<{
  $width: number;
  $height: number;
}>`
  width: ${props => props.$width}px;
  height: ${props => props.$height}px;
  display: inline-block;
  border: none;
  background-color: #000;
`;

const StyledVideoPlaceholder = styled.div<{
  $width: number;
  $height: number;
}>`
  width: ${props => props.$width}px;
  height: ${props => props.$height}px;
  background-color: #f0f0f0;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #666;
  cursor: pointer;
`;

const StyledVideo = styled.video<{
  $width: number;
  $height: number;
}>`
  width: ${props => props.$width}px;
  height: ${props => props.$height}px;
  border: none;
  display: inline-block;
  object-fit: cover;
`;

export const VideoComponent: React.FC<VideoComponentProps> = ({
  props,
  onClick,
}) => {
  const {
    src = videoDefaults.src,
    width = videoDefaults.width,
    height = videoDefaults.height,
    controls = videoDefaults.controls,
    autoplay = videoDefaults.autoplay,
    loop = videoDefaults.loop,
    muted = videoDefaults.muted,
    poster,
  } = props;

  // 支援 YouTube 連結，自動轉為 iframe 嵌入
  const extractYouTubeId = (url: string): string | null => {
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtu.be')) {
        return u.pathname.replace('/', '') || null;
      }
      if (u.hostname.includes('youtube.com')) {
        const id = u.searchParams.get('v');
        if (id) return id;
        const parts = u.pathname.split('/');
        const idx = parts.findIndex(p => p === 'embed');
        if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
      }
    } catch {}
    return null;
  };

  const ytId = src ? extractYouTubeId(src) : null;
  if (ytId) {
    const params = new URLSearchParams({
      controls: controls ? '1' : '0',
      autoplay: autoplay ? '1' : '0',
      mute: muted ? '1' : '0',
      rel: '0',
      modestbranding: '1',
      playsinline: '1',
    });
    if (loop) {
      params.set('loop', '1');
      params.set('playlist', ytId);
    }
    const embedSrc = `https://www.youtube.com/embed/${ytId}?${params.toString()}`;
    return (
      <StyledVideoEmbed $width={width} $height={height} onClick={onClick}>
        <iframe
          title="YouTube video"
          src={embedSrc}
          width="100%"
          height="100%"
          style={{ border: 0, width: '100%', height: '100%' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </StyledVideoEmbed>
    );
  }

  if (!src) {
    return (
      <StyledVideoPlaceholder $width={width} $height={height} onClick={onClick}>
        Video
      </StyledVideoPlaceholder>
    );
  }

  return (
    <StyledVideo
      $width={width}
      $height={height}
      src={src}
      controls={controls}
      autoPlay={autoplay}
      loop={loop}
      muted={muted}
      poster={poster}
      onClick={onClick}
    />
  );
};
