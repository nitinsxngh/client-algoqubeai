declare module 'qrcode.react' {
  import { FC, SVGProps } from 'react';

  export interface QRCodeSVGProps {
    value: string;
    size?: number;
    level?: 'L' | 'M' | 'Q' | 'H';
    includeMargin?: boolean;
    marginSize?: number;
    bgColor?: string;
    fgColor?: string;
    imageSettings?: {
      src: string;
      height?: number;
      width?: number;
      excavate?: boolean;
    };
  }

  export const QRCodeSVG: FC<QRCodeSVGProps>;
}

