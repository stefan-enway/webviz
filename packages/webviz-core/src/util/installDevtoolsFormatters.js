// @flow
//
//  Copyright (c) 2019-present, GM Cruise LLC
//
//  This source code is licensed under the Apache License, Version 2.0,
//  found in the LICENSE file in the root directory of this source tree.
//  You may not use this file except in compliance with the License.

// Custom formatters for Chrome dev tools. See documentation: http://bit.ly/object-formatters
// Note that the "Enable custom formatters" setting must be turned on in order to use these formatters.

import { isEqual } from "lodash";
import seedrandom from "seedrandom";

const timeFormatter = (() => {
  const timeFields = new Set(["sec", "nsec"]);
  function isTime(obj) {
    return isEqual(new Set(Object.getOwnPropertyNames(obj)), timeFields);
  }

  function groupDigits(str) {
    const result = ["span", {}];
    let start = 0;
    let end = str.length % 3 || 3;
    while (start < str.length) {
      result.push(["span", { style: end < str.length ? "margin-right: 2px;" : "" }, str.substring(start, end)]);
      start = end;
      end += 3;
    }
    return result;
  }

  return {
    header(o) {
      if (
        !isTime(o) ||
        o.sec < 0 ||
        o.nsec < 0 ||
        o.nsec >= 1e9 ||
        !Number.isInteger(o.sec) ||
        !Number.isInteger(o.nsec)
      ) {
        return null;
      }
      const nsec = o.nsec.toFixed().padStart(9, "0");
      const rng = seedrandom(`${o.sec}.${nsec}`);
      return [
        "span",
        { style: `color: hsl(${rng() * 360}deg, ${40 + rng() * 60}%, ${20 + rng() * 40}%);` },
        groupDigits(String(o.sec)),
        ".",
        groupDigits(nsec),
      ];
    },
    hasBody(o) {
      if (isTime(o)) {
        return false;
      }
    },
  };
})();

export default function installDevtoolsFormatters() {
  window.devtoolsFormatters = window.devtoolsFormatters || [];
  window.devtoolsFormatters.push(timeFormatter);
}
