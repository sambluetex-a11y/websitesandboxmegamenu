/*!
 * lazysizes 4.1.2
 * https://github.com/aFarkas/lazysizes
 */
/*! lazysizes - v4.1.7 */
!(function(a, b) {
  var c = function(d) {
    b(a.lazySizes, d), a.removeEventListener('lazyunveilread', c, !0);
  };
  (b = b.bind(null, a, a.document)),
    'object' == typeof module && module.exports
      ? b(require('lazysizes'))
      : a.lazySizes ? c() : a.addEventListener('lazyunveilread', c, !0);
})(window, function(a, b, c, d) {
  'use strict';
  function e(a) {
    var b = getComputedStyle(a, null) || {},
      c = b.fontFamily || '',
      d = c.match(j) || '',
      e = (d && c.match(k)) || '';
    return (
      e && (e = e[1]), {fit: (d && d[1]) || '', position: n[e] || e || 'center'}
    );
  }
  function f(a, b) {
    var d,
      e,
      f = c.cfg,
      g = a.cloneNode(!1),
      h = g.style,
      i = function() {
        var b = a.currentSrc || a.src;
        b &&
          e !== b &&
          ((e = b),
          (h.backgroundImage =
            'url(' + (m.test(b) ? JSON.stringify(b) : b) + ')'),
          d || ((d = !0), c.rC(g, f.loadingClass), c.aC(g, f.loadedClass)));
      },
      j = function() {
        c.rAF(i);
      };
    (a._lazysizesParentFit = b.fit),
      a.addEventListener('lazyloaded', j, !0),
      a.addEventListener('load', j, !0),
      g.addEventListener('load', function() {
        var a = g.currentSrc || g.src;
        a && a != l && ((g.src = l), (g.srcset = ''));
      }),
      c.rAF(function() {
        var d = a,
          e = a.parentNode;
        'PICTURE' == e.nodeName.toUpperCase() && ((d = e), (e = e.parentNode)),
          c.rC(g, f.loadedClass),
          c.rC(g, f.lazyClass),
          c.aC(g, f.loadingClass),
          c.aC(g, f.objectFitClass || 'lazysizes-display-clone'),
          g.getAttribute(f.srcsetAttr) && g.setAttribute(f.srcsetAttr, ''),
          g.getAttribute(f.srcAttr) && g.setAttribute(f.srcAttr, ''),
          (g.src = l),
          (g.srcset = ''),
          (h.backgroundRepeat = 'no-repeat'),
          (h.backgroundPosition = b.position),
          (h.backgroundSize = b.fit),
          (d.style.display = 'none'),
          a.setAttribute('data-parent-fit', b.fit),
          a.setAttribute('data-parent-container', 'prev'),
          e.insertBefore(g, d),
          a._lazysizesParentFit && delete a._lazysizesParentFit,
          a.complete && i();
      });
  }
  var g = b.createElement('a').style,
    h = 'objectFit' in g,
    i = h && 'objectPosition' in g,
    j = /object-fit["']*\s*:\s*["']*(contain|cover)/,
    k = /object-position["']*\s*:\s*["']*(.+?)(?=($|,|'|"|;))/,
    l =
      'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
    m = /\(|\)|'/,
    n = {center: 'center', '50% 50%': 'center'};
  if (!h || !i) {
    var o = function(a) {
      if (a.detail.instance == c) {
        var b = a.target,
          d = e(b);
        !d.fit || (h && 'center' == d.position) || f(b, d);
      }
    };
    a.addEventListener('lazyunveilread', o, !0), d && d.detail && o(d);
  }
});

/*! lazysizes - v4.1.7 */
!(function(a, b) {
  var c = function() {
    b(a.lazySizes), a.removeEventListener('lazyunveilread', c, !0);
  };
  (b = b.bind(null, a, a.document)),
    'object' == typeof module && module.exports
      ? b(require('lazysizes'), require('../fix-ios-sizes/fix-ios-sizes'))
      : a.lazySizes ? c() : a.addEventListener('lazyunveilread', c, !0);
})(window, function(a, b, c) {
  'use strict';
  var d,
    e = (c && c.cfg) || a.lazySizesConfig,
    f = b.createElement('img'),
    g = 'sizes' in f && 'srcset' in f,
    h = /\s+\d+h/g,
    i = (function() {
      var a = /\s+(\d+)(w|h)\s+(\d+)(w|h)/,
        c = Array.prototype.forEach;
      return function() {
        var d = b.createElement('img'),
          e = function(b) {
            var c,
              d,
              e = b.getAttribute(lazySizesConfig.srcsetAttr);
            e &&
              ((d = e.match(a)) &&
                (c = 'w' == d[2] ? d[1] / d[3] : d[3] / d[1]) &&
                b.setAttribute('data-aspectratio', c),
              b.setAttribute(lazySizesConfig.srcsetAttr, e.replace(h, '')));
          },
          f = function(a) {
            var b = a.target.parentNode;
            b &&
              'PICTURE' == b.nodeName &&
              c.call(b.getElementsByTagName('source'), e),
              e(a.target);
          },
          g = function() {
            d.currentSrc && b.removeEventListener('lazybeforeunveil', f);
          };
        b.addEventListener('lazybeforeunveil', f),
          (d.onload = g),
          (d.onerror = g),
          (d.srcset = 'data:,a 1w 1h'),
          d.complete && g();
      };
    })();
  if (
    (e || ((e = {}), (a.lazySizesConfig = e)),
    e.supportsType ||
      (e.supportsType = function(a) {
        return !a;
      }),
    !a.picturefill && !e.pf)
  ) {
    if (a.HTMLPictureElement && g)
      return (
        b.msElementsFromPoint && i(navigator.userAgent.match(/Edge\/(\d+)/)),
        void (e.pf = function() {})
      );
    (e.pf = function(b) {
      var c, e;
      if (!a.picturefill)
        for (c = 0, e = b.elements.length; c < e; c++) d(b.elements[c]);
    }),
      (d = (function() {
        var f = function(a, b) {
            return a.w - b.w;
          },
          i = /^\s*\d+\.*\d*px\s*$/,
          j = function(a) {
            var b,
              c,
              d = a.length,
              e = a[d - 1],
              f = 0;
            for (f; f < d; f++)
              if (((e = a[f]), (e.d = e.w / a.w), e.d >= a.d)) {
                !e.cached &&
                  (b = a[f - 1]) &&
                  b.d > a.d - 0.13 * Math.pow(a.d, 2.2) &&
                  ((c = Math.pow(b.d - 0.6, 1.6)),
                  b.cached && (b.d += 0.15 * c),
                  b.d + (e.d - a.d) * c > a.d && (e = b));
                break;
              }
            return e;
          },
          k = (function() {
            var a,
              b = /(([^,\s].[^\s]+)\s+(\d+)w)/g,
              c = /\s/,
              d = function(b, c, d, e) {
                a.push({c: c, u: d, w: 1 * e});
              };
            return function(e) {
              return (
                (a = []),
                (e = e.trim()),
                e.replace(h, '').replace(b, d),
                a.length || !e || c.test(e) || a.push({c: e, u: e, w: 99}),
                a
              );
            };
          })(),
          l = function() {
            l.init ||
              ((l.init = !0),
              addEventListener(
                'resize',
                (function() {
                  var a,
                    c = b.getElementsByClassName('lazymatchmedia'),
                    e = function() {
                      var a, b;
                      for (a = 0, b = c.length; a < b; a++) d(c[a]);
                    };
                  return function() {
                    clearTimeout(a), (a = setTimeout(e, 66));
                  };
                })()
              ));
          },
          m = function(b, d) {
            var f,
              g = b.getAttribute('srcset') || b.getAttribute(e.srcsetAttr);
            !g &&
              d &&
              (g = b._lazypolyfill
                ? b._lazypolyfill._set
                : b.getAttribute(e.srcAttr) || b.getAttribute('src')),
              (b._lazypolyfill && b._lazypolyfill._set == g) ||
                ((f = k(g || '')),
                d &&
                  b.parentNode &&
                  ((f.isPicture =
                    'PICTURE' == b.parentNode.nodeName.toUpperCase()),
                  f.isPicture &&
                    a.matchMedia &&
                    (c.aC(b, 'lazymatchmedia'), l())),
                (f._set = g),
                Object.defineProperty(b, '_lazypolyfill', {
                  value: f,
                  writable: !0,
                }));
          },
          n = function(b) {
            var d = a.devicePixelRatio || 1,
              e = c.getX && c.getX(b);
            return Math.min(e || d, 2.5, d);
          },
          o = function(b) {
            return a.matchMedia
              ? (o = function(a) {
                  return !a || (matchMedia(a) || {}).matches;
                })(b)
              : !b;
          },
          p = function(a) {
            var b, d, g, h, k, l, p;
            if (((h = a), m(h, !0), (k = h._lazypolyfill), k.isPicture))
              for (
                d = 0,
                  b = a.parentNode.getElementsByTagName('source'),
                  g = b.length;
                d < g;
                d++
              )
                if (
                  e.supportsType(b[d].getAttribute('type'), a) &&
                  o(b[d].getAttribute('media'))
                ) {
                  (h = b[d]), m(h), (k = h._lazypolyfill);
                  break;
                }
            return (
              k.length > 1
                ? ((p = h.getAttribute('sizes') || ''),
                  (p = (i.test(p) && parseInt(p, 10)) || c.gW(a, a.parentNode)),
                  (k.d = n(a)),
                  !k.src || !k.w || k.w < p
                    ? ((k.w = p), (l = j(k.sort(f))), (k.src = l))
                    : (l = k.src))
                : (l = k[0]),
              l
            );
          },
          q = function(a) {
            if (
              !g ||
              !a.parentNode ||
              'PICTURE' == a.parentNode.nodeName.toUpperCase()
            ) {
              var b = p(a);
              b &&
                b.u &&
                a._lazypolyfill.cur != b.u &&
                ((a._lazypolyfill.cur = b.u),
                (b.cached = !0),
                a.setAttribute(e.srcAttr, b.u),
                a.setAttribute('src', b.u));
            }
          };
        return (q.parse = k), q;
      })()),
      e.loadedClass &&
        e.loadingClass &&
        (function() {
          var a = [];
          ['img[sizes$="px"][srcset].', 'picture > img:not([srcset]).'].forEach(
            function(b) {
              a.push(b + e.loadedClass), a.push(b + e.loadingClass);
            }
          ),
            e.pf({elements: b.querySelectorAll(a.join(', '))});
        })();
  }
});

(function(window, factory) {
  var globalInstall = function() {
    factory(window.lazySizes);
    window.removeEventListener('lazyunveilread', globalInstall, true);
  };

  factory = factory.bind(null, window, window.document);

  if (typeof module == 'object' && module.exports) {
    factory(require('lazysizes'));
  } else if (window.lazySizes) {
    globalInstall();
  } else {
    window.addEventListener('lazyunveilread', globalInstall, true);
  }
})(window, function(window, document, lazySizes) {
  'use strict';
  if (!window.addEventListener) {
    return;
  }

  var regWhite = /\s+/g;
  var regSplitSet = /\s*\|\s+|\s+\|\s*/g;
  var regSource = /^(.+?)(?:\s+\[\s*(.+?)\s*\])(?:\s+\[\s*(.+?)\s*\])?$/;
  var regType = /^\s*\(*\s*type\s*:\s*(.+?)\s*\)*\s*$/;
  var regBgUrlEscape = /\(|\)|'/;
  var allowedBackgroundSize = {contain: 1, cover: 1};
  var proxyWidth = function(elem) {
    var width = lazySizes.gW(elem, elem.parentNode);

    if (!elem._lazysizesWidth || width > elem._lazysizesWidth) {
      elem._lazysizesWidth = width;
    }
    return elem._lazysizesWidth;
  };
  var getBgSize = function(elem) {
    var bgSize;

    bgSize = (
      getComputedStyle(elem) || {getPropertyValue: function() {}}
    ).getPropertyValue('background-size');

    if (
      !allowedBackgroundSize[bgSize] &&
      allowedBackgroundSize[elem.style.backgroundSize]
    ) {
      bgSize = elem.style.backgroundSize;
    }

    return bgSize;
  };
  var setTypeOrMedia = function(source, match) {
    if (match) {
      var typeMatch = match.match(regType);
      if (typeMatch && typeMatch[1]) {
        source.setAttribute('type', typeMatch[1]);
      } else {
        source.setAttribute(
          'media',
          lazySizesConfig.customMedia[match] || match
        );
      }
    }
  };
  var createPicture = function(sets, elem, img) {
    var picture = document.createElement('picture');
    var sizes = elem.getAttribute(lazySizesConfig.sizesAttr);
    var ratio = elem.getAttribute('data-ratio');
    var optimumx = elem.getAttribute('data-optimumx');

    if (elem._lazybgset && elem._lazybgset.parentNode == elem) {
      elem.removeChild(elem._lazybgset);
    }

    Object.defineProperty(img, '_lazybgset', {
      value: elem,
      writable: true,
    });
    Object.defineProperty(elem, '_lazybgset', {
      value: picture,
      writable: true,
    });

    sets = sets.replace(regWhite, ' ').split(regSplitSet);

    picture.style.display = 'none';
    img.className = lazySizesConfig.lazyClass;

    if (sets.length == 1 && !sizes) {
      sizes = 'auto';
    }

    sets.forEach(function(set) {
      var match;
      var source = document.createElement('source');

      if (sizes && sizes != 'auto') {
        source.setAttribute('sizes', sizes);
      }

      if ((match = set.match(regSource))) {
        source.setAttribute(lazySizesConfig.srcsetAttr, match[1]);

        setTypeOrMedia(source, match[2]);
        setTypeOrMedia(source, match[3]);
      } else {
        source.setAttribute(lazySizesConfig.srcsetAttr, set);
      }

      picture.appendChild(source);
    });

    if (sizes) {
      img.setAttribute(lazySizesConfig.sizesAttr, sizes);
      elem.removeAttribute(lazySizesConfig.sizesAttr);
      elem.removeAttribute('sizes');
    }
    if (optimumx) {
      img.setAttribute('data-optimumx', optimumx);
    }
    if (ratio) {
      img.setAttribute('data-ratio', ratio);
    }

    picture.appendChild(img);

    elem.appendChild(picture);
  };

  var proxyLoad = function(e) {
    if (!e.target._lazybgset) {
      return;
    }

    var image = e.target;
    var elem = image._lazybgset;
    var bg = image.currentSrc || image.src;

    if (bg) {
      var event = lazySizes.fire(elem, 'bgsetproxy', {
        src: bg,
        useSrc: regBgUrlEscape.test(bg) ? JSON.stringify(bg) : bg,
      });

      if (!event.defaultPrevented) {
        elem.style.backgroundImage = 'url(' + event.detail.useSrc + ')';
      }
    }

    if (image._lazybgsetLoading) {
      lazySizes.fire(elem, '_lazyloaded', {}, false, true);
      delete image._lazybgsetLoading;
    }
  };

  addEventListener('lazybeforeunveil', function(e) {
    var set, image, elem;

    if (e.defaultPrevented || !(set = e.target.getAttribute('data-bgset'))) {
      return;
    }

    elem = e.target;
    image = document.createElement('img');

    image.alt = '';

    image._lazybgsetLoading = true;
    e.detail.firesLoad = true;

    createPicture(set, elem, image);

    setTimeout(function() {
      lazySizes.loader.unveil(image);

      lazySizes.rAF(function() {
        lazySizes.fire(image, '_lazyloaded', {}, true, true);
        if (image.complete) {
          proxyLoad({target: image});
        }
      });
    });
  });

  document.addEventListener('load', proxyLoad, true);

  window.addEventListener(
    'lazybeforesizes',
    function(e) {
      if (e.detail.instance != lazySizes) {
        return;
      }
      if (e.target._lazybgset && e.detail.dataAttr) {
        var elem = e.target._lazybgset;
        var bgSize = getBgSize(elem);

        if (allowedBackgroundSize[bgSize]) {
          e.target._lazysizesParentFit = bgSize;

          lazySizes.rAF(function() {
            e.target.setAttribute('data-parent-fit', bgSize);
            if (e.target._lazysizesParentFit) {
              delete e.target._lazysizesParentFit;
            }
          });
        }
      }
    },
    true
  );

  document.documentElement.addEventListener('lazybeforesizes', function(e) {
    if (
      e.defaultPrevented ||
      !e.target._lazybgset ||
      e.detail.instance != lazySizes
    ) {
      return;
    }
    e.detail.width = proxyWidth(e.target._lazybgset);
  });
});

/*! lazysizes - v4.1.7 */
!(function(a, b) {
  var c = function() {
    b(a.lazySizes), a.removeEventListener('lazyunveilread', c, !0);
  };
  (b = b.bind(null, a, a.document)),
    'object' == typeof module && module.exports
      ? b(require('lazysizes'))
      : a.lazySizes ? c() : a.addEventListener('lazyunveilread', c, !0);
})(window, function(a, b, c) {
  'use strict';
  if (a.addEventListener) {
    var d = a.requestAnimationFrame || setTimeout,
      e = function() {
        var f,
          g,
          h,
          i,
          j = c.cfg,
          k = {
            'data-bgset': 1,
            'data-include': 1,
            'data-poster': 1,
            'data-bg': 1,
            'data-script': 1,
          },
          l = '(\\s|^)(' + j.loadedClass,
          m = b.documentElement,
          n = function(a) {
            d(function() {
              c.rC(a, j.loadedClass),
                j.unloadedClass && c.rC(a, j.unloadedClass),
                c.aC(a, j.lazyClass),
                ('none' == a.style.display ||
                  (a.parentNode && 'none' == a.parentNode.style.display)) &&
                  setTimeout(function() {
                    c.loader.unveil(a);
                  }, 0);
            });
          },
          o = function(a) {
            var b, c, d, e;
            for (b = 0, c = a.length; b < c; b++)
              (d = a[b]),
                (e = d.target),
                e.getAttribute(d.attributeName) &&
                  ('source' == e.localName &&
                    e.parentNode &&
                    (e = e.parentNode.querySelector('img')),
                  e && l.test(e.className) && n(e));
          };
        j.unloadedClass && (l += '|' + j.unloadedClass),
          (l += '|' + j.loadingClass + ')(\\s|$)'),
          (l = new RegExp(l)),
          (k[j.srcAttr] = 1),
          (k[j.srcsetAttr] = 1),
          a.MutationObserver
            ? ((h = new MutationObserver(o)),
              (f = function() {
                i ||
                  ((i = !0),
                  h.observe(m, {
                    subtree: !0,
                    attributes: !0,
                    attributeFilter: Object.keys(k),
                  }));
              }),
              (g = function() {
                i && ((i = !1), h.disconnect());
              }))
            : (m.addEventListener(
                'DOMAttrModified',
                (function() {
                  var a,
                    b = [],
                    c = function() {
                      o(b), (b = []), (a = !1);
                    };
                  return function(d) {
                    i &&
                      k[d.attrName] &&
                      d.newValue &&
                      (b.push({target: d.target, attributeName: d.attrName}),
                      a || (setTimeout(c), (a = !0)));
                  };
                })(),
                !0
              ),
              (f = function() {
                i = !0;
              }),
              (g = function() {
                i = !1;
              })),
          addEventListener('lazybeforeunveil', g, !0),
          addEventListener('lazybeforeunveil', f),
          addEventListener('lazybeforesizes', g, !0),
          addEventListener('lazybeforesizes', f),
          f(),
          removeEventListener('lazybeforeunveil', e);
      };
    addEventListener('lazybeforeunveil', e);
  }
});

/*! lazysizes - v4.1.7 */
!(function(a, b) {
  var c = function() {
    b(a.lazySizes), a.removeEventListener('lazyunveilread', c, !0);
  };
  (b = b.bind(null, a, a.document)),
    'object' == typeof module && module.exports
      ? b(require('lazysizes'))
      : a.lazySizes ? c() : a.addEventListener('lazyunveilread', c, !0);
})(window, function(a, b, c) {
  'use strict';
  if (a.addEventListener) {
    var d = /\s+(\d+)(w|h)\s+(\d+)(w|h)/,
      e = /parent-fit["']*\s*:\s*["']*(contain|cover|width)/,
      f = /parent-container["']*\s*:\s*["']*(.+?)(?=(\s|$|,|'|"|;))/,
      g = /^picture$/i,
      h = function(a) {
        return getComputedStyle(a, null) || {};
      },
      i = {
        getParent: function(b, c) {
          var d = b,
            e = b.parentNode;
          return (
            (c && 'prev' != c) ||
              !e ||
              !g.test(e.nodeName || '') ||
              (e = e.parentNode),
            'self' != c &&
              (d =
                'prev' == c
                  ? b.previousElementSibling
                  : c && (e.closest || a.jQuery)
                    ? (e.closest ? e.closest(c) : jQuery(e).closest(c)[0]) || e
                    : e),
            d
          );
        },
        getFit: function(a) {
          var b,
            c,
            d = h(a),
            g = d.content || d.fontFamily,
            j = {
              fit: a._lazysizesParentFit || a.getAttribute('data-parent-fit'),
            };
          return (
            !j.fit && g && (b = g.match(e)) && (j.fit = b[1]),
            j.fit
              ? ((c =
                  a._lazysizesParentContainer ||
                  a.getAttribute('data-parent-container')),
                !c && g && (b = g.match(f)) && (c = b[1]),
                (j.parent = i.getParent(a, c)))
              : (j.fit = d.objectFit),
            j
          );
        },
        getImageRatio: function(b) {
          var c,
            e,
            f,
            h,
            i,
            j = b.parentNode,
            k =
              j && g.test(j.nodeName || '')
                ? j.querySelectorAll('source, img')
                : [b];
          for (c = 0; c < k.length; c++)
            if (
              ((b = k[c]),
              (e =
                b.getAttribute(lazySizesConfig.srcsetAttr) ||
                b.getAttribute('srcset') ||
                b.getAttribute('data-pfsrcset') ||
                b.getAttribute('data-risrcset') ||
                ''),
              (f = b._lsMedia || b.getAttribute('media')),
              (f =
                lazySizesConfig.customMedia[
                  b.getAttribute('data-media') || f
                ] || f),
              e && (!f || ((a.matchMedia && matchMedia(f)) || {}).matches))
            ) {
              (h = parseFloat(b.getAttribute('data-aspectratio'))),
                !h &&
                  (i = e.match(d)) &&
                  (h = 'w' == i[2] ? i[1] / i[3] : i[3] / i[1]);
              break;
            }
          return h;
        },
        calculateSize: function(a, b) {
          var c,
            d,
            e,
            f,
            g = this.getFit(a),
            h = g.fit,
            i = g.parent;
          return 'width' == h ||
            (('contain' == h || 'cover' == h) && (e = this.getImageRatio(a)))
            ? (i ? (b = i.clientWidth) : (i = a),
              (f = b),
              'width' == h
                ? (f = b)
                : (d = i.clientHeight) > 40 &&
                  (c = b / d) &&
                  (('cover' == h && c < e) || ('contain' == h && c > e)) &&
                  (f = b * (e / c)),
              f)
            : b;
        },
      };
    (c.parentFit = i),
      b.addEventListener('lazybeforesizes', function(a) {
        if (!a.defaultPrevented && a.detail.instance == c) {
          var b = a.target;
          a.detail.width = i.calculateSize(b, a.detail.width);
        }
      });
  }
});

/*! lazysizes - v4.1.7 */
!(function(a, b) {
  var c = function() {
    b(a.lazySizes), a.removeEventListener('lazyunveilread', c, !0);
  };
  (b = b.bind(null, a, a.document)),
    'object' == typeof module && module.exports
      ? b(require('lazysizes'))
      : a.lazySizes ? c() : a.addEventListener('lazyunveilread', c, !0);
})(window, function(a, b, c) {
  'use strict';
  function d(b, c) {
    var d,
      e,
      f,
      g,
      h = a.getComputedStyle(b);
    (e = b.parentNode),
      (g = {isPicture: !(!e || !m.test(e.nodeName || ''))}),
      (f = function(a, c) {
        var d = b.getAttribute('data-' + a);
        if (!d) {
          var e = h.getPropertyValue('--ls-' + a);
          e && (d = e.trim());
        }
        if (d) {
          if ('true' == d) d = !0;
          else if ('false' == d) d = !1;
          else if (l.test(d)) d = parseFloat(d);
          else if ('function' == typeof j[a]) d = j[a](b, d);
          else if (q.test(d))
            try {
              d = JSON.parse(d);
            } catch (a) {}
          g[a] = d;
        } else
          a in j && 'function' != typeof j[a]
            ? (g[a] = j[a])
            : c && 'function' == typeof j[a] && (g[a] = j[a](b, d));
      });
    for (d in j) f(d);
    return (
      c.replace(p, function(a, b) {
        b in g || f(b, !0);
      }),
      g
    );
  }
  function e(a, b) {
    var c = [],
      d = function(a, c) {
        return k[typeof b[c]] ? b[c] : a;
      };
    return (
      (c.srcset = []),
      b.absUrl && (s.setAttribute('href', a), (a = s.href)),
      (a = ((b.prefix || '') + a + (b.postfix || '')).replace(p, d)),
      b.widths.forEach(function(d) {
        var e = b.widthmap[d] || d,
          f = b.aspectratio || b.ratio,
          g = !b.aspectratio && j.traditionalRatio,
          h = {
            u: a
              .replace(n, e)
              .replace(o, f ? (g ? Math.round(d * f) : Math.round(d / f)) : ''),
            w: d,
          };
        c.push(h), c.srcset.push((h.c = h.u + ' ' + d + 'w'));
      }),
      c
    );
  }
  function f(a, c, d) {
    var f = 0,
      g = 0,
      h = d;
    if (a) {
      if ('container' === c.ratio) {
        for (f = h.scrollWidth, g = h.scrollHeight; !((f && g) || h === b); )
          (h = h.parentNode), (f = h.scrollWidth), (g = h.scrollHeight);
        f && g && (c.ratio = g / f);
      }
      (a = e(a, c)),
        (a.isPicture = c.isPicture),
        u && 'IMG' == d.nodeName.toUpperCase()
          ? d.removeAttribute(i.srcsetAttr)
          : d.setAttribute(i.srcsetAttr, a.srcset.join(', ')),
        Object.defineProperty(d, '_lazyrias', {value: a, writable: !0});
    }
  }
  function g(a, b) {
    var e = d(a, b);
    return (
      j.modifyOptions.call(a, {target: a, details: e, detail: e}),
      c.fire(a, 'lazyriasmodifyoptions', e),
      e
    );
  }
  function h(a) {
    return (
      a.getAttribute(a.getAttribute('data-srcattr') || j.srcAttr) ||
      a.getAttribute(i.srcsetAttr) ||
      a.getAttribute(i.srcAttr) ||
      a.getAttribute('data-pfsrcset') ||
      ''
    );
  }
  var i,
    j,
    k = {string: 1, number: 1},
    l = /^\-*\+*\d+\.*\d*$/,
    m = /^picture$/i,
    n = /\s*\{\s*width\s*\}\s*/i,
    o = /\s*\{\s*height\s*\}\s*/i,
    p = /\s*\{\s*([a-z0-9]+)\s*\}\s*/gi,
    q = /^\[.*\]|\{.*\}$/,
    r = /^(?:auto|\d+(px)?)$/,
    s = b.createElement('a'),
    t = b.createElement('img'),
    u = 'srcset' in t && !('sizes' in t),
    v = !!a.HTMLPictureElement && !u;
  !(function() {
    var b,
      d = function() {},
      e = {
        prefix: '',
        postfix: '',
        srcAttr: 'data-src',
        absUrl: !1,
        modifyOptions: d,
        widthmap: {},
        ratio: !1,
        traditionalRatio: !1,
        aspectratio: !1,
      };
    (i = (c && c.cfg) || a.lazySizesConfig),
      i || ((i = {}), (a.lazySizesConfig = i)),
      i.supportsType ||
        (i.supportsType = function(a) {
          return !a;
        }),
      i.rias || (i.rias = {}),
      'widths' in (j = i.rias) ||
        ((j.widths = []),
        (function(a) {
          for (var b, c = 0; !b || b < 3e3; )
            (c += 5), c > 30 && (c += 1), (b = 36 * c), a.push(b);
        })(j.widths));
    for (b in e) b in j || (j[b] = e[b]);
  })(),
    addEventListener(
      'lazybeforesizes',
      function(a) {
        if (a.detail.instance == c) {
          var b, d, e, k, l, m, o, p, q, s, t, u, x;
          if (
            ((b = a.target),
            a.detail.dataAttr &&
              !a.defaultPrevented &&
              !j.disabled &&
              (q = b.getAttribute(i.sizesAttr) || b.getAttribute('sizes')) &&
              r.test(q))
          ) {
            if (
              ((d = h(b)),
              (e = g(b, d)),
              (t = n.test(e.prefix) || n.test(e.postfix)),
              e.isPicture && (k = b.parentNode))
            )
              for (
                l = k.getElementsByTagName('source'), m = 0, o = l.length;
                m < o;
                m++
              )
                (t || n.test((p = h(l[m])))) && (f(p, e, l[m]), (u = !0));
            t || n.test(d)
              ? (f(d, e, b), (u = !0))
              : u &&
                ((x = []),
                (x.srcset = []),
                (x.isPicture = !0),
                Object.defineProperty(b, '_lazyrias', {
                  value: x,
                  writable: !0,
                })),
              u &&
                (v
                  ? b.removeAttribute(i.srcAttr)
                  : 'auto' != q &&
                    ((s = {width: parseInt(q, 10)}),
                    w({target: b, detail: s})));
          }
        }
      },
      !0
    );
  var w = (function() {
    var d = function(a, b) {
        return a.w - b.w;
      },
      e = function(a) {
        var b,
          c,
          d = a.length,
          e = a[d - 1],
          f = 0;
        for (f; f < d; f++)
          if (((e = a[f]), (e.d = e.w / a.w), e.d >= a.d)) {
            !e.cached &&
              (b = a[f - 1]) &&
              b.d > a.d - 0.13 * Math.pow(a.d, 2.2) &&
              ((c = Math.pow(b.d - 0.6, 1.6)),
              b.cached && (b.d += 0.15 * c),
              b.d + (e.d - a.d) * c > a.d && (e = b));
            break;
          }
        return e;
      },
      f = function(a, b) {
        var d;
        return (
          !a._lazyrias &&
            c.pWS &&
            (d = c.pWS(a.getAttribute(i.srcsetAttr || ''))).length &&
            (Object.defineProperty(a, '_lazyrias', {value: d, writable: !0}),
            b &&
              a.parentNode &&
              (d.isPicture = 'PICTURE' == a.parentNode.nodeName.toUpperCase())),
          a._lazyrias
        );
      },
      g = function(b) {
        var d = a.devicePixelRatio || 1,
          e = c.getX && c.getX(b);
        return Math.min(e || d, 2.4, d);
      },
      h = function(b, c) {
        var h, i, j, k, l, m;
        if (((l = b._lazyrias), l.isPicture && a.matchMedia))
          for (
            i = 0,
              h = b.parentNode.getElementsByTagName('source'),
              j = h.length;
            i < j;
            i++
          )
            if (
              f(h[i]) &&
              !h[i].getAttribute('type') &&
              (!(k = h[i].getAttribute('media')) ||
                (matchMedia(k) || {}).matches)
            ) {
              l = h[i]._lazyrias;
              break;
            }
        return (
          (!l.w || l.w < c) && ((l.w = c), (l.d = g(b)), (m = e(l.sort(d)))), m
        );
      },
      j = function(d) {
        if (d.detail.instance == c) {
          var e,
            g = d.target;
          if (!u && (a.respimage || a.picturefill || lazySizesConfig.pf))
            return void b.removeEventListener('lazybeforesizes', j);
          ('_lazyrias' in g || (d.detail.dataAttr && f(g, !0))) &&
            (e = h(g, d.detail.width)) &&
            e.u &&
            g._lazyrias.cur != e.u &&
            ((g._lazyrias.cur = e.u),
            (e.cached = !0),
            c.rAF(function() {
              g.setAttribute(i.srcAttr, e.u), g.setAttribute('src', e.u);
            }));
        }
      };
    return v ? (j = function() {}) : addEventListener('lazybeforesizes', j), j;
  })();
});

/*! lazysizes - v4.1.7 */
!(function(a, b) {
  var c = function() {
    b(a.lazySizes), a.removeEventListener('lazyunveilread', c, !0);
  };
  (b = b.bind(null, a, a.document)),
    'object' == typeof module && module.exports
      ? b(require('lazysizes'))
      : a.lazySizes ? c() : a.addEventListener('lazyunveilread', c, !0);
})(window, function(a, b, c) {
  'use strict';
  function d(c, d) {
    var e = 'vimeoCallback' + j,
      f = b.createElement('script');
    (c += '&callback=' + e),
      j++,
      (a[e] = function(b) {
        f.parentNode.removeChild(f), delete a[e], d(b);
      }),
      (f.src = c),
      b.head.appendChild(f);
  }
  function e(a, b) {
    d(o.replace(k, a), function(a) {
      a &&
        a.thumbnail_url &&
        (b.style.backgroundImage = 'url(' + a.thumbnail_url + ')');
    }),
      b.addEventListener('click', f);
  }
  function f(a) {
    var b = a.currentTarget,
      c = b.getAttribute('data-vimeo'),
      d = b.getAttribute('data-vimeoparams') || '';
    d && !l.test(d) && (d = '&' + d),
      a.preventDefault(),
      (b.innerHTML =
        '<iframe src="' +
        p.replace(k, c) +
        d +
        '" frameborder="0" allowfullscreen="" width="640" height="390"></iframe>'),
      b.removeEventListener('click', f);
  }
  function g(a, b) {
    (b.style.backgroundImage = 'url(' + m.replace(k, a) + ')'),
      b.addEventListener('click', h);
  }
  function h(a) {
    var b = a.currentTarget,
      c = b.getAttribute('data-youtube'),
      d = b.getAttribute('data-ytparams') || '';
    d && !l.test(d) && (d = '&' + d),
      a.preventDefault(),
      (b.innerHTML =
        '<iframe src="' +
        n.replace(k, c) +
        d +
        '" frameborder="0" allowfullscreen="" width="640" height="390"></iframe>'),
      b.removeEventListener('click', h);
  }
  if (b.getElementsByClassName) {
    var i = 'https:' == location.protocol ? 'https:' : 'http:',
      j = Date.now(),
      k = /\{\{id}}/,
      l = /^&/,
      m = i + '//img.youtube.com/vi/{{id}}/sddefault.jpg',
      n = i + '//www.youtube.com/embed/{{id}}?autoplay=1',
      o = i + '//vimeo.com/api/oembed.json?url=https%3A//vimeo.com/{{id}}',
      p = i + '//player.vimeo.com/video/{{id}}?autoplay=1';
    b.addEventListener('lazybeforeunveil', function(a) {
      if (a.detail.instance == c) {
        var b = a.target,
          d = b.getAttribute('data-youtube'),
          f = b.getAttribute('data-vimeo');
        d && b && g(d, b), f && b && e(f, b);
      }
    });
  }
});

/*! lazysizes - v4.1.7 */
(function (window, factory) {
  var lazySizes = factory(window, window.document);
  window.lazySizes = lazySizes;
  if (typeof module == 'object' && module.exports) {
    module.exports = lazySizes;
  }
}(window, function l(window, document) {
  'use strict';
  /*jshint eqnull:true */
  if (!document.getElementsByClassName) { return; }

  var lazysizes, lazySizesConfig;

  var docElem = document.documentElement;

  var Date = window.Date;

  var supportPicture = window.HTMLPictureElement;

  var _addEventListener = 'addEventListener';

  var _getAttribute = 'getAttribute';

  var addEventListener = window[_addEventListener];

  var setTimeout = window.setTimeout;

  var requestAnimationFrame = window.requestAnimationFrame || setTimeout;

  var requestIdleCallback = window.requestIdleCallback;

  var regPicture = /^picture$/i;

  var loadEvents = ['load', 'error', 'lazyincluded', '_lazyloaded'];

  var regClassCache = {};

  var forEach = Array.prototype.forEach;

  var hasClass = function (ele, cls) {
    if (!regClassCache[cls]) {
      regClassCache[cls] = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    }
    return regClassCache[cls].test(ele[_getAttribute]('class') || '') && regClassCache[cls];
  };

  var addClass = function (ele, cls) {
    if (!hasClass(ele, cls)) {
      ele.setAttribute('class', (ele[_getAttribute]('class') || '').trim() + ' ' + cls);
    }
  };

  var removeClass = function (ele, cls) {
    var reg;
    if ((reg = hasClass(ele, cls))) {
      ele.setAttribute('class', (ele[_getAttribute]('class') || '').replace(reg, ' '));
    }
  };

  var addRemoveLoadEvents = function (dom, fn, add) {
    var action = add ? _addEventListener : 'removeEventListener';
    if (add) {
      addRemoveLoadEvents(dom, fn);
    }
    loadEvents.forEach(function (evt) {
      dom[action](evt, fn);
    });
  };

  var triggerEvent = function (elem, name, detail, noBubbles, noCancelable) {
    var event = document.createEvent('Event');

    if (!detail) {
      detail = {};
    }

    detail.instance = lazysizes;

    event.initEvent(name, !noBubbles, !noCancelable);

    event.detail = detail;

    elem.dispatchEvent(event);
    return event;
  };

  var updatePolyfill = function (el, full) {
    var polyfill;
    if (!supportPicture && (polyfill = (window.picturefill || lazySizesConfig.pf))) {
      if (full && full.src && !el[_getAttribute]('srcset')) {
        el.setAttribute('srcset', full.src);
      }
      polyfill({ reevaluate: true, elements: [el] });
    } else if (full && full.src) {
      el.src = full.src;
    }
  };

  var getCSS = function (elem, style) {
    return (getComputedStyle(elem, null) || {})[style];
  };

  var getWidth = function (elem, parent, width) {
    width = width || elem.offsetWidth;

    while (width < lazySizesConfig.minSize && parent && !elem._lazysizesWidth) {
      width = parent.offsetWidth;
      parent = parent.parentNode;
    }

    return width;
  };

  var rAF = (function () {
    var running, waiting;
    var firstFns = [];
    var secondFns = [];
    var fns = firstFns;

    var run = function () {
      var runFns = fns;

      fns = firstFns.length ? secondFns : firstFns;

      running = true;
      waiting = false;

      while (runFns.length) {
        runFns.shift()();
      }

      running = false;
    };

    var rafBatch = function (fn, queue) {
      if (running && !queue) {
        fn.apply(this, arguments);
      } else {
        fns.push(fn);

        if (!waiting) {
          waiting = true;
          (document.hidden ? setTimeout : requestAnimationFrame)(run);
        }
      }
    };

    rafBatch._lsFlush = run;

    return rafBatch;
  })();

  var rAFIt = function (fn, simple) {
    return simple ?
      function () {
        rAF(fn);
      } :
      function () {
        var that = this;
        var args = arguments;
        rAF(function () {
          fn.apply(that, args);
        });
      }
      ;
  };

  var throttle = function (fn) {
    var running;
    var lastTime = 0;
    var gDelay = lazySizesConfig.throttleDelay;
    var rICTimeout = lazySizesConfig.ricTimeout;
    var run = function () {
      running = false;
      lastTime = Date.now();
      fn();
    };
    var idleCallback = requestIdleCallback && rICTimeout > 49 ?
      function () {
        requestIdleCallback(run, { timeout: rICTimeout });

        if (rICTimeout !== lazySizesConfig.ricTimeout) {
          rICTimeout = lazySizesConfig.ricTimeout;
        }
      } :
      rAFIt(function () {
        setTimeout(run);
      }, true)
      ;

    return function (isPriority) {
      var delay;

      if ((isPriority = isPriority === true)) {
        rICTimeout = 33;
      }

      if (running) {
        return;
      }

      running = true;

      delay = gDelay - (Date.now() - lastTime);

      if (delay < 0) {
        delay = 0;
      }

      if (isPriority || delay < 9) {
        idleCallback();
      } else {
        setTimeout(idleCallback, delay);
      }
    };
  };

  //based on http://modernjavascript.blogspot.de/2013/08/building-better-debounce.html
  var debounce = function (func) {
    var timeout, timestamp;
    var wait = 99;
    var run = function () {
      timeout = null;
      func();
    };
    var later = function () {
      var last = Date.now() - timestamp;

      if (last < wait) {
        setTimeout(later, wait - last);
      } else {
        (requestIdleCallback || run)(run);
      }
    };

    return function () {
      timestamp = Date.now();

      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
    };
  };

  (function () {
    var prop;

    var lazySizesDefaults = {
      lazyClass: 'lazyload',
      loadedClass: 'lazyloaded',
      loadingClass: 'lazyloading',
      preloadClass: 'lazypreload',
      errorClass: 'lazyerror',
      //strictClass: 'lazystrict',
      autosizesClass: 'lazyautosizes',
      srcAttr: 'data-src',
      srcsetAttr: 'data-srcset',
      sizesAttr: 'data-sizes',
      //preloadAfterLoad: false,
      minSize: 40,
      customMedia: {},
      init: true,
      expFactor: 1.5,
      hFac: 0.8,
      loadMode: 2,
      loadHidden: true,
      ricTimeout: 0,
      throttleDelay: 125,
    };

    lazySizesConfig = window.lazySizesConfig || window.lazysizesConfig || {};

    for (prop in lazySizesDefaults) {
      if (!(prop in lazySizesConfig)) {
        lazySizesConfig[prop] = lazySizesDefaults[prop];
      }
    }

    window.lazySizesConfig = lazySizesConfig;

    setTimeout(function () {
      if (lazySizesConfig.init) {
        init();
      }
    });
  })();

  var loader = (function () {
    var preloadElems, isCompleted, resetPreloadingTimer, loadMode, started;

    var eLvW, elvH, eLtop, eLleft, eLright, eLbottom, isBodyHidden;

    var regImg = /^img$/i;
    var regIframe = /^iframe$/i;

    var supportScroll = ('onscroll' in window) && !(/(gle|ing)bot/.test(navigator.userAgent));

    var shrinkExpand = 0;
    var currentExpand = 0;

    var isLoading = 0;
    var lowRuns = -1;

    var resetPreloading = function (e) {
      isLoading--;
      if (!e || isLoading < 0 || !e.target) {
        isLoading = 0;
      }
    };

    var isVisible = function (elem) {
      if (isBodyHidden == null) {
        isBodyHidden = getCSS(document.body, 'visibility') == 'hidden';
      }

      return isBodyHidden || (getCSS(elem.parentNode, 'visibility') != 'hidden' && getCSS(elem, 'visibility') != 'hidden');
    };

    var isNestedVisible = function (elem, elemExpand) {
      var outerRect;
      var parent = elem;
      var visible = isVisible(elem);

      eLtop -= elemExpand;
      eLbottom += elemExpand;
      eLleft -= elemExpand;
      eLright += elemExpand;

      while (visible && (parent = parent.offsetParent) && parent != document.body && parent != docElem) {
        visible = ((getCSS(parent, 'opacity') || 1) > 0);

        if (visible && getCSS(parent, 'overflow') != 'visible') {
          outerRect = parent.getBoundingClientRect();
          visible = eLright > outerRect.left &&
            eLleft < outerRect.right &&
            eLbottom > outerRect.top - 1 &&
            eLtop < outerRect.bottom + 1
            ;
        }
      }

      return visible;
    };

    var checkElements = function () {
      var eLlen, i, rect, autoLoadElem, loadedSomething, elemExpand, elemNegativeExpand, elemExpandVal,
        beforeExpandVal, defaultExpand, preloadExpand, hFac;
      var lazyloadElems = lazysizes.elements;

      if ((loadMode = lazySizesConfig.loadMode) && isLoading < 8 && (eLlen = lazyloadElems.length)) {

        i = 0;

        lowRuns++;

        defaultExpand = (!lazySizesConfig.expand || lazySizesConfig.expand < 1) ?
          docElem.clientHeight > 500 && docElem.clientWidth > 500 ? 500 : 370 :
          lazySizesConfig.expand;

        lazysizes._defEx = defaultExpand;

        preloadExpand = defaultExpand * lazySizesConfig.expFactor;
        hFac = lazySizesConfig.hFac;
        isBodyHidden = null;

        if (currentExpand < preloadExpand && isLoading < 1 && lowRuns > 2 && loadMode > 2 && !document.hidden) {
          currentExpand = preloadExpand;
          lowRuns = 0;
        } else if (loadMode > 1 && lowRuns > 1 && isLoading < 6) {
          currentExpand = defaultExpand;
        } else {
          currentExpand = shrinkExpand;
        }

        for (; i < eLlen; i++) {

          if (!lazyloadElems[i] || lazyloadElems[i]._lazyRace) { continue; }

          if (!supportScroll) { unveilElement(lazyloadElems[i]); continue; }

          if (!(elemExpandVal = lazyloadElems[i][_getAttribute]('data-expand')) || !(elemExpand = elemExpandVal * 1)) {
            elemExpand = currentExpand;
          }

          if (beforeExpandVal !== elemExpand) {
            eLvW = innerWidth + (elemExpand * hFac);
            elvH = innerHeight + elemExpand;
            elemNegativeExpand = elemExpand * -1;
            beforeExpandVal = elemExpand;
          }

          rect = lazyloadElems[i].getBoundingClientRect();

          if ((eLbottom = rect.bottom) >= elemNegativeExpand &&
            (eLtop = rect.top) <= elvH &&
            (eLright = rect.right) >= elemNegativeExpand * hFac &&
            (eLleft = rect.left) <= eLvW &&
            (eLbottom || eLright || eLleft || eLtop) &&
            (lazySizesConfig.loadHidden || isVisible(lazyloadElems[i])) &&
            ((isCompleted && isLoading < 3 && !elemExpandVal && (loadMode < 3 || lowRuns < 4)) || isNestedVisible(lazyloadElems[i], elemExpand))) {
            unveilElement(lazyloadElems[i]);
            loadedSomething = true;
            if (isLoading > 9) { break; }
          } else if (!loadedSomething && isCompleted && !autoLoadElem &&
            isLoading < 4 && lowRuns < 4 && loadMode > 2 &&
            (preloadElems[0] || lazySizesConfig.preloadAfterLoad) &&
            (preloadElems[0] || (!elemExpandVal && ((eLbottom || eLright || eLleft || eLtop) || lazyloadElems[i][_getAttribute](lazySizesConfig.sizesAttr) != 'auto')))) {
            autoLoadElem = preloadElems[0] || lazyloadElems[i];
          }
        }

        if (autoLoadElem && !loadedSomething) {
          unveilElement(autoLoadElem);
        }
      }
    };

    var throttledCheckElements = throttle(checkElements);

    var switchLoadingClass = function (e) {
      var elem = e.target;

      if (elem._lazyCache) {
        delete elem._lazyCache;
        return;
      }

      resetPreloading(e);
      addClass(elem, lazySizesConfig.loadedClass);
      removeClass(elem, lazySizesConfig.loadingClass);
      addRemoveLoadEvents(elem, rafSwitchLoadingClass);
      triggerEvent(elem, 'lazyloaded');
    };
    var rafedSwitchLoadingClass = rAFIt(switchLoadingClass);
    var rafSwitchLoadingClass = function (e) {
      rafedSwitchLoadingClass({ target: e.target });
    };

    var changeIframeSrc = function (elem, src) {
      try {
        elem.contentWindow.location.replace(src);
      } catch (e) {
        elem.src = src;
      }
    };

    var handleSources = function (source) {
      var customMedia;

      var sourceSrcset = source[_getAttribute](lazySizesConfig.srcsetAttr);

      if ((customMedia = lazySizesConfig.customMedia[source[_getAttribute]('data-media') || source[_getAttribute]('media')])) {
        source.setAttribute('media', customMedia);
      }

      if (sourceSrcset) {
        source.setAttribute('srcset', sourceSrcset);
      }
    };

    var lazyUnveil = rAFIt(function (elem, detail, isAuto, sizes, isImg) {
      var src, srcset, parent, isPicture, event, firesLoad;

      if (!(event = triggerEvent(elem, 'lazybeforeunveil', detail)).defaultPrevented) {

        if (sizes) {
          if (isAuto) {
            addClass(elem, lazySizesConfig.autosizesClass);
          } else {
            elem.setAttribute('sizes', sizes);
          }
        }

        srcset = elem[_getAttribute](lazySizesConfig.srcsetAttr);
        src = elem[_getAttribute](lazySizesConfig.srcAttr);

        if (isImg) {
          parent = elem.parentNode;
          isPicture = parent && regPicture.test(parent.nodeName || '');
        }

        firesLoad = detail.firesLoad || (('src' in elem) && (srcset || src || isPicture));

        event = { target: elem };

        addClass(elem, lazySizesConfig.loadingClass);

        if (firesLoad) {
          clearTimeout(resetPreloadingTimer);
          resetPreloadingTimer = setTimeout(resetPreloading, 2500);
          addRemoveLoadEvents(elem, rafSwitchLoadingClass, true);
        }

        if (isPicture) {
          forEach.call(parent.getElementsByTagName('source'), handleSources);
        }

        if (srcset) {
          elem.setAttribute('srcset', srcset);
        } else if (src && !isPicture) {
          if (regIframe.test(elem.nodeName)) {
            changeIframeSrc(elem, src);
          } else {
            elem.src = src;
          }
        }

        if (isImg && (srcset || isPicture)) {
          updatePolyfill(elem, { src: src });
        }
      }

      if (elem._lazyRace) {
        delete elem._lazyRace;
      }
      removeClass(elem, lazySizesConfig.lazyClass);

      rAF(function () {
        // Part of this can be removed as soon as this fix is older: https://bugs.chromium.org/p/chromium/issues/detail?id=7731 (2015)
        if (!firesLoad || (elem.complete && elem.naturalWidth > 1)) {
          switchLoadingClass(event);
          elem._lazyCache = true;
          setTimeout(function () {
            if ('_lazyCache' in elem) {
              delete elem._lazyCache;
            }
          }, 9);
        }
      }, true);
    });

    var unveilElement = function (elem) {
      var detail;

      var isImg = regImg.test(elem.nodeName);

      //allow using sizes="auto", but don't use. it's invalid. Use data-sizes="auto" or a valid value for sizes instead (i.e.: sizes="80vw")
      var sizes = isImg && (elem[_getAttribute](lazySizesConfig.sizesAttr) || elem[_getAttribute]('sizes'));
      var isAuto = sizes == 'auto';

      if ((isAuto || !isCompleted) && isImg && (elem[_getAttribute]('src') || elem.srcset) && !elem.complete && !hasClass(elem, lazySizesConfig.errorClass) && hasClass(elem, lazySizesConfig.lazyClass)) { return; }

      detail = triggerEvent(elem, 'lazyunveilread').detail;

      if (isAuto) {
        autoSizer.updateElem(elem, true, elem.offsetWidth);
      }

      elem._lazyRace = true;
      isLoading++;

      lazyUnveil(elem, detail, isAuto, sizes, isImg);
    };

    var onload = function () {
      if (isCompleted) { return; }
      if (Date.now() - started < 999) {
        setTimeout(onload, 999);
        return;
      }
      var afterScroll = debounce(function () {
        lazySizesConfig.loadMode = 3;
        throttledCheckElements();
      });

      isCompleted = true;

      lazySizesConfig.loadMode = 3;

      throttledCheckElements();

      addEventListener('scroll', function () {
        if (lazySizesConfig.loadMode == 3) {
          lazySizesConfig.loadMode = 2;
        }
        afterScroll();
      }, true);
    };

    return {
      _: function () {
        started = Date.now();

        lazysizes.elements = document.getElementsByClassName(lazySizesConfig.lazyClass);
        preloadElems = document.getElementsByClassName(lazySizesConfig.lazyClass + ' ' + lazySizesConfig.preloadClass);

        addEventListener('scroll', throttledCheckElements, true);

        addEventListener('resize', throttledCheckElements, true);

        if (window.MutationObserver) {
          new MutationObserver(throttledCheckElements).observe(docElem, { childList: true, subtree: true, attributes: true });
        } else {
          docElem[_addEventListener]('DOMNodeInserted', throttledCheckElements, true);
          docElem[_addEventListener]('DOMAttrModified', throttledCheckElements, true);
          setInterval(throttledCheckElements, 999);
        }

        addEventListener('hashchange', throttledCheckElements, true);

        //, 'fullscreenchange'
        ['focus', 'mouseover', 'click', 'load', 'transitionend', 'animationend', 'webkitAnimationEnd'].forEach(function (name) {
          document[_addEventListener](name, throttledCheckElements, true);
        });

        if ((/d$|^c/.test(document.readyState))) {
          onload();
        } else {
          addEventListener('load', onload);
          document[_addEventListener]('DOMContentLoaded', throttledCheckElements);
          setTimeout(onload, 20000);
        }

        if (lazysizes.elements.length) {
          checkElements();
          rAF._lsFlush();
        } else {
          throttledCheckElements();
        }
      },
      checkElems: throttledCheckElements,
      unveil: unveilElement
    };
  })();


  var autoSizer = (function () {
    var autosizesElems;

    var sizeElement = rAFIt(function (elem, parent, event, width) {
      var sources, i, len;
      elem._lazysizesWidth = width;
      width += 'px';

      elem.setAttribute('sizes', width);

      if (regPicture.test(parent.nodeName || '')) {
        sources = parent.getElementsByTagName('source');
        for (i = 0, len = sources.length; i < len; i++) {
          sources[i].setAttribute('sizes', width);
        }
      }

      if (!event.detail.dataAttr) {
        updatePolyfill(elem, event.detail);
      }
    });
    var getSizeElement = function (elem, dataAttr, width) {
      var event;
      var parent = elem.parentNode;

      if (parent) {
        width = getWidth(elem, parent, width);
        event = triggerEvent(elem, 'lazybeforesizes', { width: width, dataAttr: !!dataAttr });

        if (!event.defaultPrevented) {
          width = event.detail.width;

          if (width && width !== elem._lazysizesWidth) {
            sizeElement(elem, parent, event, width);
          }
        }
      }
    };

    var updateElementsSizes = function () {
      var i;
      var len = autosizesElems.length;
      if (len) {
        i = 0;

        for (; i < len; i++) {
          getSizeElement(autosizesElems[i]);
        }
      }
    };

    var debouncedUpdateElementsSizes = debounce(updateElementsSizes);

    return {
      _: function () {
        autosizesElems = document.getElementsByClassName(lazySizesConfig.autosizesClass);
        addEventListener('resize', debouncedUpdateElementsSizes);
      },
      checkElems: debouncedUpdateElementsSizes,
      updateElem: getSizeElement
    };
  })();

  var init = function () {
    if (!init.i) {
      init.i = true;
      autoSizer._();
      loader._();
    }
  };

  lazysizes = {
    cfg: lazySizesConfig,
    autoSizer: autoSizer,
    loader: loader,
    init: init,
    uP: updatePolyfill,
    aC: addClass,
    rC: removeClass,
    hC: hasClass,
    fire: triggerEvent,
    gW: getWidth,
    rAF: rAF,
  };

  return lazysizes;
}
));
