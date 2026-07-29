import { createContext, useContext } from 'react';

export const CreateLinkTransitionContext = createContext<(() => void) | null>(null);

export function useOpenCreateLinkTransition() {
  const openCreateLink = useContext(CreateLinkTransitionContext);
  if (!openCreateLink) {
    throw new Error('useOpenCreateLinkTransition must be used within LandingPage');
  }
  return openCreateLink;
}
