chunk-YCOEJRGR.js?v=5f840950:21551 Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools
SceneContainer.jsx:88 Uncaught ReferenceError: LaserBeams3D is not defined
    at SceneContainer2 (SceneContainer.jsx:88:10)
    at renderWithHooks (chunk-YCOEJRGR.js?v=5f840950:11548:26)
    at updateFunctionComponent (chunk-YCOEJRGR.js?v=5f840950:14582:28)
    at updateSimpleMemoComponent (chunk-YCOEJRGR.js?v=5f840950:14463:18)
    at updateMemoComponent (chunk-YCOEJRGR.js?v=5f840950:14366:22)
    at beginWork (chunk-YCOEJRGR.js?v=5f840950:15977:22)
    at HTMLUnknownElement.callCallback2 (chunk-YCOEJRGR.js?v=5f840950:3674:22)
    at Object.invokeGuardedCallbackDev (chunk-YCOEJRGR.js?v=5f840950:3699:24)
    at invokeGuardedCallback (chunk-YCOEJRGR.js?v=5f840950:3733:39)
    at beginWork$1 (chunk-YCOEJRGR.js?v=5f840950:19765:15)
SceneContainer2 @ SceneContainer.jsx:88
renderWithHooks @ chunk-YCOEJRGR.js?v=5f840950:11548
updateFunctionComponent @ chunk-YCOEJRGR.js?v=5f840950:14582
updateSimpleMemoComponent @ chunk-YCOEJRGR.js?v=5f840950:14463
updateMemoComponent @ chunk-YCOEJRGR.js?v=5f840950:14366
beginWork @ chunk-YCOEJRGR.js?v=5f840950:15977
callCallback2 @ chunk-YCOEJRGR.js?v=5f840950:3674
invokeGuardedCallbackDev @ chunk-YCOEJRGR.js?v=5f840950:3699
invokeGuardedCallback @ chunk-YCOEJRGR.js?v=5f840950:3733
beginWork$1 @ chunk-YCOEJRGR.js?v=5f840950:19765
performUnitOfWork @ chunk-YCOEJRGR.js?v=5f840950:19198
workLoopSync @ chunk-YCOEJRGR.js?v=5f840950:19137
renderRootSync @ chunk-YCOEJRGR.js?v=5f840950:19116
performConcurrentWorkOnRoot @ chunk-YCOEJRGR.js?v=5f840950:18678
workLoop @ chunk-YCOEJRGR.js?v=5f840950:197
flushWork @ chunk-YCOEJRGR.js?v=5f840950:176
performWorkUntilDeadline @ chunk-YCOEJRGR.js?v=5f840950:384
Show 16 more frames
Show less
SceneContainer.jsx:88 Uncaught ReferenceError: LaserBeams3D is not defined
    at SceneContainer2 (SceneContainer.jsx:88:10)
    at renderWithHooks (chunk-YCOEJRGR.js?v=5f840950:11548:26)
    at updateFunctionComponent (chunk-YCOEJRGR.js?v=5f840950:14582:28)
    at updateSimpleMemoComponent (chunk-YCOEJRGR.js?v=5f840950:14463:18)
    at updateMemoComponent (chunk-YCOEJRGR.js?v=5f840950:14366:22)
    at beginWork (chunk-YCOEJRGR.js?v=5f840950:15977:22)
    at HTMLUnknownElement.callCallback2 (chunk-YCOEJRGR.js?v=5f840950:3674:22)
    at Object.invokeGuardedCallbackDev (chunk-YCOEJRGR.js?v=5f840950:3699:24)
    at invokeGuardedCallback (chunk-YCOEJRGR.js?v=5f840950:3733:39)
    at beginWork$1 (chunk-YCOEJRGR.js?v=5f840950:19765:15)
