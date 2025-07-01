import {
  MediaMatcher
} from "./chunk-KHGKQ4UT.js";
import {
  ANIMATION_MODULE_TYPE,
  InjectionToken,
  inject
} from "./chunk-HFBSZVPO.js";

// node_modules/@angular/material/fesm2022/animation-DfMFjxHu.mjs
var MATERIAL_ANIMATIONS = new InjectionToken("MATERIAL_ANIMATIONS");
function _animationsDisabled() {
  if (inject(MATERIAL_ANIMATIONS, { optional: true })?.animationsDisabled || inject(ANIMATION_MODULE_TYPE, { optional: true }) === "NoopAnimations") {
    return true;
  }
  const mediaMatcher = inject(MediaMatcher);
  return mediaMatcher.matchMedia("(prefers-reduced-motion)").matches;
}

export {
  _animationsDisabled
};
//# sourceMappingURL=chunk-DQYKD72F.js.map
