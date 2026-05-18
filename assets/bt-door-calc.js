/* BlueTex Garage Door Material Calculator - Shopify embed
   Calculation logic ported exactly from calculator.js + app.js.
   Scoped to #btcalc; no ES-module dependencies. */

(function () {
  'use strict';

  // ─── KITS ───────────────────────────────────────────────────────────────────

  var KITS = [
    { id: 'single',  name: 'Single Door Kit',           label: 'Single Garage Door Kit',         widthInches: 50, linearFeet: 37.5,  coverageSqft: 150, price: 189, tapeRolls: 1, seamTapeRolls: 1, type: '50' },
    { id: 'double',  name: 'Double Door Kit',            label: 'Double Garage Door Kit',          widthInches: 50, linearFeet: 52.5,  coverageSqft: 205, price: 219, tapeRolls: 1, seamTapeRolls: 1, type: '50' },
    { id: 'oversized', name: 'Oversized Door(s) Kit',   label: 'Oversized Garage Door Kit',       widthInches: 50, linearFeet: 72,    coverageSqft: 295, price: 269, tapeRolls: 2, seamTapeRolls: 1, type: '50' },
    { id: 'multi50', name: 'Multi-Door Kit - 50" Wide', label: 'Multi-Door Kit - 50” Wide',  widthInches: 50, linearFeet: 168,   coverageSqft: 700, price: 399, tapeRolls: 3, seamTapeRolls: 2, type: '50', multiDoor: true },
    { id: 'multi62', name: 'Multi-Door Kit - 62" Wide', label: 'Multi-Door Kit - 62” Wide',  widthInches: 62, linearFeet: 135,   coverageSqft: 700, price: 399, tapeRolls: 3, seamTapeRolls: 2, type: '62', multiDoor: true }
  ];

  var CUSTOM_RECOMMENDATION = {
    id: 'custom', name: 'Custom / Larger Roll Needed', label: 'Custom / Larger Roll Needed',
    widthInches: null, linearFeet: null, coverageSqft: null, price: null,
    tapeRolls: 0, seamTapeRolls: 0, type: 'custom'
  };

  var PRODUCT_VARIANTS = {
    single:   { variantId: 44080581017818, title: 'Single Door (150 sq ft roll) Kit',                price: 189, img: 'https://cdn.shopify.com/s/files/1/0013/9637/5601/files/BlueTex_2mm_50_inch_Garage_Door_Kit_-_1_door_PRICE_fd2ca9da-55b8-4532-804e-459b356c0057.png?v=1775149819' },
    double:   { variantId: 44080581050586, title: 'Double Door (210 sq ft roll) Kit',                price: 219, img: 'https://cdn.shopify.com/s/files/1/0013/9637/5601/files/BlueTex_2mm_50_inch_Garage_Door_Kit_-_2_door_57659585-1183-4c52-acbd-13ec20733a37.png?v=1775149819' },
    oversized:{ variantId: 44608816218330, title: 'Oversized Door(s) (300 sq ft roll) Kit',          price: 269, img: 'https://cdn.shopify.com/s/files/1/0013/9637/5601/files/BlueTex_2mm_50_inch_Garage_Door_Kit_-_OVERSIZED_PRICE_updated_3a6aa0a4-8c33-4087-8744-e52f1c4f82e7.png?v=1775149824' },
    multi50:  { variantId: 47182845870298, title: 'Multi-Door (50” wide for 8’/12’ tall) Kit', price: 399, img: 'https://cdn.shopify.com/s/files/1/0013/9637/5601/files/BlueTex_2mm_50_inch_Garage_Door_Kit_-_MULTI_DOOR_with_price_8cfb06c4-2736-4c82-94dd-f3e1807640af.png?v=1775149819' },
    multi62:  { variantId: 47064044241114, title: 'Multi-Door (62” wide for 10’/15’ tall) Kit', price: 399, img: 'https://cdn.shopify.com/s/files/1/0013/9637/5601/files/BlueTex_2mm_62_inch_Garage_Door_Kit_-_MULTI_DOOR_with_price_fc957e2e-0057-4070-b52b-e518859a3a44.png?v=1775149825' }
  };

  // ─── CALCULATOR FUNCTIONS ────────────────────────────────────────────────────

  function kitById(id) {
    if (id === 'custom') return CUSTOM_RECOMMENDATION;
    return KITS.find(function (k) { return k.id === id; });
  }

  function planLabel(items) {
    if (!items.length) return CUSTOM_RECOMMENDATION.label;
    return items.map(function (item) { return item.quantity + 'x ' + item.label; }).join(' + ');
  }

  function normalizeRows(rows) {
    return rows
      .map(function (row) { return { width: Number(row.width), height: Number(row.height), qty: Math.max(0, Math.floor(Number(row.qty) || 0)) }; })
      .filter(function (row) { return row.width > 0 && row.height > 0 && row.qty > 0; })
      .map(function (row) { return Object.assign({}, row, { perDoorArea: row.width * row.height, totalRowArea: row.width * row.height * row.qty }); });
  }

  function mergeRows(rows) {
    var merged = new Map();
    rows.forEach(function (row) {
      var key = row.width + 'x' + row.height;
      var ex = merged.get(key);
      if (ex) { ex.qty += row.qty; ex.totalRowArea += row.totalRowArea; }
      else { merged.set(key, Object.assign({}, row)); }
    });
    return Array.from(merged.values());
  }

  function expandDoors(rows) {
    var result = [];
    normalizeRows(rows).forEach(function (row, groupIndex) {
      for (var i = 0; i < row.qty; i++) {
        result.push({ width: row.width, height: row.height, groupIndex: groupIndex, instance: i + 1, squareFeet: row.perDoorArea });
      }
    });
    return result;
  }

  function calculateDoor(door) {
    var runs50 = Math.ceil(door.height / 4);
    var runs62 = Math.ceil(door.height / 5);
    return Object.assign({}, door, {
      runs50: runs50, runs62: runs62,
      linear50Max: runs50 * door.width,
      linear62: runs62 * door.width,
      eligibleForSharedTop: door.height % 4 === 2
    });
  }

  function calculateRunsForRow(row) {
    var runs50 = Math.ceil(row.height / 4);
    var runs62 = Math.ceil(row.height / 5);
    return { width: row.width, height: row.height, qty: row.qty, perDoorArea: row.perDoorArea, totalRowArea: row.totalRowArea,
      runs50: runs50, runs62: runs62,
      footage50: runs50 * row.width * row.qty,
      footage62: runs62 * row.width * row.qty };
  }

  function calculateSharedTopStripSavings(doors) {
    var eligible = doors.filter(function (d) { return d.eligibleForSharedTop; }).map(function (d) { return d.width; }).sort(function (a, b) { return b - a; });
    var savings = 0;
    for (var i = 0; i + 1 < eligible.length; i += 2) { savings += Math.min(eligible[i], eligible[i + 1]); }
    return savings;
  }

  function sharedSavingsForGroup(row, qty) {
    return row.height % 4 === 2 ? Math.floor(qty / 2) * row.width : 0;
  }

  function classifyRequest(rows) {
    var normalizedRows = normalizeRows(rows);
    var mergedRows = mergeRows(normalizedRows);
    var totalDoorCount = normalizedRows.reduce(function (s, r) { return s + r.qty; }, 0);
    var totalArea = normalizedRows.reduce(function (s, r) { return s + r.totalRowArea; }, 0);
    var maxSingleDoorArea = normalizedRows.reduce(function (max, r) { return Math.max(max, r.perDoorArea); }, 0);
    return {
      rows: normalizedRows, mergedRows: mergedRows, totalDoorCount: totalDoorCount, totalArea: totalArea,
      maxSingleDoorArea: maxSingleDoorArea,
      allDoorsSameSize: mergedRows.length === 1 && mergedRows[0].qty === totalDoorCount,
      onlyOneActiveDoorRow: normalizedRows.length === 1,
      exactlyOneTotalDoor: totalDoorCount === 1,
      everyDoorAtMost10x10: normalizedRows.every(function (r) { return r.width <= 10 && r.height <= 10; }),
      requestType: totalDoorCount === 1 ? 'single-door' : totalDoorCount === 2 ? 'two-door' : totalDoorCount >= 3 ? 'multi-door' : 'empty'
    };
  }

  function calculateMaterialMath(rows) {
    var normalizedRows = normalizeRows(rows);
    var doors = expandDoors(rows).map(calculateDoor);
    var runsByRow = normalizedRows.map(calculateRunsForRow);
    var footage50 = runsByRow.reduce(function (s, r) { return s + r.footage50; }, 0);
    var footage62 = runsByRow.reduce(function (s, r) { return s + r.footage62; }, 0);
    var sharedTopStripSavings = calculateSharedTopStripSavings(doors);
    return {
      totalArea: normalizedRows.reduce(function (s, r) { return s + r.totalRowArea; }, 0),
      totalDoorCount: normalizedRows.reduce(function (s, r) { return s + r.qty; }, 0),
      footage50: footage50, footage62: footage62,
      efficient50Footage: Math.max(0, footage50 - sharedTopStripSavings),
      sharedTopStripSavings: sharedTopStripSavings,
      runsByRow: runsByRow
    };
  }

  function singleDoorFitsStandardSystem(row) { return row.perDoorArea <= kitById('oversized').coverageSqft; }
  function isEightByEightMulti50(row) { return row.width <= 8 && row.height <= 8; }
  function isTwelveByTwelveMulti50(row) { return row.width <= 12 && row.height <= 12; }
  function isTenFootMulti62(row) { return row.width <= 10 && row.height === 10; }
  function isFifteenFootMulti62(row) { return row.width <= 15 && row.height === 15; }

  function preferredMultiFamily(row) {
    if (row.qty >= 5 && isEightByEightMulti50(row)) return 'multi50';
    if (row.qty >= 3 && isTwelveByTwelveMulti50(row) && row.height === 12) return 'multi50';
    if (row.qty >= 3 && (isTenFootMulti62(row) || isFifteenFootMulti62(row))) return 'multi62';
    return null;
  }

  function groupFootage(row, family, qty) {
    if (family === 'multi62') return Math.ceil(row.height / 5) * row.width * qty;
    return Math.ceil(row.height / 4) * row.width * qty - sharedSavingsForGroup(row, qty);
  }

  function canUseMulti50(row, qty) {
    if (isEightByEightMulti50(row)) return qty >= 5 && qty <= 10;
    if (isTwelveByTwelveMulti50(row) && row.height === 12) return qty >= 3 && qty <= 4;
    return false;
  }

  function canUseMulti62(row, qty) {
    if (!(isTenFootMulti62(row) || isFifteenFootMulti62(row))) return false;
    return qty >= 3 && qty <= 6;
  }

  function makeGroupOption(row, family, qty, intentPenalty) {
    var kit = kitById(family);
    var area = row.perDoorArea * qty;
    var requiredLinearFeet = groupFootage(row, family, qty);
    return {
      coveredDoors: qty,
      items: [{ family: family, label: kit.label, quantity: 1 }],
      estimatedPrice: kit.price,
      kitCount: 1,
      spareCapacity: Math.max(0, kit.coverageSqft - area),
      spareLinearFeet: kit.linearFeet === null ? null : kit.linearFeet - requiredLinearFeet,
      requiredLinearFeet: requiredLinearFeet,
      totalLinearFeet: kit.linearFeet,
      tapeRolls: kit.tapeRolls,
      seamTapeRolls: kit.seamTapeRolls,
      intentPenalty: intentPenalty,
      complexity: family.startsWith('multi') ? 0 : 1,
      assignments: [{ family: family, label: kit.label, qty: qty, width: row.width, height: row.height, requiredLinearFeet: requiredLinearFeet, area: area }]
    };
  }

  function groupOptionsForRow(row) {
    if (!singleDoorFitsStandardSystem(row)) return [];
    var options = [];
    var preference = preferredMultiFamily(row);
    var nonPreferredPenalty = preference ? 100 : 0;
    for (var qty = 1; qty <= row.qty; qty++) {
      if (qty === 1 && row.width <= 12 && row.height <= 12 && row.perDoorArea <= 150) options.push(makeGroupOption(row, 'single', qty, nonPreferredPenalty));
      if ((qty === 2 && row.width <= 10 && row.height <= 10) || (qty === 1 && row.perDoorArea <= 205)) options.push(makeGroupOption(row, 'double', qty, nonPreferredPenalty));
      if (row.perDoorArea * qty <= 295) {
        var penalty = preference ? nonPreferredPenalty : (row.perDoorArea <= 150 && qty === 1 ? 8 : 0);
        options.push(makeGroupOption(row, 'oversized', qty, penalty));
      }
      if (canUseMulti50(row, qty)) options.push(makeGroupOption(row, 'multi50', qty, preference === 'multi50' ? 0 : 5));
      if (canUseMulti62(row, qty)) options.push(makeGroupOption(row, 'multi62', qty, preference === 'multi62' ? 0 : 5));
    }
    return options;
  }

  function mergeItems(items) {
    var merged = new Map();
    items.forEach(function (item) {
      var ex = merged.get(item.family);
      if (ex) { ex.quantity += item.quantity; } else { merged.set(item.family, Object.assign({}, item)); }
    });
    var order = ['single', 'double', 'oversized', 'multi50', 'multi62', 'custom'];
    return Array.from(merged.values()).sort(function (a, b) { return order.indexOf(a.family) - order.indexOf(b.family); });
  }

  function combinePlanParts(parts) {
    var items = mergeItems(parts.reduce(function (acc, p) { return acc.concat(p.items); }, []));
    var requiredLinearFeet = parts.reduce(function (s, p) { return s + (p.requiredLinearFeet || 0); }, 0);
    var totalLinearFeet = parts.every(function (p) { return p.totalLinearFeet !== null; })
      ? parts.reduce(function (s, p) { return s + p.totalLinearFeet; }, 0) : null;
    return {
      family: items.length === 1 && items[0].quantity === 1 ? items[0].family : 'bundle',
      label: planLabel(items), items: items,
      estimatedPrice: parts.every(function (p) { return p.estimatedPrice !== null; }) ? parts.reduce(function (s, p) { return s + p.estimatedPrice; }, 0) : null,
      requiredLinearFeet: requiredLinearFeet, totalLinearFeet: totalLinearFeet,
      spareLinearFeet: totalLinearFeet === null ? null : totalLinearFeet - requiredLinearFeet,
      spareCapacity: parts.reduce(function (s, p) { return s + p.spareCapacity; }, 0),
      kitCount: parts.reduce(function (s, p) { return s + p.kitCount; }, 0),
      tapeRolls: parts.reduce(function (s, p) { return s + p.tapeRolls; }, 0),
      seamTapeRolls: parts.reduce(function (s, p) { return s + p.seamTapeRolls; }, 0),
      intentPenalty: parts.reduce(function (s, p) { return s + p.intentPenalty; }, 0),
      complexity: new Set(items.map(function (i) { return i.family; })).size,
      assignments: parts.reduce(function (acc, p) { return acc.concat(p.assignments); }, [])
    };
  }

  function comparePlans(a, b) {
    if (a.intentPenalty !== b.intentPenalty) return a.intentPenalty - b.intentPenalty;
    if (a.kitCount !== b.kitCount) return a.kitCount - b.kitCount;
    if (a.spareCapacity !== b.spareCapacity) return a.spareCapacity - b.spareCapacity;
    if (a.spareLinearFeet !== b.spareLinearFeet) return a.spareLinearFeet - b.spareLinearFeet;
    if (a.estimatedPrice !== b.estimatedPrice) return a.estimatedPrice - b.estimatedPrice;
    return a.complexity - b.complexity;
  }

  function rowPlans(row) {
    var options = groupOptionsForRow(row);
    if (!options.length) return [];
    var empty = { items: [], estimatedPrice: 0, kitCount: 0, spareCapacity: 0, spareLinearFeet: 0, requiredLinearFeet: 0, totalLinearFeet: 0, tapeRolls: 0, seamTapeRolls: 0, intentPenalty: 0, complexity: 0, assignments: [] };
    var plansByCount = [];
    for (var x = 0; x <= row.qty; x++) plansByCount.push([]);
    plansByCount[0] = [empty];
    for (var count = 0; count <= row.qty; count++) {
      plansByCount[count].forEach(function (current) {
        options.forEach(function (option) {
          var nextCount = count + option.coveredDoors;
          if (nextCount > row.qty) return;
          var next = combinePlanParts([current, option]);
          plansByCount[nextCount].push(next);
          plansByCount[nextCount].sort(comparePlans);
          plansByCount[nextCount] = plansByCount[nextCount].slice(0, 24);
        });
      });
    }
    return plansByCount[row.qty].sort(comparePlans).slice(0, 12);
  }

  function combineRowPlanSets(rowPlanSets) {
    var empty = { items: [], estimatedPrice: 0, kitCount: 0, spareCapacity: 0, spareLinearFeet: 0, requiredLinearFeet: 0, totalLinearFeet: 0, tapeRolls: 0, seamTapeRolls: 0, intentPenalty: 0, complexity: 0, assignments: [] };
    var combined = [empty];
    rowPlanSets.forEach(function (plans) {
      var next = [];
      combined.forEach(function (base) { plans.forEach(function (plan) { next.push(combinePlanParts([base, plan])); }); });
      combined = next.sort(comparePlans).slice(0, 24);
    });
    return combined.sort(comparePlans);
  }

  function customPlan(materialMath) {
    return {
      family: 'custom', label: CUSTOM_RECOMMENDATION.label, items: [],
      estimatedPrice: null, requiredLinearFeet: null, totalLinearFeet: null, spareLinearFeet: null, spareCapacity: null,
      kitCount: 0, tapeRolls: 0, seamTapeRolls: 0, intentPenalty: 1000, complexity: 0, assignments: [],
      reasoning: [
        'This layout includes at least one door outside the standard BlueTex garage door kit coverage logic.',
        formatFeet(materialMath.footage50) + ' of 50” planning footage and ' + formatFeet(materialMath.footage62) + ' of 62” planning footage were calculated for custom quoting.'
      ]
    };
  }

  function makeGlobalMultiPlan(family, count, requiredLF, totalArea) {
    var kit = kitById(family);
    var totalLF = kit.linearFeet * count;
    var items = [{ family: family, label: kit.label, quantity: count }];
    return {
      family: count === 1 ? family : 'bundle', label: planLabel(items), items: items,
      estimatedPrice: kit.price * count, requiredLinearFeet: requiredLF, totalLinearFeet: totalLF,
      spareLinearFeet: totalLF - requiredLF, spareCapacity: kit.coverageSqft * count - totalArea,
      kitCount: count, tapeRolls: kit.tapeRolls * count, seamTapeRolls: kit.seamTapeRolls * count,
      intentPenalty: 0, complexity: 1, assignments: []
    };
  }

  function buildGlobalMultiKitCandidates(materialMath) {
    var totalDoorCount = materialMath.totalDoorCount;
    var totalArea = materialMath.totalArea;
    if (totalDoorCount < 2) return [];
    var candidates = [];
    var m50 = kitById('multi50');
    var n50 = Math.ceil(materialMath.efficient50Footage / m50.linearFeet);
    if (n50 >= 1 && n50 <= 4 && m50.coverageSqft * n50 >= totalArea) candidates.push(makeGlobalMultiPlan('multi50', n50, materialMath.efficient50Footage, totalArea));
    var m62 = kitById('multi62');
    var n62 = Math.ceil(materialMath.footage62 / m62.linearFeet);
    if (n62 >= 1 && n62 <= 4 && m62.coverageSqft * n62 >= totalArea) candidates.push(makeGlobalMultiPlan('multi62', n62, materialMath.footage62, totalArea));
    return candidates;
  }

  function addPlanExplanation(plan) {
    var multiItems = plan.items.filter(function (i) { return i.family.startsWith('multi'); });
    var hasBundle = plan.items.length > 1 || plan.items.some(function (i) { return i.quantity > 1; });
    var reasoning = [];
    if (multiItems.length > 0) reasoning.push('This request is best covered by ' + planLabel(multiItems) + ' because those kits match the intended multi-door layout before smaller kits are stacked.');
    reasoning.push(hasBundle
      ? 'This request exceeds a single standard kit, but it is still covered by a combination of standard BlueTex garage door kits.'
      : 'This request fits one standard BlueTex garage door kit, so no custom roll is needed.');
    reasoning.push('A custom roll recommendation is only shown when a standard kit combination does not fit the entered doors.');
    return Object.assign({}, plan, { reasoning: reasoning });
  }

  function buildCandidatePlans(rows) {
    var classification = classifyRequest(rows);
    if (!classification.totalDoorCount) return [];
    var materialMath = calculateMaterialMath(rows);
    var rowPlanSets = classification.mergedRows.map(rowPlans);
    var perRowPlans = rowPlanSets.every(function (p) { return p.length > 0; }) ? combineRowPlanSets(rowPlanSets) : [];
    var bestPerRow = perRowPlans[0];
    var perRowHasMulti = bestPerRow && bestPerRow.items.some(function (i) { return i.family.startsWith('multi'); });
    var globalCandidates = perRowHasMulti ? [] : buildGlobalMultiKitCandidates(materialMath);
    return perRowPlans.concat(globalCandidates).sort(comparePlans).slice(0, 12).map(addPlanExplanation);
  }

  function recommendKits(rows) {
    var materialMath = calculateMaterialMath(rows);
    var candidatePlans = buildCandidatePlans(rows);
    var primaryPlan = candidatePlans.length > 0 ? candidatePlans[0] : customPlan(materialMath);
    var alternatives = candidatePlans.slice(1, 4);
    var warnings = [];
    if (primaryPlan.family === 'custom') warnings.push('Standard kit combinations do not fit this request. Use the footage math for a custom roll or manual quote.');
    if (primaryPlan.spareLinearFeet !== null && primaryPlan.spareLinearFeet < 0) warnings.push('This recommendation follows BlueTex kit coverage limits first. Check final strip layout for unusually wide doors.');
    return { primaryPlan: primaryPlan, primaryRecommendation: primaryPlan, alternatives: alternatives, alternativeRecommendations: alternatives, materialMath: materialMath, explanation: primaryPlan.reasoning || [], warnings: warnings };
  }

  function calculateTapePlan(doors, recommendation) {
    if (!recommendation || !recommendation.primaryPlan) return [];
    var spacingInches = 18;
    return doors.map(function (door) {
      var strips = Math.ceil((door.width * 12) / spacingInches) + 1;
      var tighterStrips = Math.ceil((door.width * 12) / 12) + 1;
      return Object.assign({}, door, { spacingInches: spacingInches, strips: strips, tapeFeet: strips * door.height, tighterStrips: tighterStrips, tighterTapeFeet: tighterStrips * door.height });
    });
  }

  function calculate(rows) {
    var normalizedRows = normalizeRows(rows);
    var doors = expandDoors(rows).map(calculateDoor);
    var recommendation = recommendKits(rows);
    var materialMath = recommendation.materialMath;
    var tapePlan = calculateTapePlan(doors, recommendation);
    var tapeFeetNeeded = tapePlan.reduce(function (s, d) { return s + d.tapeFeet; }, 0);
    var tighterTapeFeetNeeded = tapePlan.reduce(function (s, d) { return s + d.tighterTapeFeet; }, 0);
    var tapeFeetIncluded = (recommendation.primaryPlan ? recommendation.primaryPlan.tapeRolls : 0) * 180;
    return {
      rows: normalizedRows, doors: doors,
      totals: { doorCount: materialMath.totalDoorCount, squareFeet: materialMath.totalArea, linear50Max: materialMath.footage50, sharedSavings: materialMath.sharedTopStripSavings, linear50Shared: materialMath.efficient50Footage, linear62: materialMath.footage62 },
      recommendation: recommendation, materialMath: materialMath, tapePlan: tapePlan,
      tapeFeetNeeded: tapeFeetNeeded, tighterTapeFeetNeeded: tighterTapeFeetNeeded,
      tapeFeetIncluded: tapeFeetIncluded,
      tapeShortfall: Math.max(0, tapeFeetNeeded - tapeFeetIncluded)
    };
  }

  function formatFeet(value) {
    if (value === null || isNaN(Number(value))) return 'Custom';
    var rounded = Math.round(value * 10) / 10;
    return Number.isInteger(rounded) ? rounded + '’' : rounded.toFixed(1) + '’';
  }

  function formatMoney(value) {
    if (value === null || isNaN(Number(value))) return 'Contact for sizing';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  }

  // ─── APP ─────────────────────────────────────────────────────────────────────

  function init() {
    var wrap = document.getElementById('btcalc');
    if (!wrap) return;

    var rowsEl      = wrap.querySelector('[data-btcalc-rows]');
    var resultsEl   = wrap.querySelector('[data-btcalc-results]');
    var summaryEl   = wrap.querySelector('[data-btcalc-summary]');
    var detailsEl   = wrap.querySelector('[data-btcalc-details]');
    var addRowBtn   = wrap.querySelector('[data-btcalc-add-row]');
    var calcBtn     = wrap.querySelector('[data-btcalc-calc]');
    var form        = wrap.querySelector('[data-btcalc-form]');

    var cartItems = [];
    var hasCalculated = false;
    var currentRows = [{ width: '', height: '', qty: 1 }];

    // ── Row rendering ──────────────────────────────────────────────────────────

    function rowHTML(row, index) {
      return '<div class="btcalc-door-row" data-btcalc-row>' +
        '<div class="btcalc-field">' +
          '<label for="btcalc-w-' + index + '">Door Width (ft)</label>' +
          '<div class="btcalc-input-shell">' +
            '<input id="btcalc-w-' + index + '" name="width" type="number" min="1" step="0.25" value="' + (row.width || '') + '" inputmode="decimal" placeholder="e.g. 10">' +
            '<span>ft</span>' +
          '</div>' +
        '</div>' +
        '<div class="btcalc-field">' +
          '<label for="btcalc-h-' + index + '">Door Height (ft)</label>' +
          '<div class="btcalc-input-shell">' +
            '<input id="btcalc-h-' + index + '" name="height" type="number" min="1" step="0.25" value="' + (row.height || '') + '" inputmode="decimal" placeholder="e.g. 10">' +
            '<span>ft</span>' +
          '</div>' +
        '</div>' +
        '<div class="btcalc-field btcalc-qty-field">' +
          '<label for="btcalc-q-' + index + '">Qty</label>' +
          '<input id="btcalc-q-' + index + '" name="qty" type="number" min="1" step="1" value="' + (row.qty != null ? row.qty : 1) + '" inputmode="numeric">' +
        '</div>' +
      '</div>';
    }

    function renderRows() {
      rowsEl.innerHTML = currentRows.map(rowHTML).join('');
    }

    function readRows() {
      return Array.from(wrap.querySelectorAll('[data-btcalc-row]')).map(function (el) {
        return {
          width: el.querySelector('[name="width"]').value,
          height: el.querySelector('[name="height"]').value,
          qty: el.querySelector('[name="qty"]').value
        };
      });
    }

    function hasValidRows(rows) {
      return rows.some(function (r) { return Number(r.width) > 0 && Number(r.height) > 0 && Number(r.qty) > 0; });
    }

    // ── Cart helpers ───────────────────────────────────────────────────────────

    function buildCartItems(plan) {
      return plan.items.map(function (item) {
        var p = PRODUCT_VARIANTS[item.family];
        if (!p) return null;
        return { variantId: p.variantId, img: p.img, title: p.title, price: p.price, family: item.family, label: item.label, qty: item.quantity, lineTotal: p.price * item.quantity };
      }).filter(Boolean);
    }

    function shoppingListHTML(items) {
      if (!items.length) {
        return '<div class="btcalc-empty-state"><span><strong>Custom quote needed.</strong> Call 1-800-595-8772 to finish this order.</span></div>';
      }
      return items.map(function (item) {
        return '<div class="btcalc-sli">' +
          '<div class="btcalc-thumb"><img src="' + item.img + '" alt="" loading="lazy"></div>' +
          '<div class="btcalc-sli-info">' +
            '<div class="btcalc-sli-label">' + item.title + '</div>' +
            '<div class="btcalc-sli-sub">' + item.label + '</div>' +
            '<div class="btcalc-sli-price">' + formatMoney(item.price) + ' each &middot; <strong>' + formatMoney(item.lineTotal) + '</strong></div>' +
          '</div>' +
          '<div class="btcalc-sli-qty">Qty ' + item.qty + '</div>' +
        '</div>';
      }).join('');
    }

    // ── Render results ─────────────────────────────────────────────────────────

    function renderResults(model) {
      if (!model.materialMath.totalDoorCount || !model.recommendation.primaryPlan) {
        resultsEl.style.display = 'none';
        return;
      }

      resultsEl.style.display = 'block';
      var best = model.recommendation.primaryPlan;
      var priceText = best.estimatedPrice === null ? 'Contact for custom sizing' : formatMoney(best.estimatedPrice) + ' estimated kit price';
      var spareText = best.spareLinearFeet === null ? 'Use the footage below for custom quoting' : best.spareLinearFeet >= 0 ? formatFeet(best.spareLinearFeet) + ' spare material in this recommendation' : 'Selected by product-family coverage limits';
      var tapeStatus = model.tapeShortfall > 0
        ? '<span class="btcalc-status btcalc-status--warn">Add tape recommended</span>'
        : '<span class="btcalc-status btcalc-status--ok">Included tape covers this layout</span>';

      cartItems = buildCartItems(best);

      summaryEl.innerHTML =
        '<section class="btcalc-res-panel">' +
          '<div class="btcalc-res-ph">' +
            '<div class="btcalc-snum">2</div>' +
            '<p class="btcalc-rpt">Kit Recommendation</p>' +
            '<span class="btcalc-rsep">&mdash;</span>' +
            '<p class="btcalc-rps">' + best.label + '</p>' +
          '</div>' +
          '<div class="btcalc-res-pb">' +
            '<div class="btcalc-hero-result">' +
              '<div>' +
                '<p class="btcalc-tiny-label">Recommended Kit Plan</p>' +
                '<p class="btcalc-big-value">' + best.label + '</p>' +
                '<small class="btcalc-ps">' + priceText + '</small>' +
              '</div>' +
              '<div class="btcalc-callout">' +
                '<p class="btcalc-tiny-label">Layout Footage</p>' +
                '<p class="btcalc-big-value">' + formatFeet(best.requiredLinearFeet) + '</p>' +
                '<small>' + spareText + '</small>' +
              '</div>' +
            '</div>' +
            '<div class="btcalc-sum-row"><span class="btcalc-sk">Door Coverage</span><span class="btcalc-sv">' + model.materialMath.totalDoorCount + ' door' + (model.materialMath.totalDoorCount === 1 ? '' : 's') + ' · ' + Math.round(model.materialMath.totalArea).toLocaleString() + ' sq ft</span></div>' +
            '<div class="btcalc-sum-row"><span class="btcalc-sk">Double-Sided Tape Included</span><span class="btcalc-sv">' + best.tapeRolls + ' roll' + (best.tapeRolls === 1 ? '' : 's') + ' · ' + formatFeet(model.tapeFeetIncluded) + '</span></div>' +
            '<div class="btcalc-sum-row"><span class="btcalc-sk">Seam Tape Included</span><span class="btcalc-sv">' + best.seamTapeRolls + ' roll' + (best.seamTapeRolls === 1 ? '' : 's') + '</span></div>' +
            (model.recommendation.warnings.length ? '<div class="btcalc-warning-list">' + model.recommendation.warnings.map(function (w) { return '<p>' + w + '</p>'; }).join('') + '</div>' : '') +
          '</div>' +
        '</section>';

      detailsEl.innerHTML =
        '<section class="btcalc-res-panel">' +
          '<div class="btcalc-res-ph">' +
            '<div class="btcalc-snum">3</div>' +
            '<p class="btcalc-rpt">Material + Tape</p>' +
            '<span class="btcalc-rsep">&mdash;</span>' +
            tapeStatus +
          '</div>' +
          '<div class="btcalc-res-pb">' +
            '<div class="btcalc-sum-row"><span class="btcalc-sk">Door Area</span><span class="btcalc-sv">' + Math.round(model.materialMath.totalArea).toLocaleString() + ' sq ft</span></div>' +
            '<div class="btcalc-sum-row"><span class="btcalc-sk">Material Layout</span><span class="btcalc-sv">' + formatFeet(best.requiredLinearFeet) + '</span></div>' +
            '<div class="btcalc-sum-row"><span class="btcalc-sk">Tape Needed</span><span class="btcalc-sv">' + formatFeet(model.tapeFeetNeeded) + '</span></div>' +
          '</div>' +
        '</section>' +
        '<section class="btcalc-res-panel">' +
          '<div class="btcalc-res-ph">' +
            '<div class="btcalc-snum">4</div>' +
            '<p class="btcalc-rpt">Products To Order</p>' +
            '<span class="btcalc-rsep">&mdash;</span>' +
            '<p class="btcalc-rps">' + (cartItems.length ? formatMoney(cartItems.reduce(function (s, i) { return s + i.lineTotal; }, 0)) : 'Custom Quote') + '</p>' +
          '</div>' +
          '<div class="btcalc-shopping-list">' + shoppingListHTML(cartItems) + '</div>' +
          '<div class="btcalc-cart-actions">' +
            '<button class="btcalc-aamb" type="button" data-btcalc-add-cart' + (cartItems.length ? '' : ' disabled') + '>Add to Cart</button>' +
          '</div>' +
        '</section>';
    }

    function update() {
      if (!hasCalculated) return;
      var rows = readRows();
      if (!hasValidRows(rows)) { resultsEl.style.display = 'none'; return; }
      renderResults(calculate(rows));
    }

    // ── Add to cart ────────────────────────────────────────────────────────────

    wrap.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-btcalc-add-cart]');
      if (!btn || btn.disabled) return;
      if (!cartItems.length) return;
      btn.textContent = 'Adding…';
      btn.disabled = true;
      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ items: cartItems.map(function (item) { return { id: item.variantId, quantity: item.qty }; }) })
      }).then(function (res) {
        if (!res.ok) throw new Error('Cart add failed');
        window.location.href = '/cart';
      }).catch(function () {
        btn.textContent = 'Add to Cart';
        btn.disabled = false;
      });
    });

    // ── Events ─────────────────────────────────────────────────────────────────

    renderRows();

    form.addEventListener('submit', function (e) { e.preventDefault(); });
    form.addEventListener('input', update);

    addRowBtn.addEventListener('click', function () {
      var rows = readRows();
      if (rows.length >= 6) return;
      rows.push({ width: '', height: '', qty: 1 });
      currentRows = rows;
      renderRows();
    });

    calcBtn.addEventListener('click', function () {
      var rows = readRows();
      if (!hasValidRows(rows)) return;
      hasCalculated = true;
      renderResults(calculate(rows));
      resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
