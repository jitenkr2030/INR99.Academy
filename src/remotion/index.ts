/**
 * Remotion Entry Point
 * This file registers all video compositions for rendering
 */

import { registerRoot } from 'remotion';
import { RemotionRoot } from './root';

// Register the root component to enable video rendering
// The name parameter is used for debugging and identification
registerRoot(RemotionRoot);

export default RemotionRoot;
