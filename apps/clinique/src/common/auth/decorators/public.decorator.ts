import { SetMetadata } from '@nestjs/common';

// Meme convention que auth-service (IS_PUBLIC_KEY = 'isPublic').
export const IS_PUBLIC_KEY = 'isPublic';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
