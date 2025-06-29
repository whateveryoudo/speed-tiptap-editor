import {
  message_default,
  theme_default
} from "./chunk-HR5SS22I.js";
import "./chunk-5SOETNNC.js";
import "./chunk-2RBTTVNF.js";
import "./chunk-TP4WBCF5.js";
import {
  computed,
  inject,
  reactive,
  ref,
  unref,
  watch
} from "./chunk-5U2WJACE.js";
import "./chunk-G3PMV62Z.js";

// node_modules/.pnpm/speed-components-ui@0.1.7_@algolia+client-search@5.27.0_@types+node@20.19.0_async-validator@4_kp6trh6huafdv2oectky5v535i/node_modules/speed-components-ui/dist/useAntdCssVars-BcHnHhl9.mjs
var xt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Fi(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var Yi = { exports: {} };
(function(t, e) {
  (function(i, n) {
    t.exports = n();
  })(xt, function() {
    var i = 1e3, n = 6e4, r = 36e5, a = "millisecond", s = "second", u = "minute", o = "hour", f = "day", c = "week", l = "month", d = "quarter", b = "year", h = "date", E = "Invalid Date", g = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, m = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, _ = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(T) {
      var v = ["th", "st", "nd", "rd"], w = T % 100;
      return "[" + T + (v[(w - 20) % 10] || v[w] || v[0]) + "]";
    } }, S = function(T, v, w) {
      var D = String(T);
      return !D || D.length >= v ? T : "" + Array(v + 1 - D.length).join(w) + T;
    }, P = { s: S, z: function(T) {
      var v = -T.utcOffset(), w = Math.abs(v), D = Math.floor(w / 60), y = w % 60;
      return (v <= 0 ? "+" : "-") + S(D, 2, "0") + ":" + S(y, 2, "0");
    }, m: function T(v, w) {
      if (v.date() < w.date()) return -T(w, v);
      var D = 12 * (w.year() - v.year()) + (w.month() - v.month()), y = v.clone().add(D, l), O = w - y < 0, x = v.clone().add(D + (O ? -1 : 1), l);
      return +(-(D + (w - y) / (O ? y - x : x - y)) || 0);
    }, a: function(T) {
      return T < 0 ? Math.ceil(T) || 0 : Math.floor(T);
    }, p: function(T) {
      return { M: l, y: b, w: c, d: f, D: h, h: o, m: u, s, ms: a, Q: d }[T] || String(T || "").toLowerCase().replace(/s$/, "");
    }, u: function(T) {
      return T === void 0;
    } }, N = "en", F = {};
    F[N] = _;
    var X = "$isDayjsObject", W = function(T) {
      return T instanceof I || !(!T || !T[X]);
    }, R = function T(v, w, D) {
      var y;
      if (!v) return N;
      if (typeof v == "string") {
        var O = v.toLowerCase();
        F[O] && (y = O), w && (F[O] = w, y = O);
        var x = v.split("-");
        if (!y && x.length > 1) return T(x[0]);
      } else {
        var $ = v.name;
        F[$] = v, y = $;
      }
      return !D && y && (N = y), y || !D && N;
    }, A = function(T, v) {
      if (W(T)) return T.clone();
      var w = typeof v == "object" ? v : {};
      return w.date = T, w.args = arguments, new I(w);
    }, p = P;
    p.l = R, p.i = W, p.w = function(T, v) {
      return A(T, { locale: v.$L, utc: v.$u, x: v.$x, $offset: v.$offset });
    };
    var I = function() {
      function T(w) {
        this.$L = R(w.locale, null, true), this.parse(w), this.$x = this.$x || w.x || {}, this[X] = true;
      }
      var v = T.prototype;
      return v.parse = function(w) {
        this.$d = function(D) {
          var y = D.date, O = D.utc;
          if (y === null) return /* @__PURE__ */ new Date(NaN);
          if (p.u(y)) return /* @__PURE__ */ new Date();
          if (y instanceof Date) return new Date(y);
          if (typeof y == "string" && !/Z$/i.test(y)) {
            var x = y.match(g);
            if (x) {
              var $ = x[2] - 1 || 0, U = (x[7] || "0").substring(0, 3);
              return O ? new Date(Date.UTC(x[1], $, x[3] || 1, x[4] || 0, x[5] || 0, x[6] || 0, U)) : new Date(x[1], $, x[3] || 1, x[4] || 0, x[5] || 0, x[6] || 0, U);
            }
          }
          return new Date(y);
        }(w), this.init();
      }, v.init = function() {
        var w = this.$d;
        this.$y = w.getFullYear(), this.$M = w.getMonth(), this.$D = w.getDate(), this.$W = w.getDay(), this.$H = w.getHours(), this.$m = w.getMinutes(), this.$s = w.getSeconds(), this.$ms = w.getMilliseconds();
      }, v.$utils = function() {
        return p;
      }, v.isValid = function() {
        return this.$d.toString() !== E;
      }, v.isSame = function(w, D) {
        var y = A(w);
        return this.startOf(D) <= y && y <= this.endOf(D);
      }, v.isAfter = function(w, D) {
        return A(w) < this.startOf(D);
      }, v.isBefore = function(w, D) {
        return this.endOf(D) < A(w);
      }, v.$g = function(w, D, y) {
        return p.u(w) ? this[D] : this.set(y, w);
      }, v.unix = function() {
        return Math.floor(this.valueOf() / 1e3);
      }, v.valueOf = function() {
        return this.$d.getTime();
      }, v.startOf = function(w, D) {
        var y = this, O = !!p.u(D) || D, x = p.p(w), $ = function(oe, J) {
          var ie = p.w(y.$u ? Date.UTC(y.$y, J, oe) : new Date(y.$y, J, oe), y);
          return O ? ie : ie.endOf(f);
        }, U = function(oe, J) {
          return p.w(y.toDate()[oe].apply(y.toDate("s"), (O ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(J)), y);
        }, q = this.$W, Z = this.$M, ee = this.$D, me = "set" + (this.$u ? "UTC" : "");
        switch (x) {
          case b:
            return O ? $(1, 0) : $(31, 11);
          case l:
            return O ? $(1, Z) : $(0, Z + 1);
          case c:
            var le = this.$locale().weekStart || 0, be = (q < le ? q + 7 : q) - le;
            return $(O ? ee - be : ee + (6 - be), Z);
          case f:
          case h:
            return U(me + "Hours", 0);
          case o:
            return U(me + "Minutes", 1);
          case u:
            return U(me + "Seconds", 2);
          case s:
            return U(me + "Milliseconds", 3);
          default:
            return this.clone();
        }
      }, v.endOf = function(w) {
        return this.startOf(w, false);
      }, v.$set = function(w, D) {
        var y, O = p.p(w), x = "set" + (this.$u ? "UTC" : ""), $ = (y = {}, y[f] = x + "Date", y[h] = x + "Date", y[l] = x + "Month", y[b] = x + "FullYear", y[o] = x + "Hours", y[u] = x + "Minutes", y[s] = x + "Seconds", y[a] = x + "Milliseconds", y)[O], U = O === f ? this.$D + (D - this.$W) : D;
        if (O === l || O === b) {
          var q = this.clone().set(h, 1);
          q.$d[$](U), q.init(), this.$d = q.set(h, Math.min(this.$D, q.daysInMonth())).$d;
        } else $ && this.$d[$](U);
        return this.init(), this;
      }, v.set = function(w, D) {
        return this.clone().$set(w, D);
      }, v.get = function(w) {
        return this[p.p(w)]();
      }, v.add = function(w, D) {
        var y, O = this;
        w = Number(w);
        var x = p.p(D), $ = function(Z) {
          var ee = A(O);
          return p.w(ee.date(ee.date() + Math.round(Z * w)), O);
        };
        if (x === l) return this.set(l, this.$M + w);
        if (x === b) return this.set(b, this.$y + w);
        if (x === f) return $(1);
        if (x === c) return $(7);
        var U = (y = {}, y[u] = n, y[o] = r, y[s] = i, y)[x] || 1, q = this.$d.getTime() + w * U;
        return p.w(q, this);
      }, v.subtract = function(w, D) {
        return this.add(-1 * w, D);
      }, v.format = function(w) {
        var D = this, y = this.$locale();
        if (!this.isValid()) return y.invalidDate || E;
        var O = w || "YYYY-MM-DDTHH:mm:ssZ", x = p.z(this), $ = this.$H, U = this.$m, q = this.$M, Z = y.weekdays, ee = y.months, me = y.meridiem, le = function(J, ie, ue, pe) {
          return J && (J[ie] || J(D, O)) || ue[ie].slice(0, pe);
        }, be = function(J) {
          return p.s($ % 12 || 12, J, "0");
        }, oe = me || function(J, ie, ue) {
          var pe = J < 12 ? "AM" : "PM";
          return ue ? pe.toLowerCase() : pe;
        };
        return O.replace(m, function(J, ie) {
          return ie || function(ue) {
            switch (ue) {
              case "YY":
                return String(D.$y).slice(-2);
              case "YYYY":
                return p.s(D.$y, 4, "0");
              case "M":
                return q + 1;
              case "MM":
                return p.s(q + 1, 2, "0");
              case "MMM":
                return le(y.monthsShort, q, ee, 3);
              case "MMMM":
                return le(ee, q);
              case "D":
                return D.$D;
              case "DD":
                return p.s(D.$D, 2, "0");
              case "d":
                return String(D.$W);
              case "dd":
                return le(y.weekdaysMin, D.$W, Z, 2);
              case "ddd":
                return le(y.weekdaysShort, D.$W, Z, 3);
              case "dddd":
                return Z[D.$W];
              case "H":
                return String($);
              case "HH":
                return p.s($, 2, "0");
              case "h":
                return be(1);
              case "hh":
                return be(2);
              case "a":
                return oe($, U, true);
              case "A":
                return oe($, U, false);
              case "m":
                return String(U);
              case "mm":
                return p.s(U, 2, "0");
              case "s":
                return String(D.$s);
              case "ss":
                return p.s(D.$s, 2, "0");
              case "SSS":
                return p.s(D.$ms, 3, "0");
              case "Z":
                return x;
            }
            return null;
          }(J) || x.replace(":", "");
        });
      }, v.utcOffset = function() {
        return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
      }, v.diff = function(w, D, y) {
        var O, x = this, $ = p.p(D), U = A(w), q = (U.utcOffset() - this.utcOffset()) * n, Z = this - U, ee = function() {
          return p.m(x, U);
        };
        switch ($) {
          case b:
            O = ee() / 12;
            break;
          case l:
            O = ee();
            break;
          case d:
            O = ee() / 3;
            break;
          case c:
            O = (Z - q) / 6048e5;
            break;
          case f:
            O = (Z - q) / 864e5;
            break;
          case o:
            O = Z / r;
            break;
          case u:
            O = Z / n;
            break;
          case s:
            O = Z / i;
            break;
          default:
            O = Z;
        }
        return y ? O : p.a(O);
      }, v.daysInMonth = function() {
        return this.endOf(l).$D;
      }, v.$locale = function() {
        return F[this.$L];
      }, v.locale = function(w, D) {
        if (!w) return this.$L;
        var y = this.clone(), O = R(w, D, true);
        return O && (y.$L = O), y;
      }, v.clone = function() {
        return p.w(this.$d, this);
      }, v.toDate = function() {
        return new Date(this.valueOf());
      }, v.toJSON = function() {
        return this.isValid() ? this.toISOString() : null;
      }, v.toISOString = function() {
        return this.$d.toISOString();
      }, v.toString = function() {
        return this.$d.toUTCString();
      }, T;
    }(), k = I.prototype;
    return A.prototype = k, [["$ms", a], ["$s", s], ["$m", u], ["$H", o], ["$W", f], ["$M", l], ["$y", b], ["$D", h]].forEach(function(T) {
      k[T[1]] = function(v) {
        return this.$g(v, T[0], T[1]);
      };
    }), A.extend = function(T, v) {
      return T.$i || (T(v, I, A), T.$i = true), A;
    }, A.locale = R, A.isDayjs = W, A.unix = function(T) {
      return A(1e3 * T);
    }, A.en = F[N], A.Ls = F, A.p = {}, A;
  });
})(Yi);
var ji = Yi.exports;
var vn = Fi(ji);
var ki = { exports: {} };
(function(t, e) {
  (function(i, n) {
    t.exports = n();
  })(xt, function() {
    var i = { LTS: "h:mm:ss A", LT: "h:mm A", L: "MM/DD/YYYY", LL: "MMMM D, YYYY", LLL: "MMMM D, YYYY h:mm A", LLLL: "dddd, MMMM D, YYYY h:mm A" }, n = /(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g, r = /\d/, a = /\d\d/, s = /\d\d?/, u = /\d*[^-_:/,()\s\d]+/, o = {}, f = function(g) {
      return (g = +g) + (g > 68 ? 1900 : 2e3);
    }, c = function(g) {
      return function(m) {
        this[g] = +m;
      };
    }, l = [/[+-]\d\d:?(\d\d)?|Z/, function(g) {
      (this.zone || (this.zone = {})).offset = function(m) {
        if (!m || m === "Z") return 0;
        var _ = m.match(/([+-]|\d\d)/g), S = 60 * _[1] + (+_[2] || 0);
        return S === 0 ? 0 : _[0] === "+" ? -S : S;
      }(g);
    }], d = function(g) {
      var m = o[g];
      return m && (m.indexOf ? m : m.s.concat(m.f));
    }, b = function(g, m) {
      var _, S = o.meridiem;
      if (S) {
        for (var P = 1; P <= 24; P += 1) if (g.indexOf(S(P, 0, m)) > -1) {
          _ = P > 12;
          break;
        }
      } else _ = g === (m ? "pm" : "PM");
      return _;
    }, h = { A: [u, function(g) {
      this.afternoon = b(g, false);
    }], a: [u, function(g) {
      this.afternoon = b(g, true);
    }], Q: [r, function(g) {
      this.month = 3 * (g - 1) + 1;
    }], S: [r, function(g) {
      this.milliseconds = 100 * +g;
    }], SS: [a, function(g) {
      this.milliseconds = 10 * +g;
    }], SSS: [/\d{3}/, function(g) {
      this.milliseconds = +g;
    }], s: [s, c("seconds")], ss: [s, c("seconds")], m: [s, c("minutes")], mm: [s, c("minutes")], H: [s, c("hours")], h: [s, c("hours")], HH: [s, c("hours")], hh: [s, c("hours")], D: [s, c("day")], DD: [a, c("day")], Do: [u, function(g) {
      var m = o.ordinal, _ = g.match(/\d+/);
      if (this.day = _[0], m) for (var S = 1; S <= 31; S += 1) m(S).replace(/\[|\]/g, "") === g && (this.day = S);
    }], w: [s, c("week")], ww: [a, c("week")], M: [s, c("month")], MM: [a, c("month")], MMM: [u, function(g) {
      var m = d("months"), _ = (d("monthsShort") || m.map(function(S) {
        return S.slice(0, 3);
      })).indexOf(g) + 1;
      if (_ < 1) throw new Error();
      this.month = _ % 12 || _;
    }], MMMM: [u, function(g) {
      var m = d("months").indexOf(g) + 1;
      if (m < 1) throw new Error();
      this.month = m % 12 || m;
    }], Y: [/[+-]?\d+/, c("year")], YY: [a, function(g) {
      this.year = f(g);
    }], YYYY: [/\d{4}/, c("year")], Z: l, ZZ: l };
    function E(g) {
      var m, _;
      m = g, _ = o && o.formats;
      for (var S = (g = m.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, function(A, p, I) {
        var k = I && I.toUpperCase();
        return p || _[I] || i[I] || _[k].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, function(T, v, w) {
          return v || w.slice(1);
        });
      })).match(n), P = S.length, N = 0; N < P; N += 1) {
        var F = S[N], X = h[F], W = X && X[0], R = X && X[1];
        S[N] = R ? { regex: W, parser: R } : F.replace(/^\[|\]$/g, "");
      }
      return function(A) {
        for (var p = {}, I = 0, k = 0; I < P; I += 1) {
          var T = S[I];
          if (typeof T == "string") k += T.length;
          else {
            var v = T.regex, w = T.parser, D = A.slice(k), y = v.exec(D)[0];
            w.call(p, y), A = A.replace(y, "");
          }
        }
        return function(O) {
          var x = O.afternoon;
          if (x !== void 0) {
            var $ = O.hours;
            x ? $ < 12 && (O.hours += 12) : $ === 12 && (O.hours = 0), delete O.afternoon;
          }
        }(p), p;
      };
    }
    return function(g, m, _) {
      _.p.customParseFormat = true, g && g.parseTwoDigitYear && (f = g.parseTwoDigitYear);
      var S = m.prototype, P = S.parse;
      S.parse = function(N) {
        var F = N.date, X = N.utc, W = N.args;
        this.$u = X;
        var R = W[1];
        if (typeof R == "string") {
          var A = W[2] === true, p = W[3] === true, I = A || p, k = W[2];
          p && (k = W[2]), o = this.$locale(), !A && k && (o = _.Ls[k]), this.$d = function(D, y, O, x) {
            try {
              if (["x", "X"].indexOf(y) > -1) return new Date((y === "X" ? 1e3 : 1) * D);
              var $ = E(y)(D), U = $.year, q = $.month, Z = $.day, ee = $.hours, me = $.minutes, le = $.seconds, be = $.milliseconds, oe = $.zone, J = $.week, ie = /* @__PURE__ */ new Date(), ue = Z || (U || q ? 1 : ie.getDate()), pe = U || ie.getFullYear(), Ke = 0;
              U && !q || (Ke = q > 0 ? q - 1 : ie.getMonth());
              var Ge, ft = ee || 0, ht = me || 0, dt = le || 0, vt = be || 0;
              return oe ? new Date(Date.UTC(pe, Ke, ue, ft, ht, dt, vt + 60 * oe.offset * 1e3)) : O ? new Date(Date.UTC(pe, Ke, ue, ft, ht, dt, vt)) : (Ge = new Date(pe, Ke, ue, ft, ht, dt, vt), J && (Ge = x(Ge).week(J).toDate()), Ge);
            } catch {
              return /* @__PURE__ */ new Date("");
            }
          }(F, R, X, _), this.init(), k && k !== true && (this.$L = this.locale(k).$L), I && F != this.format(R) && (this.$d = /* @__PURE__ */ new Date("")), o = {};
        } else if (R instanceof Array) for (var T = R.length, v = 1; v <= T; v += 1) {
          W[1] = R[v - 1];
          var w = _.apply(this, W);
          if (w.isValid()) {
            this.$d = w.$d, this.$L = w.$L, this.init();
            break;
          }
          v === T && (this.$d = /* @__PURE__ */ new Date(""));
        }
        else P.call(this, N);
      };
    };
  });
})(ki);
var gn = ki.exports;
var mn = Fi(gn);
var pn = { exports: {} };
(function(t, e) {
  (function(i, n) {
    t.exports = n(ji);
  })(xt, function(i) {
    function n(s) {
      return s && typeof s == "object" && "default" in s ? s : { default: s };
    }
    var r = n(i), a = { name: "zh-cn", weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"), weekdaysShort: "周日_周一_周二_周三_周四_周五_周六".split("_"), weekdaysMin: "日_一_二_三_四_五_六".split("_"), months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"), monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"), ordinal: function(s, u) {
      return u === "W" ? s + "周" : s + "日";
    }, weekStart: 1, yearStart: 4, formats: { LT: "HH:mm", LTS: "HH:mm:ss", L: "YYYY/MM/DD", LL: "YYYY年M月D日", LLL: "YYYY年M月D日Ah点mm分", LLLL: "YYYY年M月D日ddddAh点mm分", l: "YYYY/M/D", ll: "YYYY年M月D日", lll: "YYYY年M月D日 HH:mm", llll: "YYYY年M月D日dddd HH:mm" }, relativeTime: { future: "%s内", past: "%s前", s: "几秒", m: "1 分钟", mm: "%d 分钟", h: "1 小时", hh: "%d 小时", d: "1 天", dd: "%d 天", M: "1 个月", MM: "%d 个月", y: "1 年", yy: "%d 年" }, meridiem: function(s, u) {
      var o = 100 * s + u;
      return o < 600 ? "凌晨" : o < 900 ? "早上" : o < 1100 ? "上午" : o < 1300 ? "中午" : o < 1800 ? "下午" : "晚上";
    } };
    return r.default.locale(a, null, true), a;
  });
})(pn);
var Hi = typeof global == "object" && global && global.Object === Object && global;
var wn = typeof self == "object" && self && self.Object === Object && self;
var de = Hi || wn || Function("return this")();
var ye = de.Symbol;
var Ui = Object.prototype;
var yn = Ui.hasOwnProperty;
var bn = Ui.toString;
var Ye = ye ? ye.toStringTag : void 0;
function _n(t) {
  var e = yn.call(t, Ye), i = t[Ye];
  try {
    t[Ye] = void 0;
    var n = true;
  } catch {
  }
  var r = bn.call(t);
  return n && (e ? t[Ye] = i : delete t[Ye]), r;
}
var Sn = Object.prototype;
var En = Sn.toString;
function Tn(t) {
  return En.call(t);
}
var Dn = "[object Null]";
var An = "[object Undefined]";
var jt = ye ? ye.toStringTag : void 0;
function ze(t) {
  return t == null ? t === void 0 ? An : Dn : jt && jt in Object(t) ? _n(t) : Tn(t);
}
function Re(t) {
  return t != null && typeof t == "object";
}
var On = "[object Symbol]";
function Mt(t) {
  return typeof t == "symbol" || Re(t) && ze(t) == On;
}
function xn(t, e) {
  for (var i = -1, n = t == null ? 0 : t.length, r = Array(n); ++i < n; )
    r[i] = e(t[i], i, t);
  return r;
}
var fe = Array.isArray;
var kt = ye ? ye.prototype : void 0;
var Ht = kt ? kt.toString : void 0;
function Vi(t) {
  if (typeof t == "string")
    return t;
  if (fe(t))
    return xn(t, Vi) + "";
  if (Mt(t))
    return Ht ? Ht.call(t) : "";
  var e = t + "";
  return e == "0" && 1 / t == -1 / 0 ? "-0" : e;
}
function Ct(t) {
  var e = typeof t;
  return t != null && (e == "object" || e == "function");
}
function Mn(t) {
  return t;
}
var Cn = "[object AsyncFunction]";
var In = "[object Function]";
var $n = "[object GeneratorFunction]";
var Ln = "[object Proxy]";
function Wi(t) {
  if (!Ct(t))
    return false;
  var e = ze(t);
  return e == In || e == $n || e == Cn || e == Ln;
}
var gt = de["__core-js_shared__"];
var Ut = function() {
  var t = /[^.]+$/.exec(gt && gt.keys && gt.keys.IE_PROTO || "");
  return t ? "Symbol(src)_1." + t : "";
}();
function Rn(t) {
  return !!Ut && Ut in t;
}
var Pn = Function.prototype;
var Nn = Pn.toString;
function Te(t) {
  if (t != null) {
    try {
      return Nn.call(t);
    } catch {
    }
    try {
      return t + "";
    } catch {
    }
  }
  return "";
}
var zn = /[\\^$.*+?()[\]{}|]/g;
var Fn = /^\[object .+?Constructor\]$/;
var Yn = Function.prototype;
var jn = Object.prototype;
var kn = Yn.toString;
var Hn = jn.hasOwnProperty;
var Un = RegExp(
  "^" + kn.call(Hn).replace(zn, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function Vn(t) {
  if (!Ct(t) || Rn(t))
    return false;
  var e = Wi(t) ? Un : Fn;
  return e.test(Te(t));
}
function Wn(t, e) {
  return t == null ? void 0 : t[e];
}
function Fe(t, e) {
  var i = Wn(t, e);
  return Vn(i) ? i : void 0;
}
var yt = Fe(de, "WeakMap");
function qn() {
}
function Bn(t, e, i, n) {
  for (var r = t.length, a = i + -1; ++a < r; )
    if (e(t[a], a, t))
      return a;
  return -1;
}
function Xn(t) {
  return t !== t;
}
function Kn(t, e, i) {
  for (var n = i - 1, r = t.length; ++n < r; )
    if (t[n] === e)
      return n;
  return -1;
}
function Gn(t, e, i) {
  return e === e ? Kn(t, e, i) : Bn(t, Xn, i);
}
function Zn(t, e) {
  var i = t == null ? 0 : t.length;
  return !!i && Gn(t, e, 0) > -1;
}
var Jn = 9007199254740991;
var Qn = /^(?:0|[1-9]\d*)$/;
function qi(t, e) {
  var i = typeof t;
  return e = e ?? Jn, !!e && (i == "number" || i != "symbol" && Qn.test(t)) && t > -1 && t % 1 == 0 && t < e;
}
function Bi(t, e) {
  return t === e || t !== t && e !== e;
}
var er = 9007199254740991;
function It(t) {
  return typeof t == "number" && t > -1 && t % 1 == 0 && t <= er;
}
function tr(t) {
  return t != null && It(t.length) && !Wi(t);
}
var ir = Object.prototype;
function nr(t) {
  var e = t && t.constructor, i = typeof e == "function" && e.prototype || ir;
  return t === i;
}
function rr(t, e) {
  for (var i = -1, n = Array(t); ++i < t; )
    n[i] = e(i);
  return n;
}
var ar = "[object Arguments]";
function Vt(t) {
  return Re(t) && ze(t) == ar;
}
var Xi = Object.prototype;
var sr = Xi.hasOwnProperty;
var or = Xi.propertyIsEnumerable;
var Ki = Vt(/* @__PURE__ */ function() {
  return arguments;
}()) ? Vt : function(t) {
  return Re(t) && sr.call(t, "callee") && !or.call(t, "callee");
};
function lr() {
  return false;
}
var Gi = typeof exports == "object" && exports && !exports.nodeType && exports;
var Wt = Gi && typeof module == "object" && module && !module.nodeType && module;
var ur = Wt && Wt.exports === Gi;
var qt = ur ? de.Buffer : void 0;
var cr = qt ? qt.isBuffer : void 0;
var bt = cr || lr;
var fr = "[object Arguments]";
var hr = "[object Array]";
var dr = "[object Boolean]";
var vr = "[object Date]";
var gr = "[object Error]";
var mr = "[object Function]";
var pr = "[object Map]";
var wr = "[object Number]";
var yr = "[object Object]";
var br = "[object RegExp]";
var _r = "[object Set]";
var Sr = "[object String]";
var Er = "[object WeakMap]";
var Tr = "[object ArrayBuffer]";
var Dr = "[object DataView]";
var Ar = "[object Float32Array]";
var Or = "[object Float64Array]";
var xr = "[object Int8Array]";
var Mr = "[object Int16Array]";
var Cr = "[object Int32Array]";
var Ir = "[object Uint8Array]";
var $r = "[object Uint8ClampedArray]";
var Lr = "[object Uint16Array]";
var Rr = "[object Uint32Array]";
var V = {};
V[Ar] = V[Or] = V[xr] = V[Mr] = V[Cr] = V[Ir] = V[$r] = V[Lr] = V[Rr] = true;
V[fr] = V[hr] = V[Tr] = V[dr] = V[Dr] = V[vr] = V[gr] = V[mr] = V[pr] = V[wr] = V[yr] = V[br] = V[_r] = V[Sr] = V[Er] = false;
function Pr(t) {
  return Re(t) && It(t.length) && !!V[ze(t)];
}
function Nr(t) {
  return function(e) {
    return t(e);
  };
}
var Zi = typeof exports == "object" && exports && !exports.nodeType && exports;
var ke = Zi && typeof module == "object" && module && !module.nodeType && module;
var zr = ke && ke.exports === Zi;
var mt = zr && Hi.process;
var Bt = function() {
  try {
    var t = ke && ke.require && ke.require("util").types;
    return t || mt && mt.binding && mt.binding("util");
  } catch {
  }
}();
var Xt = Bt && Bt.isTypedArray;
var Ji = Xt ? Nr(Xt) : Pr;
var Fr = Object.prototype;
var Yr = Fr.hasOwnProperty;
function jr(t, e) {
  var i = fe(t), n = !i && Ki(t), r = !i && !n && bt(t), a = !i && !n && !r && Ji(t), s = i || n || r || a, u = s ? rr(t.length, String) : [], o = u.length;
  for (var f in t)
    Yr.call(t, f) && !(s && // Safari 9 has enumerable `arguments.length` in strict mode.
    (f == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    r && (f == "offset" || f == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    a && (f == "buffer" || f == "byteLength" || f == "byteOffset") || // Skip index properties.
    qi(f, o))) && u.push(f);
  return u;
}
function kr(t, e) {
  return function(i) {
    return t(e(i));
  };
}
var Hr = kr(Object.keys, Object);
var Ur = Object.prototype;
var Vr = Ur.hasOwnProperty;
function Wr(t) {
  if (!nr(t))
    return Hr(t);
  var e = [];
  for (var i in Object(t))
    Vr.call(t, i) && i != "constructor" && e.push(i);
  return e;
}
function Qi(t) {
  return tr(t) ? jr(t) : Wr(t);
}
var qr = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
var Br = /^\w*$/;
function $t(t, e) {
  if (fe(t))
    return false;
  var i = typeof t;
  return i == "number" || i == "symbol" || i == "boolean" || t == null || Mt(t) ? true : Br.test(t) || !qr.test(t) || e != null && t in Object(e);
}
var Ue = Fe(Object, "create");
function Xr() {
  this.__data__ = Ue ? Ue(null) : {}, this.size = 0;
}
function Kr(t) {
  var e = this.has(t) && delete this.__data__[t];
  return this.size -= e ? 1 : 0, e;
}
var Gr = "__lodash_hash_undefined__";
var Zr = Object.prototype;
var Jr = Zr.hasOwnProperty;
function Qr(t) {
  var e = this.__data__;
  if (Ue) {
    var i = e[t];
    return i === Gr ? void 0 : i;
  }
  return Jr.call(e, t) ? e[t] : void 0;
}
var ea = Object.prototype;
var ta = ea.hasOwnProperty;
function ia(t) {
  var e = this.__data__;
  return Ue ? e[t] !== void 0 : ta.call(e, t);
}
var na = "__lodash_hash_undefined__";
function ra(t, e) {
  var i = this.__data__;
  return this.size += this.has(t) ? 0 : 1, i[t] = Ue && e === void 0 ? na : e, this;
}
function Ee(t) {
  var e = -1, i = t == null ? 0 : t.length;
  for (this.clear(); ++e < i; ) {
    var n = t[e];
    this.set(n[0], n[1]);
  }
}
Ee.prototype.clear = Xr;
Ee.prototype.delete = Kr;
Ee.prototype.get = Qr;
Ee.prototype.has = ia;
Ee.prototype.set = ra;
function aa() {
  this.__data__ = [], this.size = 0;
}
function ot(t, e) {
  for (var i = t.length; i--; )
    if (Bi(t[i][0], e))
      return i;
  return -1;
}
var sa = Array.prototype;
var oa = sa.splice;
function la(t) {
  var e = this.__data__, i = ot(e, t);
  if (i < 0)
    return false;
  var n = e.length - 1;
  return i == n ? e.pop() : oa.call(e, i, 1), --this.size, true;
}
function ua(t) {
  var e = this.__data__, i = ot(e, t);
  return i < 0 ? void 0 : e[i][1];
}
function ca(t) {
  return ot(this.__data__, t) > -1;
}
function fa(t, e) {
  var i = this.__data__, n = ot(i, t);
  return n < 0 ? (++this.size, i.push([t, e])) : i[n][1] = e, this;
}
function ve(t) {
  var e = -1, i = t == null ? 0 : t.length;
  for (this.clear(); ++e < i; ) {
    var n = t[e];
    this.set(n[0], n[1]);
  }
}
ve.prototype.clear = aa;
ve.prototype.delete = la;
ve.prototype.get = ua;
ve.prototype.has = ca;
ve.prototype.set = fa;
var Ve = Fe(de, "Map");
function ha() {
  this.size = 0, this.__data__ = {
    hash: new Ee(),
    map: new (Ve || ve)(),
    string: new Ee()
  };
}
function da(t) {
  var e = typeof t;
  return e == "string" || e == "number" || e == "symbol" || e == "boolean" ? t !== "__proto__" : t === null;
}
function lt(t, e) {
  var i = t.__data__;
  return da(e) ? i[typeof e == "string" ? "string" : "hash"] : i.map;
}
function va(t) {
  var e = lt(this, t).delete(t);
  return this.size -= e ? 1 : 0, e;
}
function ga(t) {
  return lt(this, t).get(t);
}
function ma(t) {
  return lt(this, t).has(t);
}
function pa(t, e) {
  var i = lt(this, t), n = i.size;
  return i.set(t, e), this.size += i.size == n ? 0 : 1, this;
}
function ge(t) {
  var e = -1, i = t == null ? 0 : t.length;
  for (this.clear(); ++e < i; ) {
    var n = t[e];
    this.set(n[0], n[1]);
  }
}
ge.prototype.clear = ha;
ge.prototype.delete = va;
ge.prototype.get = ga;
ge.prototype.has = ma;
ge.prototype.set = pa;
var wa = "Expected a function";
function Lt(t, e) {
  if (typeof t != "function" || e != null && typeof e != "function")
    throw new TypeError(wa);
  var i = function() {
    var n = arguments, r = e ? e.apply(this, n) : n[0], a = i.cache;
    if (a.has(r))
      return a.get(r);
    var s = t.apply(this, n);
    return i.cache = a.set(r, s) || a, s;
  };
  return i.cache = new (Lt.Cache || ge)(), i;
}
Lt.Cache = ge;
var ya = 500;
function ba(t) {
  var e = Lt(t, function(n) {
    return i.size === ya && i.clear(), n;
  }), i = e.cache;
  return e;
}
var _a = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
var Sa = /\\(\\)?/g;
var Ea = ba(function(t) {
  var e = [];
  return t.charCodeAt(0) === 46 && e.push(""), t.replace(_a, function(i, n, r, a) {
    e.push(r ? a.replace(Sa, "$1") : n || i);
  }), e;
});
function Ta(t) {
  return t == null ? "" : Vi(t);
}
function en(t, e) {
  return fe(t) ? t : $t(t, e) ? [t] : Ea(Ta(t));
}
function ut(t) {
  if (typeof t == "string" || Mt(t))
    return t;
  var e = t + "";
  return e == "0" && 1 / t == -1 / 0 ? "-0" : e;
}
function tn(t, e) {
  e = en(e, t);
  for (var i = 0, n = e.length; t != null && i < n; )
    t = t[ut(e[i++])];
  return i && i == n ? t : void 0;
}
function Da(t, e, i) {
  var n = t == null ? void 0 : tn(t, e);
  return n === void 0 ? i : n;
}
function Aa(t, e) {
  for (var i = -1, n = e.length, r = t.length; ++i < n; )
    t[r + i] = e[i];
  return t;
}
function Oa() {
  this.__data__ = new ve(), this.size = 0;
}
function xa(t) {
  var e = this.__data__, i = e.delete(t);
  return this.size = e.size, i;
}
function Ma(t) {
  return this.__data__.get(t);
}
function Ca(t) {
  return this.__data__.has(t);
}
var Ia = 200;
function $a(t, e) {
  var i = this.__data__;
  if (i instanceof ve) {
    var n = i.__data__;
    if (!Ve || n.length < Ia - 1)
      return n.push([t, e]), this.size = ++i.size, this;
    i = this.__data__ = new ge(n);
  }
  return i.set(t, e), this.size = i.size, this;
}
function ce(t) {
  var e = this.__data__ = new ve(t);
  this.size = e.size;
}
ce.prototype.clear = Oa;
ce.prototype.delete = xa;
ce.prototype.get = Ma;
ce.prototype.has = Ca;
ce.prototype.set = $a;
function La(t, e) {
  for (var i = -1, n = t == null ? 0 : t.length, r = 0, a = []; ++i < n; ) {
    var s = t[i];
    e(s, i, t) && (a[r++] = s);
  }
  return a;
}
function Ra() {
  return [];
}
var Pa = Object.prototype;
var Na = Pa.propertyIsEnumerable;
var Kt = Object.getOwnPropertySymbols;
var za = Kt ? function(t) {
  return t == null ? [] : (t = Object(t), La(Kt(t), function(e) {
    return Na.call(t, e);
  }));
} : Ra;
function Fa(t, e, i) {
  var n = e(t);
  return fe(t) ? n : Aa(n, i(t));
}
function Gt(t) {
  return Fa(t, Qi, za);
}
var _t = Fe(de, "DataView");
var St = Fe(de, "Promise");
var Ie = Fe(de, "Set");
var Zt = "[object Map]";
var Ya = "[object Object]";
var Jt = "[object Promise]";
var Qt = "[object Set]";
var ei = "[object WeakMap]";
var ti = "[object DataView]";
var ja = Te(_t);
var ka = Te(Ve);
var Ha = Te(St);
var Ua = Te(Ie);
var Va = Te(yt);
var we = ze;
(_t && we(new _t(new ArrayBuffer(1))) != ti || Ve && we(new Ve()) != Zt || St && we(St.resolve()) != Jt || Ie && we(new Ie()) != Qt || yt && we(new yt()) != ei) && (we = function(t) {
  var e = ze(t), i = e == Ya ? t.constructor : void 0, n = i ? Te(i) : "";
  if (n)
    switch (n) {
      case ja:
        return ti;
      case ka:
        return Zt;
      case Ha:
        return Jt;
      case Ua:
        return Qt;
      case Va:
        return ei;
    }
  return e;
});
var ii = de.Uint8Array;
var Wa = "__lodash_hash_undefined__";
function qa(t) {
  return this.__data__.set(t, Wa), this;
}
function Ba(t) {
  return this.__data__.has(t);
}
function We(t) {
  var e = -1, i = t == null ? 0 : t.length;
  for (this.__data__ = new ge(); ++e < i; )
    this.add(t[e]);
}
We.prototype.add = We.prototype.push = qa;
We.prototype.has = Ba;
function Xa(t, e) {
  for (var i = -1, n = t == null ? 0 : t.length; ++i < n; )
    if (e(t[i], i, t))
      return true;
  return false;
}
function nn(t, e) {
  return t.has(e);
}
var Ka = 1;
var Ga = 2;
function rn(t, e, i, n, r, a) {
  var s = i & Ka, u = t.length, o = e.length;
  if (u != o && !(s && o > u))
    return false;
  var f = a.get(t), c = a.get(e);
  if (f && c)
    return f == e && c == t;
  var l = -1, d = true, b = i & Ga ? new We() : void 0;
  for (a.set(t, e), a.set(e, t); ++l < u; ) {
    var h = t[l], E = e[l];
    if (n)
      var g = s ? n(E, h, l, e, t, a) : n(h, E, l, t, e, a);
    if (g !== void 0) {
      if (g)
        continue;
      d = false;
      break;
    }
    if (b) {
      if (!Xa(e, function(m, _) {
        if (!nn(b, _) && (h === m || r(h, m, i, n, a)))
          return b.push(_);
      })) {
        d = false;
        break;
      }
    } else if (!(h === E || r(h, E, i, n, a))) {
      d = false;
      break;
    }
  }
  return a.delete(t), a.delete(e), d;
}
function Za(t) {
  var e = -1, i = Array(t.size);
  return t.forEach(function(n, r) {
    i[++e] = [r, n];
  }), i;
}
function Rt(t) {
  var e = -1, i = Array(t.size);
  return t.forEach(function(n) {
    i[++e] = n;
  }), i;
}
var Ja = 1;
var Qa = 2;
var es = "[object Boolean]";
var ts = "[object Date]";
var is = "[object Error]";
var ns = "[object Map]";
var rs = "[object Number]";
var as = "[object RegExp]";
var ss = "[object Set]";
var os = "[object String]";
var ls = "[object Symbol]";
var us = "[object ArrayBuffer]";
var cs = "[object DataView]";
var ni = ye ? ye.prototype : void 0;
var pt = ni ? ni.valueOf : void 0;
function fs(t, e, i, n, r, a, s) {
  switch (i) {
    case cs:
      if (t.byteLength != e.byteLength || t.byteOffset != e.byteOffset)
        return false;
      t = t.buffer, e = e.buffer;
    case us:
      return !(t.byteLength != e.byteLength || !a(new ii(t), new ii(e)));
    case es:
    case ts:
    case rs:
      return Bi(+t, +e);
    case is:
      return t.name == e.name && t.message == e.message;
    case as:
    case os:
      return t == e + "";
    case ns:
      var u = Za;
    case ss:
      var o = n & Ja;
      if (u || (u = Rt), t.size != e.size && !o)
        return false;
      var f = s.get(t);
      if (f)
        return f == e;
      n |= Qa, s.set(t, e);
      var c = rn(u(t), u(e), n, r, a, s);
      return s.delete(t), c;
    case ls:
      if (pt)
        return pt.call(t) == pt.call(e);
  }
  return false;
}
var hs = 1;
var ds = Object.prototype;
var vs = ds.hasOwnProperty;
function gs(t, e, i, n, r, a) {
  var s = i & hs, u = Gt(t), o = u.length, f = Gt(e), c = f.length;
  if (o != c && !s)
    return false;
  for (var l = o; l--; ) {
    var d = u[l];
    if (!(s ? d in e : vs.call(e, d)))
      return false;
  }
  var b = a.get(t), h = a.get(e);
  if (b && h)
    return b == e && h == t;
  var E = true;
  a.set(t, e), a.set(e, t);
  for (var g = s; ++l < o; ) {
    d = u[l];
    var m = t[d], _ = e[d];
    if (n)
      var S = s ? n(_, m, d, e, t, a) : n(m, _, d, t, e, a);
    if (!(S === void 0 ? m === _ || r(m, _, i, n, a) : S)) {
      E = false;
      break;
    }
    g || (g = d == "constructor");
  }
  if (E && !g) {
    var P = t.constructor, N = e.constructor;
    P != N && "constructor" in t && "constructor" in e && !(typeof P == "function" && P instanceof P && typeof N == "function" && N instanceof N) && (E = false);
  }
  return a.delete(t), a.delete(e), E;
}
var ms = 1;
var ri = "[object Arguments]";
var ai = "[object Array]";
var Ze = "[object Object]";
var ps = Object.prototype;
var si = ps.hasOwnProperty;
function ws(t, e, i, n, r, a) {
  var s = fe(t), u = fe(e), o = s ? ai : we(t), f = u ? ai : we(e);
  o = o == ri ? Ze : o, f = f == ri ? Ze : f;
  var c = o == Ze, l = f == Ze, d = o == f;
  if (d && bt(t)) {
    if (!bt(e))
      return false;
    s = true, c = false;
  }
  if (d && !c)
    return a || (a = new ce()), s || Ji(t) ? rn(t, e, i, n, r, a) : fs(t, e, o, i, n, r, a);
  if (!(i & ms)) {
    var b = c && si.call(t, "__wrapped__"), h = l && si.call(e, "__wrapped__");
    if (b || h) {
      var E = b ? t.value() : t, g = h ? e.value() : e;
      return a || (a = new ce()), r(E, g, i, n, a);
    }
  }
  return d ? (a || (a = new ce()), gs(t, e, i, n, r, a)) : false;
}
function Pt(t, e, i, n, r) {
  return t === e ? true : t == null || e == null || !Re(t) && !Re(e) ? t !== t && e !== e : ws(t, e, i, n, Pt, r);
}
var ys = 1;
var bs = 2;
function _s(t, e, i, n) {
  var r = i.length, a = r;
  if (t == null)
    return !a;
  for (t = Object(t); r--; ) {
    var s = i[r];
    if (s[2] ? s[1] !== t[s[0]] : !(s[0] in t))
      return false;
  }
  for (; ++r < a; ) {
    s = i[r];
    var u = s[0], o = t[u], f = s[1];
    if (s[2]) {
      if (o === void 0 && !(u in t))
        return false;
    } else {
      var c = new ce(), l;
      if (!(l === void 0 ? Pt(f, o, ys | bs, n, c) : l))
        return false;
    }
  }
  return true;
}
function an(t) {
  return t === t && !Ct(t);
}
function Ss(t) {
  for (var e = Qi(t), i = e.length; i--; ) {
    var n = e[i], r = t[n];
    e[i] = [n, r, an(r)];
  }
  return e;
}
function sn(t, e) {
  return function(i) {
    return i == null ? false : i[t] === e && (e !== void 0 || t in Object(i));
  };
}
function Es(t) {
  var e = Ss(t);
  return e.length == 1 && e[0][2] ? sn(e[0][0], e[0][1]) : function(i) {
    return i === t || _s(i, t, e);
  };
}
function Ts(t, e) {
  return t != null && e in Object(t);
}
function Ds(t, e, i) {
  e = en(e, t);
  for (var n = -1, r = e.length, a = false; ++n < r; ) {
    var s = ut(e[n]);
    if (!(a = t != null && i(t, s)))
      break;
    t = t[s];
  }
  return a || ++n != r ? a : (r = t == null ? 0 : t.length, !!r && It(r) && qi(s, r) && (fe(t) || Ki(t)));
}
function As(t, e) {
  return t != null && Ds(t, e, Ts);
}
var Os = 1;
var xs = 2;
function Ms(t, e) {
  return $t(t) && an(e) ? sn(ut(t), e) : function(i) {
    var n = Da(i, t);
    return n === void 0 && n === e ? As(i, t) : Pt(e, n, Os | xs);
  };
}
function Cs(t) {
  return function(e) {
    return e == null ? void 0 : e[t];
  };
}
function Is(t) {
  return function(e) {
    return tn(e, t);
  };
}
function $s(t) {
  return $t(t) ? Cs(ut(t)) : Is(t);
}
function Ls(t) {
  return typeof t == "function" ? t : t == null ? Mn : typeof t == "object" ? fe(t) ? Ms(t[0], t[1]) : Es(t) : $s(t);
}
var Rs = 1 / 0;
var Ps = Ie && 1 / Rt(new Ie([, -0]))[1] == Rs ? function(t) {
  return new Ie(t);
} : qn;
var Ns = 200;
function zs(t, e, i) {
  var n = -1, r = Zn, a = t.length, s = true, u = [], o = u;
  if (a >= Ns) {
    var f = e ? null : Ps(t);
    if (f)
      return Rt(f);
    s = false, r = nn, o = new We();
  } else
    o = e ? [] : u;
  e:
    for (; ++n < a; ) {
      var c = t[n], l = e ? e(c) : c;
      if (c = c !== 0 ? c : 0, s && l === l) {
        for (var d = o.length; d--; )
          if (o[d] === l)
            continue e;
        e && o.push(l), u.push(c);
      } else r(o, l, i) || (o !== u && o.push(l), u.push(c));
    }
  return u;
}
function Fs(t, e) {
  return t && t.length ? zs(t, Ls(e)) : [];
}
vn.extend(mn);
function Ys() {
  return Number(Math.random().toString().substr(3, 4) + Date.now()).toString(36);
}
var js = (t, e = "", i) => {
  const n = new Blob([t]);
  if (window.navigator.msSaveOrOpenBlob)
    navigator.msSaveBlob(n, e);
  else {
    const r = document.createElement("a");
    i && (r.className = i), r.download = e, r.style.display = "none", r.href = URL.createObjectURL(n), document.body.appendChild(r), r.click(), document.body.removeChild(r);
  }
};
var ks = (t, e, i) => {
  const { data: n, headers: r } = t;
  let a = "";
  const s = r["content-disposition"];
  s && (a = s == null ? void 0 : s.substring(s.indexOf("filename=") + 9, s.length), a = decodeURI(a), a = a.replace(/"/g, ""));
  const u = e || a, o = new FileReader();
  o.onload = (f) => {
    try {
      const c = JSON.parse((f == null ? void 0 : f.target).result);
      c.success || message_default.error(c.errMessage);
    } catch {
      js(n, u, i);
    }
  }, o.readAsText(n);
};
var Co = (t) => {
  const e = document.createElement("form");
  e.setAttribute("method", "get"), e.setAttribute("action", t), document.body.appendChild(e), e.submit(), document.body.removeChild(e);
};
var Io = (t, e, i = "") => {
  const n = new Blob([t], {
    type: e
  }), r = new FileReader();
  r.readAsDataURL(n), r.onload = function(a) {
    var u;
    const s = document.createElement("a");
    s.download = i || `${(/* @__PURE__ */ new Date()).getTime()}`, s.href = (u = a.target) == null ? void 0 : u.result, document.body.appendChild(s), s.click(), document.body.removeChild(s);
  };
};
function Hs(t, e) {
  if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
function oi(t, e) {
  for (var i = 0; i < e.length; i++) {
    var n = e[i];
    n.enumerable = n.enumerable || false, n.configurable = true, "value" in n && (n.writable = true), Object.defineProperty(t, on(n.key), n);
  }
}
function Us(t, e, i) {
  return e && oi(t.prototype, e), i && oi(t, i), Object.defineProperty(t, "prototype", {
    writable: false
  }), t;
}
function Vs(t, e, i) {
  return (e = on(e)) in t ? Object.defineProperty(t, e, {
    value: i,
    enumerable: true,
    configurable: true,
    writable: true
  }) : t[e] = i, t;
}
function li(t, e) {
  var i = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(t);
    e && (n = n.filter(function(r) {
      return Object.getOwnPropertyDescriptor(t, r).enumerable;
    })), i.push.apply(i, n);
  }
  return i;
}
function Nt(t) {
  for (var e = 1; e < arguments.length; e++) {
    var i = arguments[e] != null ? arguments[e] : {};
    e % 2 ? li(Object(i), true).forEach(function(n) {
      Vs(t, n, i[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(i)) : li(Object(i)).forEach(function(n) {
      Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(i, n));
    });
  }
  return t;
}
function Ws(t, e) {
  if (typeof t != "object" || !t) return t;
  var i = t[Symbol.toPrimitive];
  if (i !== void 0) {
    var n = i.call(t, e);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(t);
}
function on(t) {
  var e = Ws(t, "string");
  return typeof e == "symbol" ? e : e + "";
}
function Et(t) {
  "@babel/helpers - typeof";
  return Et = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Et(t);
}
var ui = {
  /**
   * Enable a modal backdrop, specify `static` for a backdrop
   * which doesn't close the modal on click.
   * @type {boolean}
   */
  backdrop: true,
  /**
   * Show the button on the top-right of the viewer.
   * @type {boolean}
   */
  button: true,
  /**
   * Show the navbar.
   * @type {boolean | number}
   */
  navbar: true,
  /**
   * Specify the visibility and the content of the title.
   * @type {boolean | number | Function | Array}
   */
  title: true,
  /**
   * Show the toolbar.
   * @type {boolean | number | Object}
   */
  toolbar: true,
  /**
   * Custom class name(s) to add to the viewer's root element.
   * @type {string}
   */
  className: "",
  /**
   * Define where to put the viewer in modal mode.
   * @type {string | Element}
   */
  container: "body",
  /**
   * Filter the images for viewing. Return true if the image is viewable.
   * @type {Function}
   */
  filter: null,
  /**
   * Enable to request fullscreen when play.
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/FullscreenOptions}
   * @type {boolean|FullscreenOptions}
   */
  fullscreen: true,
  /**
   * Define the extra attributes to inherit from the original image.
   * @type {Array}
   */
  inheritedAttributes: ["crossOrigin", "decoding", "isMap", "loading", "referrerPolicy", "sizes", "srcset", "useMap"],
  /**
   * Define the initial coverage of the viewing image.
   * @type {number}
   */
  initialCoverage: 0.9,
  /**
   * Define the initial index of the image for viewing.
   * @type {number}
   */
  initialViewIndex: 0,
  /**
   * Enable inline mode.
   * @type {boolean}
   */
  inline: false,
  /**
   * The amount of time to delay between automatically cycling an image when playing.
   * @type {number}
   */
  interval: 5e3,
  /**
   * Enable keyboard support.
   * @type {boolean}
   */
  keyboard: true,
  /**
   * Focus the viewer when initialized.
   * @type {boolean}
   */
  focus: true,
  /**
   * Indicate if show a loading spinner when load image or not.
   * @type {boolean}
   */
  loading: true,
  /**
   * Indicate if enable loop viewing or not.
   * @type {boolean}
   */
  loop: true,
  /**
   * Min width of the viewer in inline mode.
   * @type {number}
   */
  minWidth: 200,
  /**
   * Min height of the viewer in inline mode.
   * @type {number}
   */
  minHeight: 100,
  /**
   * Enable to move the image.
   * @type {boolean}
   */
  movable: true,
  /**
   * Enable to rotate the image.
   * @type {boolean}
   */
  rotatable: true,
  /**
   * Enable to scale the image.
   * @type {boolean}
   */
  scalable: true,
  /**
   * Enable to zoom the image.
   * @type {boolean}
   */
  zoomable: true,
  /**
   * Enable to zoom the current image by dragging on the touch screen.
   * @type {boolean}
   */
  zoomOnTouch: true,
  /**
   * Enable to zoom the image by wheeling mouse.
   * @type {boolean}
   */
  zoomOnWheel: true,
  /**
   * Enable to slide to the next or previous image by swiping on the touch screen.
   * @type {boolean}
   */
  slideOnTouch: true,
  /**
   * Indicate if toggle the image size between its natural size
   * and initial size when double click on the image or not.
   * @type {boolean}
   */
  toggleOnDblclick: true,
  /**
   * Show the tooltip with image ratio (percentage) when zoom in or zoom out.
   * @type {boolean}
   */
  tooltip: true,
  /**
   * Enable CSS3 Transition for some special elements.
   * @type {boolean}
   */
  transition: true,
  /**
   * Define the CSS `z-index` value of viewer in modal mode.
   * @type {number}
   */
  zIndex: 2015,
  /**
   * Define the CSS `z-index` value of viewer in inline mode.
   * @type {number}
   */
  zIndexInline: 0,
  /**
   * Define the ratio when zoom the image by wheeling mouse.
   * @type {number}
   */
  zoomRatio: 0.1,
  /**
   * Define the min ratio of the image when zoom out.
   * @type {number}
   */
  minZoomRatio: 0.01,
  /**
   * Define the max ratio of the image when zoom in.
   * @type {number}
   */
  maxZoomRatio: 100,
  /**
   * Define where to get the original image URL for viewing.
   * @type {string | Function}
   */
  url: "src",
  /**
   * Event shortcuts.
   * @type {Function}
   */
  ready: null,
  show: null,
  shown: null,
  hide: null,
  hidden: null,
  view: null,
  viewed: null,
  move: null,
  moved: null,
  rotate: null,
  rotated: null,
  scale: null,
  scaled: null,
  zoom: null,
  zoomed: null,
  play: null,
  stop: null
};
var qs = '<div class="viewer-container" tabindex="-1" touch-action="none"><div class="viewer-canvas"></div><div class="viewer-footer"><div class="viewer-title"></div><div class="viewer-toolbar"></div><div class="viewer-navbar"><ul class="viewer-list" role="navigation"></ul></div></div><div class="viewer-tooltip" role="alert" aria-hidden="true"></div><div class="viewer-button" data-viewer-action="mix" role="button"></div><div class="viewer-player"></div></div>';
var ct = typeof window < "u" && typeof window.document < "u";
var he = ct ? window : {};
var $e = ct && he.document.documentElement ? "ontouchstart" in he.document.documentElement : false;
var zt = ct ? "PointerEvent" in he : false;
var L = "viewer";
var nt = "move";
var ln = "switch";
var je = "zoom";
var Je = "".concat(L, "-active");
var Bs = "".concat(L, "-close");
var rt = "".concat(L, "-fade");
var Tt = "".concat(L, "-fixed");
var Xs = "".concat(L, "-fullscreen");
var ci = "".concat(L, "-fullscreen-exit");
var _e = "".concat(L, "-hide");
var Ks = "".concat(L, "-hide-md-down");
var Gs = "".concat(L, "-hide-sm-down");
var Zs = "".concat(L, "-hide-xs-down");
var ne = "".concat(L, "-in");
var He = "".concat(L, "-invisible");
var Le = "".concat(L, "-loading");
var Js = "".concat(L, "-move");
var fi = "".concat(L, "-open");
var De = "".concat(L, "-show");
var K = "".concat(L, "-transition");
var Pe = "click";
var Dt = "dblclick";
var hi = "dragstart";
var di = "focusin";
var vi = "keydown";
var re = "load";
var Se = "error";
var Qs = $e ? "touchend touchcancel" : "mouseup";
var eo = $e ? "touchmove" : "mousemove";
var to = $e ? "touchstart" : "mousedown";
var gi = zt ? "pointerdown" : to;
var mi = zt ? "pointermove" : eo;
var pi = zt ? "pointerup pointercancel" : Qs;
var wi = "resize";
var ae = "transitionend";
var yi = "wheel";
var bi = "ready";
var _i = "show";
var Si = "shown";
var Ei = "hide";
var Ti = "hidden";
var Di = "view";
var qe = "viewed";
var Ai = "move";
var Oi = "moved";
var xi = "rotate";
var Mi = "rotated";
var Ci = "scale";
var Ii = "scaled";
var $i = "zoom";
var Li = "zoomed";
var Ri = "play";
var Pi = "stop";
var st = "".concat(L, "Action");
var Ft = /\s\s*/;
var Qe = ["zoom-in", "zoom-out", "one-to-one", "reset", "prev", "play", "next", "rotate-left", "rotate-right", "flip-horizontal", "flip-vertical"];
function Be(t) {
  return typeof t == "string";
}
var io = Number.isNaN || he.isNaN;
function B(t) {
  return typeof t == "number" && !io(t);
}
function xe(t) {
  return typeof t > "u";
}
function Ne(t) {
  return Et(t) === "object" && t !== null;
}
var no = Object.prototype.hasOwnProperty;
function Me(t) {
  if (!Ne(t))
    return false;
  try {
    var e = t.constructor, i = e.prototype;
    return e && i && no.call(i, "isPrototypeOf");
  } catch {
    return false;
  }
}
function Y(t) {
  return typeof t == "function";
}
function H(t, e) {
  if (t && Y(e))
    if (Array.isArray(t) || B(t.length)) {
      var i = t.length, n;
      for (n = 0; n < i && e.call(t, t[n], n, t) !== false; n += 1)
        ;
    } else Ne(t) && Object.keys(t).forEach(function(r) {
      e.call(t, t[r], r, t);
    });
  return t;
}
var te = Object.assign || function(e) {
  for (var i = arguments.length, n = new Array(i > 1 ? i - 1 : 0), r = 1; r < i; r++)
    n[r - 1] = arguments[r];
  return Ne(e) && n.length > 0 && n.forEach(function(a) {
    Ne(a) && Object.keys(a).forEach(function(s) {
      e[s] = a[s];
    });
  }), e;
};
var ro = /^(?:width|height|left|top|marginLeft|marginTop)$/;
function se(t, e) {
  var i = t.style;
  H(e, function(n, r) {
    ro.test(r) && B(n) && (n += "px"), i[r] = n;
  });
}
function ao(t) {
  return Be(t) ? t.replace(/&(?!amp;|quot;|#39;|lt;|gt;)/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : t;
}
function Ae(t, e) {
  return !t || !e ? false : t.classList ? t.classList.contains(e) : t.className.indexOf(e) > -1;
}
function M(t, e) {
  if (!(!t || !e)) {
    if (B(t.length)) {
      H(t, function(n) {
        M(n, e);
      });
      return;
    }
    if (t.classList) {
      t.classList.add(e);
      return;
    }
    var i = t.className.trim();
    i ? i.indexOf(e) < 0 && (t.className = "".concat(i, " ").concat(e)) : t.className = e;
  }
}
function z(t, e) {
  if (!(!t || !e)) {
    if (B(t.length)) {
      H(t, function(i) {
        z(i, e);
      });
      return;
    }
    if (t.classList) {
      t.classList.remove(e);
      return;
    }
    t.className.indexOf(e) >= 0 && (t.className = t.className.replace(e, ""));
  }
}
function Xe(t, e, i) {
  if (e) {
    if (B(t.length)) {
      H(t, function(n) {
        Xe(n, e, i);
      });
      return;
    }
    i ? M(t, e) : z(t, e);
  }
}
var so = /([a-z\d])([A-Z])/g;
function Yt(t) {
  return t.replace(so, "$1-$2").toLowerCase();
}
function Ce(t, e) {
  return Ne(t[e]) ? t[e] : t.dataset ? t.dataset[e] : t.getAttribute("data-".concat(Yt(e)));
}
function At(t, e, i) {
  Ne(i) ? t[e] = i : t.dataset ? t.dataset[e] = i : t.setAttribute("data-".concat(Yt(e)), i);
}
var un = function() {
  var t = false;
  if (ct) {
    var e = false, i = function() {
    }, n = Object.defineProperty({}, "once", {
      get: function() {
        return t = true, e;
      },
      /**
       * This setter can fix a `TypeError` in strict mode
       * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Getter_only}
       * @param {boolean} value - The value to set
       */
      set: function(a) {
        e = a;
      }
    });
    he.addEventListener("test", i, n), he.removeEventListener("test", i, n);
  }
  return t;
}();
function j(t, e, i) {
  var n = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, r = i;
  e.trim().split(Ft).forEach(function(a) {
    if (!un) {
      var s = t.listeners;
      s && s[a] && s[a][i] && (r = s[a][i], delete s[a][i], Object.keys(s[a]).length === 0 && delete s[a], Object.keys(s).length === 0 && delete t.listeners);
    }
    t.removeEventListener(a, r, n);
  });
}
function C(t, e, i) {
  var n = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, r = i;
  e.trim().split(Ft).forEach(function(a) {
    if (n.once && !un) {
      var s = t.listeners, u = s === void 0 ? {} : s;
      r = function() {
        delete u[a][i], t.removeEventListener(a, r, n);
        for (var f = arguments.length, c = new Array(f), l = 0; l < f; l++)
          c[l] = arguments[l];
        i.apply(t, c);
      }, u[a] || (u[a] = {}), u[a][i] && t.removeEventListener(a, u[a][i], n), u[a][i] = r, t.listeners = u;
    }
    t.addEventListener(a, r, n);
  });
}
function G(t, e, i, n) {
  var r;
  return Y(Event) && Y(CustomEvent) ? r = new CustomEvent(e, Nt({
    bubbles: true,
    cancelable: true,
    detail: i
  }, n)) : (r = document.createEvent("CustomEvent"), r.initCustomEvent(e, true, true, i)), t.dispatchEvent(r);
}
function oo(t) {
  var e = t.getBoundingClientRect();
  return {
    left: e.left + (window.pageXOffset - document.documentElement.clientLeft),
    top: e.top + (window.pageYOffset - document.documentElement.clientTop)
  };
}
function at(t) {
  var e = t.rotate, i = t.scaleX, n = t.scaleY, r = t.translateX, a = t.translateY, s = [];
  B(r) && r !== 0 && s.push("translateX(".concat(r, "px)")), B(a) && a !== 0 && s.push("translateY(".concat(a, "px)")), B(e) && e !== 0 && s.push("rotate(".concat(e, "deg)")), B(i) && i !== 1 && s.push("scaleX(".concat(i, ")")), B(n) && n !== 1 && s.push("scaleY(".concat(n, ")"));
  var u = s.length ? s.join(" ") : "none";
  return {
    WebkitTransform: u,
    msTransform: u,
    transform: u
  };
}
function lo(t) {
  return Be(t) ? decodeURIComponent(t.replace(/^.*\//, "").replace(/[?&#].*$/, "")) : "";
}
var wt = he.navigator && /Version\/\d+(\.\d+)+?\s+Safari/i.test(he.navigator.userAgent);
function cn(t, e, i) {
  var n = document.createElement("img");
  if (t.naturalWidth && !wt)
    return i(t.naturalWidth, t.naturalHeight), n;
  var r = document.body || document.documentElement;
  return n.onload = function() {
    i(n.width, n.height), wt || r.removeChild(n);
  }, H(e.inheritedAttributes, function(a) {
    var s = t.getAttribute(a);
    s !== null && n.setAttribute(a, s);
  }), n.src = t.src, wt || (n.style.cssText = "left:0;max-height:none!important;max-width:none!important;min-height:0!important;min-width:0!important;opacity:0;position:absolute;top:0;z-index:-1;", r.appendChild(n)), n;
}
function et(t) {
  switch (t) {
    case 2:
      return Zs;
    case 3:
      return Gs;
    case 4:
      return Ks;
    default:
      return "";
  }
}
function uo(t) {
  var e = Nt({}, t), i = [];
  return H(t, function(n, r) {
    delete e[r], H(e, function(a) {
      var s = Math.abs(n.startX - a.startX), u = Math.abs(n.startY - a.startY), o = Math.abs(n.endX - a.endX), f = Math.abs(n.endY - a.endY), c = Math.sqrt(s * s + u * u), l = Math.sqrt(o * o + f * f), d = (l - c) / c;
      i.push(d);
    });
  }), i.sort(function(n, r) {
    return Math.abs(n) < Math.abs(r);
  }), i[0];
}
function tt(t, e) {
  var i = t.pageX, n = t.pageY, r = {
    endX: i,
    endY: n
  };
  return e ? r : Nt({
    timeStamp: Date.now(),
    startX: i,
    startY: n
  }, r);
}
function co(t) {
  var e = 0, i = 0, n = 0;
  return H(t, function(r) {
    var a = r.startX, s = r.startY;
    e += a, i += s, n += 1;
  }), e /= n, i /= n, {
    pageX: e,
    pageY: i
  };
}
var fo = {
  render: function() {
    this.initContainer(), this.initViewer(), this.initList(), this.renderViewer();
  },
  initBody: function() {
    var e = this.element.ownerDocument, i = e.body || e.documentElement;
    this.body = i, this.scrollbarWidth = window.innerWidth - e.documentElement.clientWidth, this.initialBodyPaddingRight = i.style.paddingRight, this.initialBodyComputedPaddingRight = window.getComputedStyle(i).paddingRight;
  },
  initContainer: function() {
    this.containerData = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  },
  initViewer: function() {
    var e = this.options, i = this.parent, n;
    e.inline && (n = {
      width: Math.max(i.offsetWidth, e.minWidth),
      height: Math.max(i.offsetHeight, e.minHeight)
    }, this.parentData = n), (this.fulled || !n) && (n = this.containerData), this.viewerData = te({}, n);
  },
  renderViewer: function() {
    this.options.inline && !this.fulled && se(this.viewer, this.viewerData);
  },
  initList: function() {
    var e = this, i = this.element, n = this.options, r = this.list, a = [];
    r.innerHTML = "", H(this.images, function(s, u) {
      var o = s.src, f = s.alt || lo(o), c = e.getImageURL(s);
      if (o || c) {
        var l = document.createElement("li"), d = document.createElement("img");
        H(n.inheritedAttributes, function(b) {
          var h = s.getAttribute(b);
          h !== null && d.setAttribute(b, h);
        }), n.navbar && (d.src = o || c), d.alt = f, d.setAttribute("data-original-url", c || o), l.setAttribute("data-index", u), l.setAttribute("data-viewer-action", "view"), l.setAttribute("role", "button"), n.keyboard && l.setAttribute("tabindex", 0), l.appendChild(d), r.appendChild(l), a.push(l);
      }
    }), this.items = a, H(a, function(s) {
      var u = s.firstElementChild, o, f;
      At(u, "filled", true), n.loading && M(s, Le), C(u, re, o = function(l) {
        j(u, Se, f), n.loading && z(s, Le), e.loadImage(l);
      }, {
        once: true
      }), C(u, Se, f = function() {
        j(u, re, o), n.loading && z(s, Le);
      }, {
        once: true
      });
    }), n.transition && C(i, qe, function() {
      M(r, K);
    }, {
      once: true
    });
  },
  renderList: function() {
    var e = this.index, i = this.items[e];
    if (i) {
      var n = i.nextElementSibling, r = parseInt(window.getComputedStyle(n || i).marginLeft, 10), a = i.offsetWidth, s = a + r;
      se(this.list, te({
        width: s * this.length - r
      }, at({
        translateX: (this.viewerData.width - a) / 2 - s * e
      })));
    }
  },
  resetList: function() {
    var e = this.list;
    e.innerHTML = "", z(e, K), se(e, at({
      translateX: 0
    }));
  },
  initImage: function(e) {
    var i = this, n = this.options, r = this.image, a = this.viewerData, s = this.footer.offsetHeight, u = a.width, o = Math.max(a.height - s, s), f = this.imageData || {}, c;
    this.imageInitializing = {
      abort: function() {
        c.onload = null;
      }
    }, c = cn(r, n, function(l, d) {
      var b = l / d, h = Math.max(0, Math.min(1, n.initialCoverage)), E = u, g = o;
      i.imageInitializing = false, o * b > u ? g = u / b : E = o * b, h = B(h) ? h : 0.9, E = Math.min(E * h, l), g = Math.min(g * h, d);
      var m = (u - E) / 2, _ = (o - g) / 2, S = {
        left: m,
        top: _,
        x: m,
        y: _,
        width: E,
        height: g,
        oldRatio: 1,
        ratio: E / l,
        aspectRatio: b,
        naturalWidth: l,
        naturalHeight: d
      }, P = te({}, S);
      n.rotatable && (S.rotate = f.rotate || 0, P.rotate = 0), n.scalable && (S.scaleX = f.scaleX || 1, S.scaleY = f.scaleY || 1, P.scaleX = 1, P.scaleY = 1), i.imageData = S, i.initialImageData = P, e && e();
    });
  },
  renderImage: function(e) {
    var i = this, n = this.image, r = this.imageData;
    if (se(n, te({
      width: r.width,
      height: r.height,
      // XXX: Not to use translateX/Y to avoid image shaking when zooming
      marginLeft: r.x,
      marginTop: r.y
    }, at(r))), e)
      if ((this.viewing || this.moving || this.rotating || this.scaling || this.zooming) && this.options.transition && Ae(n, K)) {
        var a = function() {
          i.imageRendering = false, e();
        };
        this.imageRendering = {
          abort: function() {
            j(n, ae, a);
          }
        }, C(n, ae, a, {
          once: true
        });
      } else
        e();
  },
  resetImage: function() {
    var e = this.image;
    e && (this.viewing && this.viewing.abort(), e.parentNode.removeChild(e), this.image = null, this.title.innerHTML = "");
  }
};
var ho = {
  bind: function() {
    var e = this.options, i = this.viewer, n = this.canvas, r = this.element.ownerDocument;
    C(i, Pe, this.onClick = this.click.bind(this)), C(i, hi, this.onDragStart = this.dragstart.bind(this)), C(n, gi, this.onPointerDown = this.pointerdown.bind(this)), C(r, mi, this.onPointerMove = this.pointermove.bind(this)), C(r, pi, this.onPointerUp = this.pointerup.bind(this)), C(r, vi, this.onKeyDown = this.keydown.bind(this)), C(window, wi, this.onResize = this.resize.bind(this)), e.zoomable && e.zoomOnWheel && C(i, yi, this.onWheel = this.wheel.bind(this), {
      passive: false,
      capture: true
    }), e.toggleOnDblclick && C(n, Dt, this.onDblclick = this.dblclick.bind(this));
  },
  unbind: function() {
    var e = this.options, i = this.viewer, n = this.canvas, r = this.element.ownerDocument;
    j(i, Pe, this.onClick), j(i, hi, this.onDragStart), j(n, gi, this.onPointerDown), j(r, mi, this.onPointerMove), j(r, pi, this.onPointerUp), j(r, vi, this.onKeyDown), j(window, wi, this.onResize), e.zoomable && e.zoomOnWheel && j(i, yi, this.onWheel, {
      passive: false,
      capture: true
    }), e.toggleOnDblclick && j(n, Dt, this.onDblclick);
  }
};
var vo = {
  click: function(e) {
    var i = this.options, n = this.imageData, r = e.target, a = Ce(r, st);
    switch (!a && r.localName === "img" && r.parentElement.localName === "li" && (r = r.parentElement, a = Ce(r, st)), $e && e.isTrusted && r === this.canvas && clearTimeout(this.clickCanvasTimeout), a) {
      case "mix":
        this.played ? this.stop() : i.inline ? this.fulled ? this.exit() : this.full() : this.hide();
        break;
      case "hide":
        this.pointerMoved || this.hide();
        break;
      case "view":
        this.view(Ce(r, "index"));
        break;
      case "zoom-in":
        this.zoom(0.1, true);
        break;
      case "zoom-out":
        this.zoom(-0.1, true);
        break;
      case "one-to-one":
        this.toggle();
        break;
      case "reset":
        this.reset();
        break;
      case "prev":
        this.prev(i.loop);
        break;
      case "play":
        this.play(i.fullscreen);
        break;
      case "next":
        this.next(i.loop);
        break;
      case "rotate-left":
        this.rotate(-90);
        break;
      case "rotate-right":
        this.rotate(90);
        break;
      case "flip-horizontal":
        this.scaleX(-n.scaleX || -1);
        break;
      case "flip-vertical":
        this.scaleY(-n.scaleY || -1);
        break;
      default:
        this.played && this.stop();
    }
  },
  dblclick: function(e) {
    e.preventDefault(), this.viewed && e.target === this.image && ($e && e.isTrusted && clearTimeout(this.doubleClickImageTimeout), this.toggle(e.isTrusted ? e : e.detail && e.detail.originalEvent));
  },
  load: function() {
    var e = this;
    this.timeout && (clearTimeout(this.timeout), this.timeout = false);
    var i = this.element, n = this.options, r = this.image, a = this.index, s = this.viewerData;
    z(r, He), n.loading && z(this.canvas, Le), r.style.cssText = "height:0;" + "margin-left:".concat(s.width / 2, "px;") + "margin-top:".concat(s.height / 2, "px;") + "max-width:none!important;position:relative;width:0;", this.initImage(function() {
      Xe(r, Js, n.movable), Xe(r, K, n.transition), e.renderImage(function() {
        e.viewed = true, e.viewing = false, Y(n.viewed) && C(i, qe, n.viewed, {
          once: true
        }), G(i, qe, {
          originalImage: e.images[a],
          index: a,
          image: r
        }, {
          cancelable: false
        });
      });
    });
  },
  loadImage: function(e) {
    var i = e.target, n = i.parentNode, r = n.offsetWidth || 30, a = n.offsetHeight || 50, s = !!Ce(i, "filled");
    cn(i, this.options, function(u, o) {
      var f = u / o, c = r, l = a;
      a * f > r ? s ? c = a * f : l = r / f : s ? l = r / f : c = a * f, se(i, te({
        width: c,
        height: l
      }, at({
        translateX: (r - c) / 2,
        translateY: (a - l) / 2
      })));
    });
  },
  keydown: function(e) {
    var i = this.options;
    if (i.keyboard) {
      var n = e.keyCode || e.which || e.charCode;
      switch (n) {
        case 13:
          this.viewer.contains(e.target) && this.click(e);
          break;
      }
      if (this.fulled)
        switch (n) {
          case 27:
            this.played ? this.stop() : i.inline ? this.fulled && this.exit() : this.hide();
            break;
          case 32:
            this.played && this.stop();
            break;
          case 37:
            this.played && this.playing ? this.playing.prev() : this.prev(i.loop);
            break;
          case 38:
            e.preventDefault(), this.zoom(i.zoomRatio, true);
            break;
          case 39:
            this.played && this.playing ? this.playing.next() : this.next(i.loop);
            break;
          case 40:
            e.preventDefault(), this.zoom(-i.zoomRatio, true);
            break;
          case 48:
          case 49:
            e.ctrlKey && (e.preventDefault(), this.toggle());
            break;
        }
    }
  },
  dragstart: function(e) {
    e.target.localName === "img" && e.preventDefault();
  },
  pointerdown: function(e) {
    var i = this.options, n = this.pointers, r = e.buttons, a = e.button;
    if (this.pointerMoved = false, !(!this.viewed || this.showing || this.viewing || this.hiding || (e.type === "mousedown" || e.type === "pointerdown" && e.pointerType === "mouse") && // No primary button (Usually the left button)
    (B(r) && r !== 1 || B(a) && a !== 0 || e.ctrlKey))) {
      e.preventDefault(), e.changedTouches ? H(e.changedTouches, function(u) {
        n[u.identifier] = tt(u);
      }) : n[e.pointerId || 0] = tt(e);
      var s = i.movable ? nt : false;
      i.zoomOnTouch && i.zoomable && Object.keys(n).length > 1 ? s = je : i.slideOnTouch && (e.pointerType === "touch" || e.type === "touchstart") && this.isSwitchable() && (s = ln), i.transition && (s === nt || s === je) && z(this.image, K), this.action = s;
    }
  },
  pointermove: function(e) {
    var i = this.pointers, n = this.action;
    !this.viewed || !n || (e.preventDefault(), e.changedTouches ? H(e.changedTouches, function(r) {
      te(i[r.identifier] || {}, tt(r, true));
    }) : te(i[e.pointerId || 0] || {}, tt(e, true)), this.change(e));
  },
  pointerup: function(e) {
    var i = this, n = this.options, r = this.action, a = this.pointers, s;
    e.changedTouches ? H(e.changedTouches, function(u) {
      s = a[u.identifier], delete a[u.identifier];
    }) : (s = a[e.pointerId || 0], delete a[e.pointerId || 0]), r && (e.preventDefault(), n.transition && (r === nt || r === je) && M(this.image, K), this.action = false, $e && r !== je && s && Date.now() - s.timeStamp < 500 && (clearTimeout(this.clickCanvasTimeout), clearTimeout(this.doubleClickImageTimeout), n.toggleOnDblclick && this.viewed && e.target === this.image ? this.imageClicked ? (this.imageClicked = false, this.doubleClickImageTimeout = setTimeout(function() {
      G(i.image, Dt, {
        originalEvent: e
      });
    }, 50)) : (this.imageClicked = true, this.doubleClickImageTimeout = setTimeout(function() {
      i.imageClicked = false;
    }, 500)) : (this.imageClicked = false, n.backdrop && n.backdrop !== "static" && e.target === this.canvas && (this.clickCanvasTimeout = setTimeout(function() {
      G(i.canvas, Pe, {
        originalEvent: e
      });
    }, 50)))));
  },
  resize: function() {
    var e = this;
    if (!(!this.isShown || this.hiding) && (this.fulled && (this.close(), this.initBody(), this.open()), this.initContainer(), this.initViewer(), this.renderViewer(), this.renderList(), this.viewed && this.initImage(function() {
      e.renderImage();
    }), this.played)) {
      if (this.options.fullscreen && this.fulled && !(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement)) {
        this.stop();
        return;
      }
      H(this.player.getElementsByTagName("img"), function(i) {
        C(i, re, e.loadImage.bind(e), {
          once: true
        }), G(i, re);
      });
    }
  },
  wheel: function(e) {
    var i = this;
    if (this.viewed && (e.preventDefault(), !this.wheeling)) {
      this.wheeling = true, setTimeout(function() {
        i.wheeling = false;
      }, 50);
      var n = Number(this.options.zoomRatio) || 0.1, r = 1;
      e.deltaY ? r = e.deltaY > 0 ? 1 : -1 : e.wheelDelta ? r = -e.wheelDelta / 120 : e.detail && (r = e.detail > 0 ? 1 : -1), this.zoom(-r * n, true, null, e);
    }
  }
};
var go = {
  /** Show the viewer (only available in modal mode)
   * @param {boolean} [immediate=false] - Indicates if show the viewer immediately or not.
   * @returns {Viewer} this
   */
  show: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false, i = this.element, n = this.options;
    if (n.inline || this.showing || this.isShown || this.showing)
      return this;
    if (!this.ready)
      return this.build(), this.ready && this.show(e), this;
    if (Y(n.show) && C(i, _i, n.show, {
      once: true
    }), G(i, _i) === false || !this.ready)
      return this;
    this.hiding && this.transitioning.abort(), this.showing = true, this.open();
    var r = this.viewer;
    if (z(r, _e), r.setAttribute("role", "dialog"), r.setAttribute("aria-labelledby", this.title.id), r.setAttribute("aria-modal", true), r.removeAttribute("aria-hidden"), n.transition && !e) {
      var a = this.shown.bind(this);
      this.transitioning = {
        abort: function() {
          j(r, ae, a), z(r, ne);
        }
      }, M(r, K), r.initialOffsetWidth = r.offsetWidth, C(r, ae, a, {
        once: true
      }), M(r, ne);
    } else
      M(r, ne), this.shown();
    return this;
  },
  /**
   * Hide the viewer (only available in modal mode)
   * @param {boolean} [immediate=false] - Indicates if hide the viewer immediately or not.
   * @returns {Viewer} this
   */
  hide: function() {
    var e = this, i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false, n = this.element, r = this.options;
    if (r.inline || this.hiding || !(this.isShown || this.showing))
      return this;
    if (Y(r.hide) && C(n, Ei, r.hide, {
      once: true
    }), G(n, Ei) === false)
      return this;
    this.showing && this.transitioning.abort(), this.hiding = true, this.played ? this.stop() : this.viewing && this.viewing.abort();
    var a = this.viewer, s = this.image, u = function() {
      z(a, ne), e.hidden();
    };
    if (r.transition && !i) {
      var o = function(l) {
        l && l.target === a && (j(a, ae, o), e.hidden());
      }, f = function() {
        Ae(a, K) ? (C(a, ae, o), z(a, ne)) : u();
      };
      this.transitioning = {
        abort: function() {
          e.viewed && Ae(s, K) ? j(s, ae, f) : Ae(a, K) && j(a, ae, o);
        }
      }, this.viewed && Ae(s, K) ? (C(s, ae, f, {
        once: true
      }), this.zoomTo(0, false, null, null, true)) : f();
    } else
      u();
    return this;
  },
  /**
   * View one of the images with image's index
   * @param {number} index - The index of the image to view.
   * @returns {Viewer} this
   */
  view: function() {
    var e = this, i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.options.initialViewIndex;
    if (i = Number(i) || 0, this.hiding || this.played || i < 0 || i >= this.length || this.viewed && i === this.index)
      return this;
    if (!this.isShown)
      return this.index = i, this.show();
    this.viewing && this.viewing.abort();
    var n = this.element, r = this.options, a = this.title, s = this.canvas, u = this.items[i], o = u.querySelector("img"), f = Ce(o, "originalUrl"), c = o.getAttribute("alt"), l = document.createElement("img");
    if (H(r.inheritedAttributes, function(g) {
      var m = o.getAttribute(g);
      m !== null && l.setAttribute(g, m);
    }), l.src = f, l.alt = c, Y(r.view) && C(n, Di, r.view, {
      once: true
    }), G(n, Di, {
      originalImage: this.images[i],
      index: i,
      image: l
    }) === false || !this.isShown || this.hiding || this.played)
      return this;
    var d = this.items[this.index];
    d && (z(d, Je), d.removeAttribute("aria-selected")), M(u, Je), u.setAttribute("aria-selected", true), r.focus && u.focus(), this.image = l, this.viewed = false, this.index = i, this.imageData = {}, M(l, He), r.loading && M(s, Le), s.innerHTML = "", s.appendChild(l), this.renderList(), a.innerHTML = "";
    var b = function() {
      var m = e.imageData, _ = Array.isArray(r.title) ? r.title[1] : r.title;
      a.innerHTML = ao(Y(_) ? _.call(e, l, m) : "".concat(c, " (").concat(m.naturalWidth, " × ").concat(m.naturalHeight, ")"));
    }, h, E;
    return C(n, qe, b, {
      once: true
    }), this.viewing = {
      abort: function() {
        j(n, qe, b), l.complete ? e.imageRendering ? e.imageRendering.abort() : e.imageInitializing && e.imageInitializing.abort() : (l.src = "", j(l, re, h), e.timeout && clearTimeout(e.timeout));
      }
    }, l.complete ? this.load() : (C(l, re, h = function() {
      j(l, Se, E), e.load();
    }, {
      once: true
    }), C(l, Se, E = function() {
      j(l, re, h), e.timeout && (clearTimeout(e.timeout), e.timeout = false), z(l, He), r.loading && z(e.canvas, Le);
    }, {
      once: true
    }), this.timeout && clearTimeout(this.timeout), this.timeout = setTimeout(function() {
      z(l, He), e.timeout = false;
    }, 1e3)), this;
  },
  /**
   * View the previous image
   * @param {boolean} [loop=false] - Indicate if view the last one
   * when it is the first one at present.
   * @returns {Viewer} this
   */
  prev: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false, i = this.index - 1;
    return i < 0 && (i = e ? this.length - 1 : 0), this.view(i), this;
  },
  /**
   * View the next image
   * @param {boolean} [loop=false] - Indicate if view the first one
   * when it is the last one at present.
   * @returns {Viewer} this
   */
  next: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false, i = this.length - 1, n = this.index + 1;
    return n > i && (n = e ? 0 : i), this.view(n), this;
  },
  /**
   * Move the image with relative offsets.
   * @param {number} x - The moving distance in the horizontal direction.
   * @param {number} [y=x] The moving distance in the vertical direction.
   * @returns {Viewer} this
   */
  move: function(e) {
    var i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e, n = this.imageData;
    return this.moveTo(xe(e) ? e : n.x + Number(e), xe(i) ? i : n.y + Number(i)), this;
  },
  /**
   * Move the image to an absolute point.
   * @param {number} x - The new position in the horizontal direction.
   * @param {number} [y=x] - The new position in the vertical direction.
   * @param {Event} [_originalEvent=null] - The original event if any.
   * @returns {Viewer} this
   */
  moveTo: function(e) {
    var i = this, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e, r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null, a = this.element, s = this.options, u = this.imageData;
    if (e = Number(e), n = Number(n), this.viewed && !this.played && s.movable) {
      var o = u.x, f = u.y, c = false;
      if (B(e) ? c = true : e = o, B(n) ? c = true : n = f, c) {
        if (Y(s.move) && C(a, Ai, s.move, {
          once: true
        }), G(a, Ai, {
          x: e,
          y: n,
          oldX: o,
          oldY: f,
          originalEvent: r
        }) === false)
          return this;
        u.x = e, u.y = n, u.left = e, u.top = n, this.moving = true, this.renderImage(function() {
          i.moving = false, Y(s.moved) && C(a, Oi, s.moved, {
            once: true
          }), G(a, Oi, {
            x: e,
            y: n,
            oldX: o,
            oldY: f,
            originalEvent: r
          }, {
            cancelable: false
          });
        });
      }
    }
    return this;
  },
  /**
   * Rotate the image with a relative degree.
   * @param {number} degree - The rotate degree.
   * @returns {Viewer} this
   */
  rotate: function(e) {
    return this.rotateTo((this.imageData.rotate || 0) + Number(e)), this;
  },
  /**
   * Rotate the image to an absolute degree.
   * @param {number} degree - The rotate degree.
   * @returns {Viewer} this
   */
  rotateTo: function(e) {
    var i = this, n = this.element, r = this.options, a = this.imageData;
    if (e = Number(e), B(e) && this.viewed && !this.played && r.rotatable) {
      var s = a.rotate;
      if (Y(r.rotate) && C(n, xi, r.rotate, {
        once: true
      }), G(n, xi, {
        degree: e,
        oldDegree: s
      }) === false)
        return this;
      a.rotate = e, this.rotating = true, this.renderImage(function() {
        i.rotating = false, Y(r.rotated) && C(n, Mi, r.rotated, {
          once: true
        }), G(n, Mi, {
          degree: e,
          oldDegree: s
        }, {
          cancelable: false
        });
      });
    }
    return this;
  },
  /**
   * Scale the image on the x-axis.
   * @param {number} scaleX - The scale ratio on the x-axis.
   * @returns {Viewer} this
   */
  scaleX: function(e) {
    return this.scale(e, this.imageData.scaleY), this;
  },
  /**
   * Scale the image on the y-axis.
   * @param {number} scaleY - The scale ratio on the y-axis.
   * @returns {Viewer} this
   */
  scaleY: function(e) {
    return this.scale(this.imageData.scaleX, e), this;
  },
  /**
   * Scale the image.
   * @param {number} scaleX - The scale ratio on the x-axis.
   * @param {number} [scaleY=scaleX] - The scale ratio on the y-axis.
   * @returns {Viewer} this
   */
  scale: function(e) {
    var i = this, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e, r = this.element, a = this.options, s = this.imageData;
    if (e = Number(e), n = Number(n), this.viewed && !this.played && a.scalable) {
      var u = s.scaleX, o = s.scaleY, f = false;
      if (B(e) ? f = true : e = u, B(n) ? f = true : n = o, f) {
        if (Y(a.scale) && C(r, Ci, a.scale, {
          once: true
        }), G(r, Ci, {
          scaleX: e,
          scaleY: n,
          oldScaleX: u,
          oldScaleY: o
        }) === false)
          return this;
        s.scaleX = e, s.scaleY = n, this.scaling = true, this.renderImage(function() {
          i.scaling = false, Y(a.scaled) && C(r, Ii, a.scaled, {
            once: true
          }), G(r, Ii, {
            scaleX: e,
            scaleY: n,
            oldScaleX: u,
            oldScaleY: o
          }, {
            cancelable: false
          });
        });
      }
    }
    return this;
  },
  /**
   * Zoom the image with a relative ratio.
   * @param {number} ratio - The target ratio.
   * @param {boolean} [showTooltip=false] - Indicates whether to show the tooltip.
   * @param {Object} [pivot] - The pivot point coordinate for zooming.
   * @param {Event} [_originalEvent=null] - The original event if any.
   * @returns {Viewer} this
   */
  zoom: function(e) {
    var i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false, n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null, r = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null, a = this.imageData;
    return e = Number(e), e < 0 ? e = 1 / (1 - e) : e = 1 + e, this.zoomTo(a.width * e / a.naturalWidth, i, n, r), this;
  },
  /**
   * Zoom the image to an absolute ratio.
   * @param {number} ratio - The target ratio.
   * @param {boolean} [showTooltip] - Indicates whether to show the tooltip.
   * @param {Object} [pivot] - The pivot point coordinate for zooming.
   * @param {Event} [_originalEvent=null] - The original event if any.
   * @param {Event} [_zoomable=false] - Indicates if the current zoom is available or not.
   * @returns {Viewer} this
   */
  zoomTo: function(e) {
    var i = this, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false, r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null, a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null, s = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : false, u = this.element, o = this.options, f = this.pointers, c = this.imageData, l = c.x, d = c.y, b = c.width, h = c.height, E = c.naturalWidth, g = c.naturalHeight;
    if (e = Math.max(0, e), B(e) && this.viewed && !this.played && (s || o.zoomable)) {
      if (!s) {
        var m = Math.max(0.01, o.minZoomRatio), _ = Math.min(100, o.maxZoomRatio);
        e = Math.min(Math.max(e, m), _);
      }
      if (a)
        switch (a.type) {
          case "wheel":
            o.zoomRatio >= 0.055 && e > 0.95 && e < 1.05 && (e = 1);
            break;
          case "pointermove":
          case "touchmove":
          case "mousemove":
            e > 0.99 && e < 1.01 && (e = 1);
            break;
        }
      var S = E * e, P = g * e, N = S - b, F = P - h, X = c.ratio;
      if (Y(o.zoom) && C(u, $i, o.zoom, {
        once: true
      }), G(u, $i, {
        ratio: e,
        oldRatio: X,
        originalEvent: a
      }) === false)
        return this;
      if (this.zooming = true, a) {
        var W = oo(this.viewer), R = f && Object.keys(f).length > 0 ? co(f) : {
          pageX: a.pageX,
          pageY: a.pageY
        };
        c.x -= N * ((R.pageX - W.left - l) / b), c.y -= F * ((R.pageY - W.top - d) / h);
      } else Me(r) && B(r.x) && B(r.y) ? (c.x -= N * ((r.x - l) / b), c.y -= F * ((r.y - d) / h)) : (c.x -= N / 2, c.y -= F / 2);
      c.left = c.x, c.top = c.y, c.width = S, c.height = P, c.oldRatio = X, c.ratio = e, this.renderImage(function() {
        i.zooming = false, Y(o.zoomed) && C(u, Li, o.zoomed, {
          once: true
        }), G(u, Li, {
          ratio: e,
          oldRatio: X,
          originalEvent: a
        }, {
          cancelable: false
        });
      }), n && this.tooltip();
    }
    return this;
  },
  /**
   * Play the images
   * @param {boolean|FullscreenOptions} [fullscreen=false] - Indicate if request fullscreen or not.
   * @returns {Viewer} this
   */
  play: function() {
    var e = this, i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
    if (!this.isShown || this.played)
      return this;
    var n = this.element, r = this.options;
    if (Y(r.play) && C(n, Ri, r.play, {
      once: true
    }), G(n, Ri) === false)
      return this;
    var a = this.player, s = this.loadImage.bind(this), u = [], o = 0, f = 0;
    if (this.played = true, this.onLoadWhenPlay = s, i && this.requestFullscreen(i), M(a, De), H(this.items, function(d, b) {
      var h = d.querySelector("img"), E = document.createElement("img");
      E.src = Ce(h, "originalUrl"), E.alt = h.getAttribute("alt"), E.referrerPolicy = h.referrerPolicy, o += 1, M(E, rt), Xe(E, K, r.transition), Ae(d, Je) && (M(E, ne), f = b), u.push(E), C(E, re, s, {
        once: true
      }), a.appendChild(E);
    }), B(r.interval) && r.interval > 0) {
      var c = function() {
        clearTimeout(e.playing.timeout), z(u[f], ne), f -= 1, f = f >= 0 ? f : o - 1, M(u[f], ne), e.playing.timeout = setTimeout(c, r.interval);
      }, l = function() {
        clearTimeout(e.playing.timeout), z(u[f], ne), f += 1, f = f < o ? f : 0, M(u[f], ne), e.playing.timeout = setTimeout(l, r.interval);
      };
      o > 1 && (this.playing = {
        prev: c,
        next: l,
        timeout: setTimeout(l, r.interval)
      });
    }
    return this;
  },
  // Stop play
  stop: function() {
    var e = this;
    if (!this.played)
      return this;
    var i = this.element, n = this.options;
    if (Y(n.stop) && C(i, Pi, n.stop, {
      once: true
    }), G(i, Pi) === false)
      return this;
    var r = this.player;
    return clearTimeout(this.playing.timeout), this.playing = false, this.played = false, H(r.getElementsByTagName("img"), function(a) {
      j(a, re, e.onLoadWhenPlay);
    }), z(r, De), r.innerHTML = "", this.exitFullscreen(), this;
  },
  // Enter modal mode (only available in inline mode)
  full: function() {
    var e = this, i = this.options, n = this.viewer, r = this.image, a = this.list;
    return !this.isShown || this.played || this.fulled || !i.inline ? this : (this.fulled = true, this.open(), M(this.button, ci), i.transition && (z(a, K), this.viewed && z(r, K)), M(n, Tt), n.setAttribute("role", "dialog"), n.setAttribute("aria-labelledby", this.title.id), n.setAttribute("aria-modal", true), n.removeAttribute("style"), se(n, {
      zIndex: i.zIndex
    }), i.focus && this.enforceFocus(), this.initContainer(), this.viewerData = te({}, this.containerData), this.renderList(), this.viewed && this.initImage(function() {
      e.renderImage(function() {
        i.transition && setTimeout(function() {
          M(r, K), M(a, K);
        }, 0);
      });
    }), this);
  },
  // Exit modal mode (only available in inline mode)
  exit: function() {
    var e = this, i = this.options, n = this.viewer, r = this.image, a = this.list;
    return !this.isShown || this.played || !this.fulled || !i.inline ? this : (this.fulled = false, this.close(), z(this.button, ci), i.transition && (z(a, K), this.viewed && z(r, K)), i.focus && this.clearEnforceFocus(), n.removeAttribute("role"), n.removeAttribute("aria-labelledby"), n.removeAttribute("aria-modal"), z(n, Tt), se(n, {
      zIndex: i.zIndexInline
    }), this.viewerData = te({}, this.parentData), this.renderViewer(), this.renderList(), this.viewed && this.initImage(function() {
      e.renderImage(function() {
        i.transition && setTimeout(function() {
          M(r, K), M(a, K);
        }, 0);
      });
    }), this);
  },
  // Show the current ratio of the image with percentage
  tooltip: function() {
    var e = this, i = this.options, n = this.tooltipBox, r = this.imageData;
    return !this.viewed || this.played || !i.tooltip ? this : (n.textContent = "".concat(Math.round(r.ratio * 100), "%"), this.tooltipping ? clearTimeout(this.tooltipping) : i.transition ? (this.fading && G(n, ae), M(n, De), M(n, rt), M(n, K), n.removeAttribute("aria-hidden"), n.initialOffsetWidth = n.offsetWidth, M(n, ne)) : (M(n, De), n.removeAttribute("aria-hidden")), this.tooltipping = setTimeout(function() {
      i.transition ? (C(n, ae, function() {
        z(n, De), z(n, rt), z(n, K), n.setAttribute("aria-hidden", true), e.fading = false;
      }, {
        once: true
      }), z(n, ne), e.fading = true) : (z(n, De), n.setAttribute("aria-hidden", true)), e.tooltipping = false;
    }, 1e3), this);
  },
  /**
   * Toggle the image size between its current size and natural size
   * @param {Event} [_originalEvent=null] - The original event if any.
   * @returns {Viewer} this
   */
  toggle: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
    return this.imageData.ratio === 1 ? this.zoomTo(this.imageData.oldRatio, true, null, e) : this.zoomTo(1, true, null, e), this;
  },
  // Reset the image to its initial state
  reset: function() {
    return this.viewed && !this.played && (this.imageData = te({}, this.initialImageData), this.renderImage()), this;
  },
  // Update viewer when images changed
  update: function() {
    var e = this, i = this.element, n = this.options, r = this.isImg;
    if (r && !i.parentNode)
      return this.destroy();
    var a = [];
    if (H(r ? [i] : i.querySelectorAll("img"), function(f) {
      Y(n.filter) ? n.filter.call(e, f) && a.push(f) : e.getImageURL(f) && a.push(f);
    }), !a.length)
      return this;
    if (this.images = a, this.length = a.length, this.ready) {
      var s = [];
      if (H(this.items, function(f, c) {
        var l = f.querySelector("img"), d = a[c];
        d && l ? (d.src !== l.src || d.alt !== l.alt) && s.push(c) : s.push(c);
      }), se(this.list, {
        width: "auto"
      }), this.initList(), this.isShown)
        if (this.length) {
          if (this.viewed) {
            var u = s.indexOf(this.index);
            if (u >= 0)
              this.viewed = false, this.view(Math.max(Math.min(this.index - u, this.length - 1), 0));
            else {
              var o = this.items[this.index];
              M(o, Je), o.setAttribute("aria-selected", true);
            }
          }
        } else
          this.image = null, this.viewed = false, this.index = 0, this.imageData = {}, this.canvas.innerHTML = "", this.title.innerHTML = "";
    } else
      this.build();
    return this;
  },
  // Destroy the viewer
  destroy: function() {
    var e = this.element, i = this.options;
    return e[L] ? (this.destroyed = true, this.ready ? (this.played && this.stop(), i.inline ? (this.fulled && this.exit(), this.unbind()) : this.isShown ? (this.viewing && (this.imageRendering ? this.imageRendering.abort() : this.imageInitializing && this.imageInitializing.abort()), this.hiding && this.transitioning.abort(), this.hidden()) : this.showing && (this.transitioning.abort(), this.hidden()), this.ready = false, this.viewer.parentNode.removeChild(this.viewer)) : i.inline && (this.delaying ? this.delaying.abort() : this.initializing && this.initializing.abort()), i.inline || j(e, Pe, this.onStart), e[L] = void 0, this) : this;
  }
};
var mo = {
  getImageURL: function(e) {
    var i = this.options.url;
    return Be(i) ? i = e.getAttribute(i) : Y(i) ? i = i.call(this, e) : i = "", i;
  },
  enforceFocus: function() {
    var e = this;
    this.clearEnforceFocus(), C(document, di, this.onFocusin = function(i) {
      var n = e.viewer, r = i.target;
      if (!(r === document || r === n || n.contains(r))) {
        for (; r; ) {
          if (r.getAttribute("tabindex") !== null || r.getAttribute("aria-modal") === "true")
            return;
          r = r.parentElement;
        }
        n.focus();
      }
    });
  },
  clearEnforceFocus: function() {
    this.onFocusin && (j(document, di, this.onFocusin), this.onFocusin = null);
  },
  open: function() {
    var e = this.body;
    M(e, fi), this.scrollbarWidth > 0 && (e.style.paddingRight = "".concat(this.scrollbarWidth + (parseFloat(this.initialBodyComputedPaddingRight) || 0), "px"));
  },
  close: function() {
    var e = this.body;
    z(e, fi), this.scrollbarWidth > 0 && (e.style.paddingRight = this.initialBodyPaddingRight);
  },
  shown: function() {
    var e = this.element, i = this.options, n = this.viewer;
    this.fulled = true, this.isShown = true, this.render(), this.bind(), this.showing = false, i.focus && (n.focus(), this.enforceFocus()), Y(i.shown) && C(e, Si, i.shown, {
      once: true
    }), G(e, Si) !== false && this.ready && this.isShown && !this.hiding && this.view(this.index);
  },
  hidden: function() {
    var e = this.element, i = this.options, n = this.viewer;
    i.fucus && this.clearEnforceFocus(), this.close(), this.unbind(), M(n, _e), n.removeAttribute("role"), n.removeAttribute("aria-labelledby"), n.removeAttribute("aria-modal"), n.setAttribute("aria-hidden", true), this.resetList(), this.resetImage(), this.fulled = false, this.viewed = false, this.isShown = false, this.hiding = false, this.destroyed || (Y(i.hidden) && C(e, Ti, i.hidden, {
      once: true
    }), G(e, Ti, null, {
      cancelable: false
    }));
  },
  requestFullscreen: function(e) {
    var i = this.element.ownerDocument;
    if (this.fulled && !(i.fullscreenElement || i.webkitFullscreenElement || i.mozFullScreenElement || i.msFullscreenElement)) {
      var n = i.documentElement;
      n.requestFullscreen ? Me(e) ? n.requestFullscreen(e) : n.requestFullscreen() : n.webkitRequestFullscreen ? n.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT) : n.mozRequestFullScreen ? n.mozRequestFullScreen() : n.msRequestFullscreen && n.msRequestFullscreen();
    }
  },
  exitFullscreen: function() {
    var e = this.element.ownerDocument;
    this.fulled && (e.fullscreenElement || e.webkitFullscreenElement || e.mozFullScreenElement || e.msFullscreenElement) && (e.exitFullscreen ? e.exitFullscreen() : e.webkitExitFullscreen ? e.webkitExitFullscreen() : e.mozCancelFullScreen ? e.mozCancelFullScreen() : e.msExitFullscreen && e.msExitFullscreen());
  },
  change: function(e) {
    var i = this.options, n = this.pointers, r = n[Object.keys(n)[0]];
    if (r) {
      var a = r.endX - r.startX, s = r.endY - r.startY;
      switch (this.action) {
        case nt:
          (a !== 0 || s !== 0) && (this.pointerMoved = true, this.move(a, s, e));
          break;
        case je:
          this.zoom(uo(n), false, null, e);
          break;
        case ln: {
          this.action = "switched";
          var u = Math.abs(a);
          u > 1 && u > Math.abs(s) && (this.pointers = {}, a > 1 ? this.prev(i.loop) : a < -1 && this.next(i.loop));
          break;
        }
      }
      H(n, function(o) {
        o.startX = o.endX, o.startY = o.endY;
      });
    }
  },
  isSwitchable: function() {
    var e = this.imageData, i = this.viewerData;
    return this.length > 1 && e.x >= 0 && e.y >= 0 && e.width <= i.width && e.height <= i.height;
  }
};
var po = he.Viewer;
var wo = /* @__PURE__ */ function(t) {
  return function() {
    return t += 1, t;
  };
}(-1);
var fn = function() {
  function t(e) {
    var i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (Hs(this, t), !e || e.nodeType !== 1)
      throw new Error("The first argument is required and must be an element.");
    this.element = e, this.options = te({}, ui, Me(i) && i), this.action = false, this.fading = false, this.fulled = false, this.hiding = false, this.imageClicked = false, this.imageData = {}, this.index = this.options.initialViewIndex, this.isImg = false, this.isShown = false, this.length = 0, this.moving = false, this.played = false, this.playing = false, this.pointers = {}, this.ready = false, this.rotating = false, this.scaling = false, this.showing = false, this.timeout = false, this.tooltipping = false, this.viewed = false, this.viewing = false, this.wheeling = false, this.zooming = false, this.pointerMoved = false, this.id = wo(), this.init();
  }
  return Us(t, [{
    key: "init",
    value: function() {
      var i = this, n = this.element, r = this.options;
      if (!n[L]) {
        n[L] = this, r.focus && !r.keyboard && (r.focus = false);
        var a = n.localName === "img", s = [];
        if (H(a ? [n] : n.querySelectorAll("img"), function(f) {
          Y(r.filter) ? r.filter.call(i, f) && s.push(f) : i.getImageURL(f) && s.push(f);
        }), this.isImg = a, this.length = s.length, this.images = s, this.initBody(), xe(document.createElement(L).style.transition) && (r.transition = false), r.inline) {
          var u = 0, o = function() {
            if (u += 1, u === i.length) {
              var c;
              i.initializing = false, i.delaying = {
                abort: function() {
                  clearTimeout(c);
                }
              }, c = setTimeout(function() {
                i.delaying = false, i.build();
              }, 0);
            }
          };
          this.initializing = {
            abort: function() {
              H(s, function(c) {
                c.complete || (j(c, re, o), j(c, Se, o));
              });
            }
          }, H(s, function(f) {
            if (f.complete)
              o();
            else {
              var c, l;
              C(f, re, c = function() {
                j(f, Se, l), o();
              }, {
                once: true
              }), C(f, Se, l = function() {
                j(f, re, c), o();
              }, {
                once: true
              });
            }
          });
        } else
          C(n, Pe, this.onStart = function(f) {
            var c = f.target;
            c.localName === "img" && (!Y(r.filter) || r.filter.call(i, c)) && i.view(i.images.indexOf(c));
          });
      }
    }
  }, {
    key: "build",
    value: function() {
      if (!this.ready) {
        var i = this.element, n = this.options, r = i.parentNode, a = document.createElement("div");
        a.innerHTML = qs;
        var s = a.querySelector(".".concat(L, "-container")), u = s.querySelector(".".concat(L, "-title")), o = s.querySelector(".".concat(L, "-toolbar")), f = s.querySelector(".".concat(L, "-navbar")), c = s.querySelector(".".concat(L, "-button")), l = s.querySelector(".".concat(L, "-canvas"));
        if (this.parent = r, this.viewer = s, this.title = u, this.toolbar = o, this.navbar = f, this.button = c, this.canvas = l, this.footer = s.querySelector(".".concat(L, "-footer")), this.tooltipBox = s.querySelector(".".concat(L, "-tooltip")), this.player = s.querySelector(".".concat(L, "-player")), this.list = s.querySelector(".".concat(L, "-list")), s.id = "".concat(L).concat(this.id), u.id = "".concat(L, "Title").concat(this.id), M(u, n.title ? et(Array.isArray(n.title) ? n.title[0] : n.title) : _e), M(f, n.navbar ? et(n.navbar) : _e), Xe(c, _e, !n.button), n.keyboard && c.setAttribute("tabindex", 0), n.backdrop && (M(s, "".concat(L, "-backdrop")), !n.inline && n.backdrop !== "static" && At(l, st, "hide")), Be(n.className) && n.className && n.className.split(Ft).forEach(function(S) {
          M(s, S);
        }), n.toolbar) {
          var d = document.createElement("ul"), b = Me(n.toolbar), h = Qe.slice(0, 3), E = Qe.slice(7, 9), g = Qe.slice(9);
          b || M(o, et(n.toolbar)), H(b ? n.toolbar : Qe, function(S, P) {
            var N = b && Me(S), F = b ? Yt(P) : S, X = N && !xe(S.show) ? S.show : S;
            if (!(!X || !n.zoomable && h.indexOf(F) !== -1 || !n.rotatable && E.indexOf(F) !== -1 || !n.scalable && g.indexOf(F) !== -1)) {
              var W = N && !xe(S.size) ? S.size : S, R = N && !xe(S.click) ? S.click : S, A = document.createElement("li");
              n.keyboard && A.setAttribute("tabindex", 0), A.setAttribute("role", "button"), M(A, "".concat(L, "-").concat(F)), Y(R) || At(A, st, F), B(X) && M(A, et(X)), ["small", "large"].indexOf(W) !== -1 ? M(A, "".concat(L, "-").concat(W)) : F === "play" && M(A, "".concat(L, "-large")), Y(R) && C(A, Pe, R), d.appendChild(A);
            }
          }), o.appendChild(d);
        } else
          M(o, _e);
        if (!n.rotatable) {
          var m = o.querySelectorAll('li[class*="rotate"]');
          M(m, He), H(m, function(S) {
            o.appendChild(S);
          });
        }
        if (n.inline)
          M(c, Xs), se(s, {
            zIndex: n.zIndexInline
          }), window.getComputedStyle(r).position === "static" && se(r, {
            position: "relative"
          }), r.insertBefore(s, i.nextSibling);
        else {
          M(c, Bs), M(s, Tt), M(s, rt), M(s, _e), se(s, {
            zIndex: n.zIndex
          });
          var _ = n.container;
          Be(_) && (_ = i.ownerDocument.querySelector(_)), _ || (_ = this.body), _.appendChild(s);
        }
        if (n.inline && (this.render(), this.bind(), this.isShown = true), this.ready = true, Y(n.ready) && C(i, bi, n.ready, {
          once: true
        }), G(i, bi) === false) {
          this.ready = false;
          return;
        }
        this.ready && n.inline && this.view(this.index);
      }
    }
    /**
     * Get the no conflict viewer class.
     * @returns {Viewer} The viewer class.
     */
  }], [{
    key: "noConflict",
    value: function() {
      return window.Viewer = po, t;
    }
    /**
     * Change the default options.
     * @param {Object} options - The new default options.
     */
  }, {
    key: "setDefaults",
    value: function(i) {
      te(ui, Me(i) && i);
    }
  }]);
}();
te(fn.prototype, fo, ho, vo, go, mo);
function $o(t) {
  const e = ref([]), i = ref(false), n = inject("speed-components-config", ref({ apis: {} })), r = computed(() => {
    var l, d, b, h;
    return t === void 0 ? (l = n.value) != null && l.apis ? { apis: (d = n.value) == null ? void 0 : d.apis } : {} : (b = n.value) != null && b.apis ? { apis: (h = n.value) == null ? void 0 : h.apis, ...t.value } : t.value;
  }), a = (l, d) => {
    var m, _;
    const b = d || e.value;
    if (!r.value)
      return true;
    let h = false, E = true, g = true;
    if (r.value.acceptTypes && r.value.acceptTypes.length > 0) {
      const S = /\.\w+$/, P = ((m = l.name.match(S)) == null ? void 0 : m[0]) ?? "";
      r.value.acceptTypes.includes(P) || (message_default.warning(
        `请上传${r.value.acceptTypes.join("、")}格式的文件`
      ), E = false);
    }
    return r.value.maxCount && r.value.maxCount > 1 && (h = e.value.length + ((_ = b || []) == null ? void 0 : _.length) > r.value.maxCount, h) ? (message_default.warning(`已超过最大上传数${r.value.maxCount}`), false) : (r.value.maxSize && l.size && (g = l.size / 1024 / 1024 < r.value.maxSize, g || message_default.warning(`单个文件最大为${r.value.maxSize}M`)), g && E);
  }, s = async (l) => {
    var _, S, P, N, F, X, W;
    if (r.value.multiple && !((S = (_ = r == null ? void 0 : r.value) == null ? void 0 : _.apis) != null && S.fileUploadMulti)) {
      console.warn("未配置批量上传接口");
      return;
    } else if (!((N = (P = r == null ? void 0 : r.value) == null ? void 0 : P.apis) != null && N.fileUploadSingle)) {
      console.warn("未配置单条上传接口");
      return;
    }
    let d = new FormData();
    const { file: b } = l;
    let h = [];
    if (r.value.multiple && Array.isArray(b) ? (h = b, b.forEach((R) => {
      d.append(r.value.name || "files[]", R);
    })) : (h = [b], d.append(r.value.name || "file", b)), (F = r.value) != null && F.data) {
      if (!(typeof r.value.data == "function" || typeof r.value.data == "object")) {
        console.warn("data类型错误,请传入object或function");
        return;
      }
      if (typeof r.value.data == "object") {
        const R = r.value.data;
        Object.keys(R).forEach((A) => {
          d.append(A, R[A]);
        });
      } else {
        const R = r.value.data(
          h
        );
        Array.from(R.entries()).forEach(([A, p]) => {
          d.append(A, p);
        });
      }
    }
    console.log("formData-imgUpload=", d), i.value = true;
    const E = h.map(() => Ys()), g = h.map((R, A) => ({
      uid: E[A],
      fileName: R.name,
      status: "uploading"
    }));
    r.value.maxCount === 1 ? e.value = [g[0]] : e.value.push(...g);
    const m = r.value.multiple ? r.value.apis.fileUploadMulti : r.value.apis.fileUploadSingle;
    try {
      const R = await m(d);
      i.value = false, R.success ? ((r.value.multiple ? R.data : [R.data]).map(
        (p) => {
          var I;
          return (I = r == null ? void 0 : r.value) != null && I.transformResult && typeof r.value.transformResult == "function" ? r.value.transformResult(p) : {
            id: p.id,
            fileType: p.fileType,
            fileSize: p.fileSize,
            fileName: p.fileName
          };
        }
      ).forEach((p, I) => {
        const k = e.value.findIndex(
          (T) => T.uid === E[I]
        );
        k !== -1 && (e.value[k] = { ...p, status: "done" });
      }), (X = l.afterUpload) == null || X.call(l, e.value)) : E.forEach((A) => {
        const p = e.value.findIndex(
          (I) => I.uid === A
        );
        p !== -1 && (e.value[p].status = "error");
      }), (W = r == null ? void 0 : r.value) != null && W.afterUpload && typeof r.value.afterUpload == "function" && r.value.afterUpload(e.value);
    } catch {
      i.value = false, E.forEach((A) => {
        const p = e.value.findIndex(
          (I) => I.uid === A
        );
        p !== -1 && (e.value[p].status = "error");
      });
    }
  }, u = ref();
  return {
    beforeUpload: a,
    customRequest: s,
    handleDelFile: async (l) => {
      var h, E, g, m, _;
      const d = l.id;
      if (!((h = r == null ? void 0 : r.value) != null && h.apis)) {
        console.warn("未配置删除接口");
        const S = e.value.findIndex((P) => P.id === d);
        e.value.splice(S, 1), (E = r == null ? void 0 : r.value) != null && E.afterDelete && typeof r.value.afterDelete == "function" && r.value.afterDelete(e.value);
        return;
      }
      i.value = true;
      const b = await ((m = (g = r.value.apis).fileDel) == null ? void 0 : m.call(g, d));
      if (i.value = false, b && b.success) {
        const S = e.value.findIndex((P) => P.id === d);
        e.value.splice(S, 1), (_ = r == null ? void 0 : r.value) != null && _.afterDelete && typeof r.value.afterDelete == "function" && r.value.afterDelete(e.value);
      }
    },
    handleDownloadFile: async (l) => {
      var h, E;
      const d = (E = (h = r.value) == null ? void 0 : h.apis) == null ? void 0 : E.fileDownload;
      if (!d || typeof d != "function")
        throw new Error("文件下载方法缺失或传入的fileDownload不正确");
      const b = await d(l.id);
      ks(b, l.fileName, l == null ? void 0 : l.className);
    },
    handlePreviewFile: async (l) => {
      var E, g, m;
      if (!l.fileName)
        throw new Error("缺少必要属性fileName");
      const d = (g = (E = r.value) == null ? void 0 : E.apis) == null ? void 0 : g.getPreviewUrl, b = /\.\w+$/, h = ((m = l.fileName.match(b)) == null ? void 0 : m[0]) ?? "";
      if (h)
        if ([".png", ".jpg", ".gif", ".jpeg"].includes(h))
          if (u.value)
            u.value.view(0);
          else {
            let _ = null;
            document.getElementById("viewer-img") ? _ = document.getElementById("viewer-img") : (_ = document.createElement("img"), _.id = "viewer-img", _.style.display = "none"), _ && (_.src = (d ? d(l.id) : l.previewUrl) || "", u.value = new fn(_, {
              className: l.className,
              // 内联展示
              inline: false
            }), u.value.view(0));
          }
        else
          r.value.onPreview || typeof r.value.onPreview == "function" ? r.value.onPreview(l.id) : window.open(l.previewUrl);
      else
        r.value.onPreview || typeof r.value.onPreview == "function" ? r.value.onPreview(l.id) : window.open(l.previewUrl);
    },
    uploadLoading: i,
    files: e
  };
}
var yo = {
  extraParams: {},
  needFullSelect: false,
  hasPagination: true,
  hasSort: false,
  hasSelectedRows: [],
  sortFieldKey: "sortField",
  sortOrderKey: "sortOrder"
};
var bo = ["10", "20", "50"];
var Lo = (t, e) => {
  var R, A;
  const i = ref(false), n = ref(false), r = ref([]), a = inject("speed-components-config"), s = (R = a == null ? void 0 : a.value) == null ? void 0 : R.transformRequestRes, u = (A = a == null ? void 0 : a.value) == null ? void 0 : A.useLoadConfig, o = computed(() => ({ ...yo, ...e.value, ...u })), f = computed(() => o.value.rowKey || "id"), c = ref({}), l = ref({
    [String(o.value.sortFieldKey)]: "",
    [String(o.value.sortOrderKey)]: ""
  }), d = o.value.emit, b = ref({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: bo,
    showTotal: (p) => `共${p}条`
  }), h = reactive({
    curPageKeys: [],
    selectedRowKeys: [],
    selectedRows: [],
    totalRows: [],
    hasSelectedRows: []
  }), E = computed(() => h.totalRows.map((p) => p[f.value]) || []), g = computed(() => ({
    checkAll: h.hasSelectedRows.length > 0 && h.hasSelectedRows.length === Number(h.totalRows.length),
    indeterminate: h.hasSelectedRows.length > 0 && h.hasSelectedRows.length < h.totalRows.length
  })), m = () => {
    o.value && o.value.handleMultiRes ? h.curPageKeys = o.value.handleMultiRes(r.value) : h.curPageKeys = r.value.map(
      (p) => p[f.value]
    ), h.selectedRows = h.hasSelectedRows.filter((p) => h.curPageKeys.includes(p[f.value])) || [], h.selectedRowKeys = h.selectedRows.map((p) => p[f.value]) || [];
  };
  watch(
    () => o.value.hasSelectedRows,
    (p) => {
      h.hasSelectedRows = p || [], m();
    },
    { immediate: true }
  );
  const _ = async (p) => {
    p.target.checked ? h.hasSelectedRows = Fs(
      [...h.hasSelectedRows, ...h.totalRows],
      f.value
    ) : p.target.checked || (h.hasSelectedRows = h.hasSelectedRows.filter((I) => !E.value.includes(I[f.value]))), m(), d && d("update:hasSelectedRows", h.hasSelectedRows);
  };
  async function S() {
    if (o.value.fullRowsAjax) {
      n.value = true;
      const p = await o.value.fullRowsAjax({
        ...o.value.extraParams
      });
      n.value = false, p && p.success && (h.totalRows = p.data || [], m());
    }
  }
  const P = () => {
    h.curPageKeys = [], h.selectedRowKeys = [], h.selectedRows = [], h.totalRows = [], h.hasSelectedRows = [];
  };
  async function N(p = true, I = {
    needResetChecked: false,
    backLoad: false
  }) {
    const k = unref(t);
    i.value = true, I.needResetChecked && P(), o.value.beforeFetch && typeof o.value.beforeFetch == "function" && o.value.beforeFetch(), p && (b.value.current = 1);
    try {
      const T = {
        ...o.value.extraParams,
        ...c.value,
        ...o.value.hasSort ? l.value : {}
      };
      let v = {};
      if (v = await k(
        o.value.hasPagination ? {
          page: b.value.current,
          size: b.value.pageSize,
          ...T
        } : T
      ), s && (typeof s != "function" ? console.error("transformRequestRes应为一个函数") : v = s(v)), v && (v != null && v.success)) {
        if (i.value = false, r.value.length === 0 && b.value.current !== 1 && !I.backLoad) {
          b.value.current--, N(p, {
            backLoad: true
          });
          return;
        }
        o.value.transformAfterFetch && typeof o.value.transformAfterFetch == "function" && (v.data = o.value.transformAfterFetch(v.data)), r.value = (v == null ? void 0 : v.data) ?? [], b.value.total = Number(v.totalCount), o.value.needFullSelect && p && S(), m(), o.value.afterFetch && typeof o.value.afterFetch == "function" && o.value.afterFetch(r.value);
      }
    } catch (T) {
      r.value = [], i.value = false, console.error(T);
    }
  }
  return {
    state: h,
    totalCheckStatus: g,
    loading: i,
    selectAllLoading: n,
    pagination: b,
    dataSource: r,
    getList: N,
    onSelectChange: (p, I) => {
      console.log(p, I), h.selectedRowKeys = p, h.selectedRows = I;
      const k = h.hasSelectedRows.filter((T) => !h.curPageKeys.includes(T[f.value]));
      h.hasSelectedRows = [...k, ...I], d && d("update:hasSelectedRows", h.hasSelectedRows);
    },
    handleTableChange: (p, I, k) => {
      console.log(I, k), b.value.current = p.current, b.value.pageSize = p.pageSize, I && (c.value = I), k && (l.value[String(o.value.sortFieldKey)] = k.field, l.value[String(o.value.sortOrderKey)] = k.order), N(false);
    },
    handleResizeColumn: (p, I) => {
      I.width = p;
    },
    onCheckAllChange: _
  };
};
var _o = {
  extraParams: {},
  hasPagination: true
};
var Ro = (t, e = ref({
  extraParams: {},
  hasPagination: true
})) => {
  var E, g;
  const i = unref(t), n = inject("speed-components-config"), r = (E = n == null ? void 0 : n.value) == null ? void 0 : E.transformRequestRes, a = (g = n == null ? void 0 : n.value) == null ? void 0 : g.useLoadConfig, s = computed(() => ({ ..._o, ...e.value, ...a })), u = reactive({
    page: 1,
    size: 10
  }), o = ref(false), f = ref(false), c = ref(false), l = ref([]), d = async () => {
    o.value = true;
    try {
      let m = await i({
        [s.value.pageKey]: u.page,
        [s.value.pageSizekey]: u.size,
        ...s.value.extraParams
      });
      if (r && (typeof r != "function" ? console.error("transformRequestRes应为一个函数") : m = r(m)), m && m.success) {
        o.value = false, s.value.transformAfterFetch && typeof s.value.transformAfterFetch == "function" && (m.data = s.value.transformAfterFetch(m.data));
        const _ = l.value.concat(m.data);
        l.value = _, m.totalPages !== void 0 ? m.totalPages <= u.page ? c.value = true : c.value = false : m.totalCount !== void 0 && (m.totalCount <= l.value.length ? c.value = true : c.value = false);
      } else
        o.value = false;
    } catch (m) {
      o.value = false, console.error(m);
    }
  };
  return {
    noMore: c,
    loading: o,
    initLoading: f,
    initLoad: async (m = true) => {
      m && (u.page = 1, l.value = []), f.value = true, await d(), f.value = false;
    },
    onLoadMore: async () => {
      o.value = true, c.value || (u.page += 1, d());
    },
    list: l
  };
};
var { defaultAlgorithm: So, defaultSeed: Eo } = theme_default;
var To = (t) => t.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
var Po = () => {
  const t = So(Eo), e = () => {
    const i = [];
    return Object.entries(t).forEach(([n, r]) => {
      if (typeof r == "string" || typeof r == "number") {
        const a = To(n);
        i.push(`--ant-${a}: ${r};`);
      }
    }), `:root {
  ${i.join(`
  `)}
}`;
  };
  if (typeof window < "u") {
    const i = document.createElement("style");
    return i.id = "antd-css-vars", i.textContent = e(), document.head.appendChild(i), () => {
      const n = document.getElementById("antd-css-vars");
      n && document.head.removeChild(n);
    };
  }
  return () => {
  };
};
export {
  bo as defaultPageSizeOptions,
  Io as download,
  Co as downloadFile,
  js as downloadFileFromStream,
  ks as handleExceptDown,
  Po as useAntdCssVars,
  $o as useCustomUpload,
  Ro as useLoadMore,
  Lo as useTable
};
/*! Bundled license information:

speed-components-ui/dist/useAntdCssVars-BcHnHhl9.mjs:
  (*!
   * Viewer.js v1.11.7
   * https://fengyuanchen.github.io/viewerjs
   *
   * Copyright 2015-present Chen Fengyuan
   * Released under the MIT license
   *
   * Date: 2024-11-24T04:32:19.116Z
   *)
*/
//# sourceMappingURL=speed-components-ui_hooks.js.map
