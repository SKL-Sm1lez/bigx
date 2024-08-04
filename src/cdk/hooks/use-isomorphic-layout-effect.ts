import { useEffect, useLayoutEffect } from 'react';
import { platform } from '@cdk/platform';

export const useIsomorphicLayoutEffect = platform.isBrowser ? useLayoutEffect : useEffect;
