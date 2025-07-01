import {
  MAT_SELECT_CONFIG,
  MAT_SELECT_SCROLL_STRATEGY,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY,
  MAT_SELECT_TRIGGER,
  MatOptgroup,
  MatOption,
  MatSelect,
  MatSelectChange,
  MatSelectModule,
  MatSelectTrigger
} from "./chunk-3DLLFNFL.js";
import "./chunk-FBGOEGYM.js";
import "./chunk-OKH3NPDK.js";
import "./chunk-J4XHIGAY.js";
import "./chunk-3DLUF37I.js";
import "./chunk-JY7JXFW7.js";
import "./chunk-Q2CO3MCA.js";
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
  MatPrefix,
  MatSuffix
} from "./chunk-TSZHSPMQ.js";
import "./chunk-YO7EDODF.js";
import "./chunk-M57WDGAR.js";
import "./chunk-VRVYYPQV.js";
import "./chunk-VG6Q5AEG.js";
import "./chunk-L3YK6CEI.js";
import "./chunk-SQOCKTIV.js";
import "./chunk-G5F3YHXG.js";
import "./chunk-MHZQAPFT.js";
import "./chunk-QCETVJKM.js";
import "./chunk-KAPXTIMC.js";
import "./chunk-DQYKD72F.js";
import "./chunk-SJSJ27PH.js";
import "./chunk-ZVJ5VWLU.js";
import "./chunk-KHGKQ4UT.js";
import "./chunk-EOFW2REK.js";
import "./chunk-BY6GHNEY.js";
import "./chunk-XZ4KMMZA.js";
import "./chunk-ZOH24TNR.js";
import "./chunk-4FWD5JQ7.js";
import "./chunk-TPXASOOL.js";
import "./chunk-PSX7AJZG.js";
import "./chunk-HFBSZVPO.js";
import "./chunk-YVXMBCE5.js";
import "./chunk-G6ECYYJH.js";
import "./chunk-RTGP7ALM.js";
import "./chunk-WDMUDEB6.js";

// node_modules/@angular/material/fesm2022/select.mjs
var matSelectAnimations = {
  // Represents
  // trigger('transformPanel', [
  //   state(
  //     'void',
  //     style({
  //       opacity: 0,
  //       transform: 'scale(1, 0.8)',
  //     }),
  //   ),
  //   transition(
  //     'void => showing',
  //     animate(
  //       '120ms cubic-bezier(0, 0, 0.2, 1)',
  //       style({
  //         opacity: 1,
  //         transform: 'scale(1, 1)',
  //       }),
  //     ),
  //   ),
  //   transition('* => void', animate('100ms linear', style({opacity: 0}))),
  // ])
  /** This animation transforms the select's overlay panel on and off the page. */
  transformPanel: {
    type: 7,
    name: "transformPanel",
    definitions: [
      {
        type: 0,
        name: "void",
        styles: {
          type: 6,
          styles: { opacity: 0, transform: "scale(1, 0.8)" },
          offset: null
        }
      },
      {
        type: 1,
        expr: "void => showing",
        animation: {
          type: 4,
          styles: {
            type: 6,
            styles: { opacity: 1, transform: "scale(1, 1)" },
            offset: null
          },
          timings: "120ms cubic-bezier(0, 0, 0.2, 1)"
        },
        options: null
      },
      {
        type: 1,
        expr: "* => void",
        animation: {
          type: 4,
          styles: { type: 6, styles: { opacity: 0 }, offset: null },
          timings: "100ms linear"
        },
        options: null
      }
    ],
    options: {}
  }
};
export {
  MAT_SELECT_CONFIG,
  MAT_SELECT_SCROLL_STRATEGY,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY,
  MAT_SELECT_TRIGGER,
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
  MatOptgroup,
  MatOption,
  MatPrefix,
  MatSelect,
  MatSelectChange,
  MatSelectModule,
  MatSelectTrigger,
  MatSuffix,
  matSelectAnimations
};
//# sourceMappingURL=@angular_material_select.js.map
