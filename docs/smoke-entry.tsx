/**
 * Entry point used only by the smoke test.
 * Exposes the app and its route table so the test can mount every page.
 */
export { default as App, DOC_GROUPS } from './App';
export { createRoot } from 'react-dom/client';
export { act } from 'react-dom/test-utils';
import * as React from 'react';
export { React };
