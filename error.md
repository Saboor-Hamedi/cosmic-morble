chunk-YCOEJRGR.js?v=0a0c7fbf:21551 Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools
VM4 sandbox_bundle:2 Electron Security Warning (Insecure Content-Security-Policy) This renderer process has either no Content Security
  Policy set or a policy with "unsafe-eval" enabled. This exposes users of
  this app to unnecessary security risks.

For more information and help, consult
https://electronjs.org/docs/tutorial/security.
This warning will not show up
once the app is packaged.
warnAboutInsecureCSP @ VM4 sandbox_bundle:2
4chunk-PJXIKWRK.js?v=0a0c7fbf:17705 The above error occurred in the <tspan> component:

    at tspan
    at primitive
    at http://localhost:5173/node_modules/.vite/deps/@react-three_drei.js?v=0a0c7fbf:87253:3
    at group
    at group
    at BalloonItem2 (http://localhost:5173/src/features/typing-game/FloatingBalloons3D.jsx?t=1784720854501:23:67)
    at group
    at FloatingBalloons3D2 (http://localhost:5173/src/features/typing-game/FloatingBalloons3D.jsx?t=1784720854501:251:54)
    at Suspense
    at ErrorBoundary (http://localhost:5173/node_modules/.vite/deps/chunk-PJXIKWRK.js?v=0a0c7fbf:16028:5)
    at FiberProvider (http://localhost:5173/node_modules/.vite/deps/chunk-PJXIKWRK.js?v=0a0c7fbf:17708:21)
    at Provider (http://localhost:5173/node_modules/.vite/deps/chunk-PJXIKWRK.js?v=0a0c7fbf:17317:3)

React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.
console.error @ chunk-PJXIKWRK.js?v=0a0c7fbf:17705
Show 1 more frame
Show less
2chunk-PJXIKWRK.js?v=0a0c7fbf:17814 Uncaught Error: R3F: Tspan is not part of the THREE namespace! Did you forget to extend? See: https://docs.pmnd.rs/react-three-fiber/api/objects#using-3rd-party-objects-declaratively
    at createInstance (chunk-PJXIKWRK.js?v=0a0c7fbf:15743:15)
    at completeWork (chunk-PJXIKWRK.js?v=0a0c7fbf:8414:34)
    at completeUnitOfWork (chunk-PJXIKWRK.js?v=0a0c7fbf:13690:24)
    at performUnitOfWork (chunk-PJXIKWRK.js?v=0a0c7fbf:13672:13)
    at workLoopSync (chunk-PJXIKWRK.js?v=0a0c7fbf:13604:13)
    at renderRootSync (chunk-PJXIKWRK.js?v=0a0c7fbf:13583:15)
    at recoverFromConcurrentError (chunk-PJXIKWRK.js?v=0a0c7fbf:13173:28)
    at performSyncWorkOnRoot (chunk-PJXIKWRK.js?v=0a0c7fbf:13316:28)
    at flushSyncCallbacks (chunk-PJXIKWRK.js?v=0a0c7fbf:2766:30)
    at workLoop (chunk-PJXIKWRK.js?v=0a0c7fbf:274:42)
chunk-PJXIKWRK.js?v=0a0c7fbf:17705 The above error occurred in the <ForwardRef(Canvas)> component:

    at Canvas (http://localhost:5173/node_modules/.vite/deps/chunk-PJXIKWRK.js?v=0a0c7fbf:17774:3)
    at FiberProvider (http://localhost:5173/node_modules/.vite/deps/chunk-PJXIKWRK.js?v=0a0c7fbf:17708:21)
    at CanvasWrapper
    at div
    at SceneContainer2
    at div
    at GameLayout2
    at GameProvider (http://localhost:5173/src/features/game-state/GameContext.jsx:22:32)
    at App

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
console.error @ chunk-PJXIKWRK.js?v=0a0c7fbf:17705
Show 1 more frame
Show less
chunk-YCOEJRGR.js?v=0a0c7fbf:19413 Uncaught Error: R3F: Tspan is not part of the THREE namespace! Did you forget to extend? See: https://docs.pmnd.rs/react-three-fiber/api/objects#using-3rd-party-objects-declaratively
    at createInstance (chunk-PJXIKWRK.js?v=0a0c7fbf:15743:15)
    at completeWork (chunk-PJXIKWRK.js?v=0a0c7fbf:8414:34)
    at completeUnitOfWork (chunk-PJXIKWRK.js?v=0a0c7fbf:13690:24)
    at performUnitOfWork (chunk-PJXIKWRK.js?v=0a0c7fbf:13672:13)
    at workLoopSync (chunk-PJXIKWRK.js?v=0a0c7fbf:13604:13)
    at renderRootSync (chunk-PJXIKWRK.js?v=0a0c7fbf:13583:15)
    at recoverFromConcurrentError (chunk-PJXIKWRK.js?v=0a0c7fbf:13173:28)
    at performSyncWorkOnRoot (chunk-PJXIKWRK.js?v=0a0c7fbf:13316:28)
    at flushSyncCallbacks (chunk-PJXIKWRK.js?v=0a0c7fbf:2766:30)
    at workLoop (chunk-PJXIKWRK.js?v=0a0c7fbf:274:42)
chunk-FKPCETFF.js?v=0a0c7fbf:17472 THREE.WebGLRenderer: Context Lost.