SceneContainer2 @ SceneContainer.jsx:88
renderWithHooks @ chunk-YCOEJRGR.js?v=5f840950:11548
updateFunctionComponent @ chunk-YCOEJRGR.js?v=5f840950:14582
updateSimpleMemoComponent @ chunk-YCOEJRGR.js?v=5f840950:14463
updateMemoComponent @ chunk-YCOEJRGR.js?v=5f840950:14366
beginWork @ chunk-YCOEJRGR.js?v=5f840950:15977
callCallback2 @ chunk-YCOEJRGR.js?v=5f840950:3674
invokeGuardedCallbackDev @ chunk-YCOEJRGR.js?v=5f840950:3699
invokeGuardedCallback @ chunk-YCOEJRGR.js?v=5f840950:3733
beginWork$1 @ chunk-YCOEJRGR.js?v=5f840950:19765
performUnitOfWork @ chunk-YCOEJRGR.js?v=5f840950:19198
workLoopSync @ chunk-YCOEJRGR.js?v=5f840950:19137
renderRootSync @ chunk-YCOEJRGR.js?v=5f840950:19116
recoverFromConcurrentError @ chunk-YCOEJRGR.js?v=5f840950:18736
performConcurrentWorkOnRoot @ chunk-YCOEJRGR.js?v=5f840950:18684
workLoop @ chunk-YCOEJRGR.js?v=5f840950:197
flushWork @ chunk-YCOEJRGR.js?v=5f840950:176
performWorkUntilDeadline @ chunk-YCOEJRGR.js?v=5f840950:384
Show 17 more frames
Show less
chunk-PJXIKWRK.js?v=5f840950:17705 The above error occurred in the <SceneContainer2> component:

    at SceneContainer2 (http://localhost:5173/src/features/scene-3d/SceneContainer.jsx?t=1784790551925:32:17)
    at div
    at GameLayout2 (http://localhost:5173/src/features/layout/GameLayout.jsx?t=1784790551925:26:21)
    at GameProvider (http://localhost:5173/src/features/game-state/GameContext.jsx?t=1784790551925:22:32)
    at App

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
console.error @ chunk-PJXIKWRK.js?v=5f840950:17705
logCapturedError @ chunk-YCOEJRGR.js?v=5f840950:14032
update.callback @ chunk-YCOEJRGR.js?v=5f840950:14052
callCallback @ chunk-YCOEJRGR.js?v=5f840950:11248
commitUpdateQueue @ chunk-YCOEJRGR.js?v=5f840950:11265
commitLayoutEffectOnFiber @ chunk-YCOEJRGR.js?v=5f840950:17093
commitLayoutMountEffects_complete @ chunk-YCOEJRGR.js?v=5f840950:17980
commitLayoutEffects_begin @ chunk-YCOEJRGR.js?v=5f840950:17969
commitLayoutEffects @ chunk-YCOEJRGR.js?v=5f840950:17920
commitRootImpl @ chunk-YCOEJRGR.js?v=5f840950:19353
commitRoot @ chunk-YCOEJRGR.js?v=5f840950:19277
finishConcurrentRender @ chunk-YCOEJRGR.js?v=5f840950:18760
performConcurrentWorkOnRoot @ chunk-YCOEJRGR.js?v=5f840950:18718
workLoop @ chunk-YCOEJRGR.js?v=5f840950:197
flushWork @ chunk-YCOEJRGR.js?v=5f840950:176
performWorkUntilDeadline @ chunk-YCOEJRGR.js?v=5f840950:384
Show 16 more frames
Show less
chunk-YCOEJRGR.js?v=5f840950:19413 Uncaught ReferenceError: LaserBeams3D is not defined
    at SceneContainer2 (SceneContainer.jsx:88:10)
    at renderWithHooks (chunk-YCOEJRGR.js?v=5f840950:11548:26)
    at updateFunctionComponent (chunk-YCOEJRGR.js?v=5f840950:14582:28)
    at updateSimpleMemoComponent (chunk-YCOEJRGR.js?v=5f840950:14463:18)
    at updateMemoComponent (chunk-YCOEJRGR.js?v=5f840950:14366:22)
    at beginWork (chunk-YCOEJRGR.js?v=5f840950:15977:22)
    at beginWork$1 (chunk-YCOEJRGR.js?v=5f840950:19753:22)
    at performUnitOfWork (chunk-YCOEJRGR.js?v=5f840950:19198:20)
    at workLoopSync (chunk-YCOEJRGR.js?v=5f840950:19137:13)
    at renderRootSync (chunk-YCOEJRGR.js?v=5f840950:19116:15)
SceneContainer2 @ SceneContainer.jsx:88
renderWithHooks @ chunk-YCOEJRGR.js?v=5f840950:11548
updateFunctionComponent @ chunk-YCOEJRGR.js?v=5f840950:14582
updateSimpleMemoComponent @ chunk-YCOEJRGR.js?v=5f840950:14463
updateMemoComponent @ chunk-YCOEJRGR.js?v=5f840950:14366
beginWork @ chunk-YCOEJRGR.js?v=5f840950:15977
beginWork$1 @ chunk-YCOEJRGR.js?v=5f840950:19753
performUnitOfWork @ chunk-YCOEJRGR.js?v=5f840950:19198
workLoopSync @ chunk-YCOEJRGR.js?v=5f840950:19137
renderRootSync @ chunk-YCOEJRGR.js?v=5f840950:19116
recoverFromConcurrentError @ chunk-YCOEJRGR.js?v=5f840950:18736
performConcurrentWorkOnRoot @ chunk-YCOEJRGR.js?v=5f840950:18684
workLoop @ chunk-YCOEJRGR.js?v=5f840950:197
flushWork @ chunk-YCOEJRGR.js?v=5f840950:176
performWorkUntilDeadline @ chunk-YCOEJRGR.js?v=5f840950:384
Show 14 more frames
Show less
VM822 sandbox_bundle:2 Electron Security Warning (Insecure Content-Security-Policy) This renderer process has either no Content Security
  Policy set or a policy with "unsafe-eval" enabled. This exposes users of
  this app to unnecessary security risks.

For more information and help, consult
https://electronjs.org/docs/tutorial/security.
This warning will not show up
once the app is packaged.
warnAboutInsecureCSP @ VM822 sandbox_bundle:2
logSecurityWarnings @ VM822 sandbox_bundle:2
(anonymous) @ VM822 sandbox_bundle:2
load (async)
securityWarnings @ VM822 sandbox_bundle:2
./lib/renderer/common-init.ts @ VM822 sandbox_bundle:2
__webpack_require__ @ VM822 sandbox_bundle:2
(anonymous) @ VM822 sandbox_bundle:2
(anonymous) @ VM822 sandbox_bundle:2
___electron_webpack_init__ @ VM822 sandbox_bundle:2
(anonymous) @ VM822 sandbox_bundle:2