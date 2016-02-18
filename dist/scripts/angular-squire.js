/**
* @preserve angular-squire - angularjs directive for squire rich text editor
* @version v1.0.0
* @link https://github.com/HourlyNerd/angular-squire
* @license MIT
*
* angular-squire includes squire-rte which is Copyright © by Neil Jenkins. MIT Licensed.
**/
(function() {
  var SQ, canRequire;

  canRequire = (typeof module !== "undefined" && module !== null) && module.exports;

  if (canRequire) {
    SQ = require('squire-rte');
    module.exports = 'angular-squire';
  } else {
    SQ = window.Squire;
  }

  if (typeof SQ !== "function") {
    throw new Error("angular-squire requires squire-rte script to be loaded before it." + "Get it from https://github.com/neilj/Squire");
  }

  (canRequire ? require('angular') : window.angular).module("angular-squire", []).directive("squire", [
    'squireService', function(squireService) {
      return {
        restrict: 'E',
        require: "ngModel",
        scope: {
          height: '@',
          width: '@',
          body: '=',
          placeholder: '@',
          editorClass: '@',
          buttons: '@'
        },
        replace: true,
        transclude: true,
        templateUrl: "/modules/angular-squire/editor.html",

        /* @ngInject */
        controller: ["$scope", function($scope) {
          var buttons, editorVisible;
          buttons = {};
          if ($scope.buttons) {
            buttons = $scope.$eval($scope.buttons);
          }
          $scope.buttonVis = _.defaults(buttons || {}, squireService.getButtonDefaults());
          editorVisible = true;
          $scope.isEditorVisible = function() {
            return editorVisible;
          };
          $scope.editorVisibility = this.editorVisibility = function(vis) {
            var ref;
            if (arguments.length === 1) {
              editorVisible = vis;
              if (vis) {
                return (ref = $scope.editor) != null ? ref.focus() : void 0;
              }
            } else {
              return editorVisible;
            }
          };
        }],
        link: function(scope, element, attrs, ngModel) {
          var HEADER_CLASS, IFRAME_CLASS, LINK_DEFAULT, editor, getLinkAtCursor, haveInteraction, iframe, iframeLoaded, menubar, updateModel, updateStylesToMatch;
          LINK_DEFAULT = "http://";
          IFRAME_CLASS = 'angular-squire-iframe';
          HEADER_CLASS = 'h4';
          editor = scope.editor = null;
          scope.data = {
            link: LINK_DEFAULT
          };
          updateModel = function(value) {
            value = squireService.sanitize.input(value, editor);
            return scope.$evalAsync(function() {
              ngModel.$setViewValue(value);
              if (ngModel.$isEmpty(value)) {
                return element.removeClass('squire-has-value');
              } else {
                return element.addClass('squire-has-value');
              }
            });
          };
          ngModel.$render = function() {
            return editor != null ? editor.setHTML(ngModel.$viewValue || '') : void 0;
          };
          ngModel.$isEmpty = function(value) {
            if (angular.isString(value)) {
              return angular.element("<div>" + value + "</div>").text().trim().length === 0;
            } else {
              return !value;
            }
          };
          getLinkAtCursor = function() {
            if (!editor) {
              return LINK_DEFAULT;
            }
            return angular.element(editor.getSelection().commonAncestorContainer).closest("a").attr("href");
          };
          scope.canRemoveLink = function() {
            var href;
            href = getLinkAtCursor();
            return href && href !== LINK_DEFAULT;
          };
          scope.canAddLink = function() {
            return scope.data.link && scope.data.link !== LINK_DEFAULT;
          };
          scope.$on('$destroy', function() {
            return editor != null ? editor.destroy() : void 0;
          });
          scope.showPlaceholder = function() {
            return ngModel.$isEmpty(ngModel.$viewValue);
          };
          scope.popoverHide = function(e, name) {
            var hide;
            hide = function() {
              angular.element(e.target).closest(".popover-visible").removeClass("popover-visible");
              return scope.action(name);
            };
            if (e.keyCode) {
              if (e.keyCode === 13) {
                return hide();
              }
            } else {
              return hide();
            }
          };
          scope.popoverShow = function(e) {
            var linkElement, popover;
            linkElement = angular.element(e.currentTarget);
            if (angular.element(e.target).closest(".squire-popover").length) {
              return;
            }
            if (linkElement.hasClass("popover-visible")) {
              return;
            }
            linkElement.addClass("popover-visible");
            if (/>A\b/.test(editor.getPath()) || editor.hasFormat('A')) {
              scope.data.link = getLinkAtCursor();
            } else {
              scope.data.link = LINK_DEFAULT;
            }
            popover = element.find(".squire-popover").find("input").focus().end();
            popover.css({
              left: -1 * (popover.width() / 2) + linkElement.width() / 2 + 2
            });
          };
          updateStylesToMatch = function(doc) {
            var head;
            head = doc.head;
            _.each(angular.element('link[rel="stylesheet"]'), function(el) {
              var a;
              a = doc.createElement('link');
              a.setAttribute('href', el.href);
              a.setAttribute('type', 'text/css');
              a.setAttribute('rel', 'stylesheet');
              return head.appendChild(a);
            });
            doc.childNodes[0].className = IFRAME_CLASS + " ";
            if (scope.editorClass) {
              return doc.childNodes[0].className += scope.editorClass;
            }
          };
          iframe = angular.element('<iframe frameborder="0" border="0" marginwidth="0" marginheight="0" src="about:blank"></iframe>');
          menubar = element.find('.menu');
          haveInteraction = false;
          iframeLoaded = function() {
            var iframeDoc, initialContent;
            iframeDoc = iframe[0].contentWindow.document;
            updateStylesToMatch(iframeDoc);
            ngModel.$setPristine();
            editor = scope.editor = new SQ(iframeDoc);
            editor.defaultBlockTag = 'P';
            initialContent = scope.body || ngModel.$viewValue;
            if (initialContent) {
              editor.setHTML(initialContent);
              updateModel(initialContent);
              haveInteraction = true;
            }
            editor.addEventListener("willPaste", function(e) {
              return squireService.sanitize.paste(e, editor);
            });
            editor.addEventListener("input", function() {
              var html;
              if (haveInteraction) {
                html = editor.getHTML();
                return updateModel(html);
              }
            });
            editor.addEventListener("focus", function() {
              element.addClass('focus').triggerHandler('focus');
              scope.editorVisibility(true);
              return haveInteraction = true;
            });
            editor.addEventListener("blur", function() {
              element.removeClass('focus').triggerHandler('blur');
              if (ngModel.$pristine && !ngModel.$isEmpty(ngModel.$viewValue)) {
                ngModel.$setTouched();
              } else {
                ngModel.$setPristine();
              }
              return haveInteraction = true;
            });
            editor.addEventListener("pathChange", function() {
              var p, ref;
              p = editor.getPath();
              if (/>A\b/.test(p) || editor.hasFormat('A')) {
                element.find('.add-link').addClass('active');
              } else {
                element.find('.add-link').removeClass('active');
              }
              return menubar.attr("class", "menu " + ((ref = p.split("BODY")[1]) != null ? ref.replace(/>|\.|html|body|div/ig, ' ').replace(RegExp(HEADER_CLASS, 'g'), 'size').toLowerCase() : void 0));
            });
            editor.alignRight = function() {
              return editor.setTextAlignment("right");
            };
            editor.alignCenter = function() {
              return editor.setTextAlignment("center");
            };
            editor.alignLeft = function() {
              return editor.setTextAlignment("left");
            };
            editor.alignJustify = function() {
              return editor.setTextAlignment("justify");
            };
            return editor.makeHeading = function() {
              var create;
              create = !menubar.hasClass('size');
              editor.forEachBlock(function(block) {
                if (create) {
                  return angular.element(block).addClass(HEADER_CLASS);
                } else {
                  return angular.element(block).removeClass(HEADER_CLASS);
                }
              }, true);
              return editor.focus();
            };
          };
          iframe.on('load', iframeLoaded);
          element.find('.angular-squire-wrapper').append(iframe);
          SQ.prototype.testPresenceinSelection = function(name, action, format, validation) {
            var p, test;
            p = this.getPath();
            test = validation.test(p) | this.hasFormat(format);
            return name === action && test;
          };
          return scope.action = function(action) {
            var linky, node, range, selection, test;
            if (!editor) {
              return;
            }
            test = {
              value: action,
              testBold: editor.testPresenceinSelection("bold", action, "B", />B\b/),
              testItalic: editor.testPresenceinSelection("italic", action, "I", />I\b/),
              testUnderline: editor.testPresenceinSelection("underline", action, "U", />U\b/),
              testOrderedList: editor.testPresenceinSelection("makeOrderedList", action, "OL", />OL\b/),
              testUnorderedList: editor.testPresenceinSelection("makeUnorderedList", action, "UL", />UL\b/),
              testLink: editor.testPresenceinSelection("removeLink", action, "A", />A\b/),
              testQuote: editor.testPresenceinSelection("increaseQuoteLevel", action, "blockquote", />blockquote\b/),
              isNotValue: function(a) {
                return a === action && this.value !== "";
              }
            };
            if (test.testBold || test.testItalic || test.testUnderline || test.testOrderedList || test.testUnorderedList || test.testQuote || test.testLink) {
              if (test.testBold) {
                editor.removeBold();
              }
              if (test.testItalic) {
                editor.removeItalic();
              }
              if (test.testUnderline) {
                editor.removeUnderline();
              }
              if (test.testOrderedList) {
                editor.removeList();
              }
              if (test.testUnorderedList) {
                editor.removeList();
              }
              if (test.testQuote) {
                editor.decreaseQuoteLevel();
              }
              if (test.testLink) {
                editor.removeLink();
                return editor.focus();
              }
            } else if (test.isNotValue("removeLink")) {

            } else if (action === 'makeLink') {
              if (!scope.canAddLink()) {
                return;
              }
              node = angular.element(editor.getSelection().commonAncestorContainer).closest('a')[0];
              if (node) {
                range = iframe[0].contentWindow.document.createRange();
                range.selectNodeContents(node);
                selection = iframe[0].contentWindow.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
              }
              if (scope.data.link.match(/^\s*?javascript:/i)) {
                linky = LINK_DEFAULT;
              } else {
                linky = scope.data.link;
              }
              editor.makeLink(linky, {
                target: '_blank',
                title: linky,
                rel: "nofollow"
              });
              scope.data.link = LINK_DEFAULT;
              return editor.focus();
            } else {
              editor[action]();
              return editor.focus();
            }
          };
        }
      };
    }
  ]).directive("squireCover", function() {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      require: "^squire",
      template: "<ng-transclude ng-show=\"isCoverVisible()\"\n    ng-click='hideCover()'\n    class=\"angular-squire-cover\">\n</ng-transclude>",
      link: function(scope, element, attrs, editorCtrl) {
        var showingCover;
        showingCover = true;
        scope.isCoverVisible = function() {
          return showingCover;
        };
        scope.hideCover = function() {
          showingCover = false;
          return editorCtrl.editorVisibility(true);
        };
        editorCtrl.editorVisibility(!showingCover);
        return scope.$watch(function() {
          return editorCtrl.editorVisibility();
        }, function(val) {
          return showingCover = !val;
        });
      }
    };
  }).directive("squireControls", function() {
    return {
      restrict: 'E',
      scope: false,
      replace: true,
      transclude: true,
      require: "^squire",
      template: "<ng-transclude ng-show=\"isControlsVisible()\"\n    class=\"angular-squire-controls\">\n</ng-transclude>",
      link: function(scope, element, attrs, editorCtrl) {
        return scope.isControlsVisible = function() {
          return editorCtrl.editorVisibility();
        };
      }
    };
  }).provider("squireService", [
    function() {
      var buttonDefaults, defaultSanitize, doSanitize, ensureSupport, haveSanitize, obj, sanitizer;
      haveSanitize = !angular.isUndefined(window.Sanitize);
      buttonDefaults = {
        bold: true,
        italic: true,
        underline: true,
        link: true,
        ol: true,
        ul: true,
        quote: true,
        header: true,
        alignRight: true,
        alignLeft: true,
        alignCenter: true,
        undo: true,
        redo: true
      };
      if (haveSanitize) {
        defaultSanitize = new Sanitize({
          elements: ['div', 'span', 'b', 'i', 'ul', 'ol', 'li', 'blockquote', 'a', 'p', 'br', 'u'],
          attributes: {
            '__ALL__': ['class'],
            a: ['href', 'title', 'target', 'rel']
          },
          protocols: {
            a: {
              href: ['ftp', 'http', 'https', 'mailto', 'gopher']
            }
          }
        });
        sanitizer = {
          paste: defaultSanitize,
          input: defaultSanitize
        };
      }
      doSanitize = haveSanitize;
      obj = {
        onPaste: function(e, editor) {},
        onChange: function(val, editor) {
          return val;
        },
        sanitize: {
          paste: function(e, editor) {
            if (doSanitize) {
              e.fragment = sanitizer.paste.clean_node(e.fragment);
            }
            return obj.onPaste(e, editor);
          },
          input: function(html, editor) {
            var child, e, fragment, newHtml, tmp;
            if (doSanitize) {
              fragment = document.createDocumentFragment();
              tmp = document.createElement('body');
              tmp.innerHTML = html;
              while ((child = tmp.firstChild)) {
                fragment.appendChild(child);
              }
              fragment = sanitizer.input.clean_node(fragment);
              while ((child = fragment.firstChild)) {
                tmp.appendChild(child);
              }
              newHtml = tmp.innerHTML;
              if (html !== newHtml) {
                editor.setHTML(newHtml);
                html = newHtml;
              }
            }
            e = {
              html: html
            };
            obj.onChange(e, editor);
            return e.html;
          }
        },
        setButtonDefaults: function(obj) {
          return buttonDefaults = obj;
        },
        getButtonDefaults: function() {
          return buttonDefaults;
        }
      };
      this.onPaste = function(cb) {
        if (cb) {
          return obj.onPaste = cb;
        }
      };
      this.onChange = function(cb) {
        if (cb) {
          return obj.onChange = cb;
        }
      };
      ensureSupport = function(fn) {
        var msg;
        if (haveSanitize) {
          return fn;
        } else {
          msg = "Angular-Squire: you must include https://github.com/gbirke/Sanitize.js to " + " use sanitize options";
          return function() {
            throw new Error(msg);
          };
        }
      };
      this.sanitizeOptions = {
        paste: ensureSupport(function(opts) {
          if (opts) {
            return sanitizer.paste = new Sanitize(opts);
          }
        }),
        input: ensureSupport(function(opts) {
          if (opts) {
            return sanitizer.input = new Sanitize(opts);
          }
        })
      };
      this.strictPaste = ensureSupport(function(enable) {
        if (enable) {
          return sanitizer.paste = new Sanitize({
            elements: ['div', 'span', 'b', 'i', 'u', 'br', 'p']
          });
        } else {
          return sanitizer.paste = defaultSanitize;
        }
      });
      this.enableSanitizer = ensureSupport(function(enable) {
        if (enable == null) {
          enable = true;
        }
        return doSanitize = enable;
      });
      this.$get = function() {
        return obj;
      };
      return this;
    }
  ]);

}).call(this);

angular.module("angular-squire").run(["$templateCache", function($templateCache) {$templateCache.put("/modules/angular-squire/editor.html","<div class=\'angular-squire\'>\n    <div ng-class=\"{\'editor-hide\': !isEditorVisible()}\" class=\'editor-container\'>\n        <div class=\"menu\">\n            <div class=\"group\" ng-show=\"buttonVis.bold || buttonVis.italic || buttonVis.underline\">\n                <div title=\'Bold\'\n                     ng-click=\"action(\'bold\')\"\n                     ng-show=\"buttonVis.bold\"\n                     class=\"item bold\">\n                    <i class=\"fa fa-bold\"></i>\n                </div>\n                <div title=\'Italic\'\n                     ng-click=\"action(\'italic\')\"\n                     ng-show=\"buttonVis.italic\"\n                     class=\"item italic\">\n                    <i class=\"fa fa-italic\"></i>\n                </div>\n                <div title=\'Underline\'\n                     ng-click=\"action(\'underline\')\"\n                     ng-show=\"buttonVis.underline\"\n                     class=\"item underline\">\n                    <i class=\"fa fa-underline\"></i>\n                </div>\n            </div>\n            <div class=\"group\"  ng-show=\"buttonVis.link || buttonVis.ol || buttonVis.ul || buttonVis.quote\">\n                <div title=\'Insert Link\'\n                     class=\"item add-link\"\n                     ng-show=\"buttonVis.link\"\n                     ng-click=\"popoverShow($event)\">\n                    <i class=\"fa fa-link\"></i>\n                    <div class=\"squire-popover\">\n                        <div class=\"arrow\"></div>\n                        <div class=\"content\">\n                            <div class=\"title\">Insert Link</div>\n                            <input type=\"text\"\n                                id=\"edit-link\"\n                                placeholder=\"Link URL\"\n                                ng-model=\"data.link\"\n                                ng-keydown=\"popoverHide($event, \'makeLink\')\" />\n                            <button type=\"button\" class=\"double r\" ng-show=\"canRemoveLink()\"\n                                ng-click=\"popoverHide($event, \'removeLink\')\">\n                                <span class=\"fa fa-remove\"></span> Remove Link\n                            </button>\n                            <button type=\"button\" class=\"double l\" ng-show=\"canRemoveLink()\"\n                                ng-class=\"{disabled: !canAddLink()}\"\n                                ng-click=\"popoverHide($event, \'makeLink\')\">\n                                <span class=\"fa fa-edit\"></span> Update Link\n                            </button>\n                            <button type=\"button\" ng-hide=\"canRemoveLink()\"\n                                ng-class=\"{disabled: !canAddLink()}\"\n                                ng-click=\"popoverHide($event, \'makeLink\')\">\n                                <span class=\"fa fa-plus\"></span> Insert Link\n                            </button>\n                        </div>\n                        <div class=\"squire-popover-overlay\" ng-click=\"popoverHide($event, \'makeLink\')\"></div>\n                    </div>\n                </div>\n                <div title=\'Insert Numbered List\'\n                     ng-click=\"action(\'makeOrderedList\')\"\n                     ng-show=\"buttonVis.ol\"\n                     class=\"item olist\">\n                    <i class=\"fa fa-list-ol\"></i>\n                </div>\n                <div title=\'Insert List\'\n                     ng-click=\"action(\'makeUnorderedList\')\"\n                     ng-show=\"buttonVis.ul\"\n                     class=\"item ulist\">\n                    <i class=\"fa fa-list-ul\"></i>\n                </div>\n                <div title=\'Quote\'\n                     ng-click=\"action(\'increaseQuoteLevel\')\"\n                     ng-show=\"buttonVis.quote\"\n                     class=\"item quote\">\n                    <i class=\"fa fa-quote-right\"></i>\n                </div>\n            </div>\n\n            <div class=\"group\" ng-show=\"buttonVis.header || buttonVis.alignLeft || buttonVis.alignRight || buttonVis.alignCenter\">\n                <div title=\'Header\'\n                     ng-click=\"action(\'makeHeading\')\"\n                     ng-show=\"buttonVis.header\"\n                     class=\"item header\">\n                    <i class=\"fa fa-header\"></i>\n                </div>\n                <div title=\'Align Left\'\n                     ng-click=\"action(\'alignLeft\')\"\n                     ng-show=\"buttonVis.alignLeft\"\n                     class=\"item aleft\">\n                    <i class=\"fa fa-align-left\"></i>\n                </div>\n                <div title=\'Align Center\'\n                     ng-click=\"action(\'alignCenter\')\"\n                     ng-show=\"buttonVis.alignCenter\"\n                     class=\"item acenter\">\n                    <i class=\"fa fa-align-center\"></i>\n                </div>\n                <div title=\'Align Right\'\n                     ng-click=\"action(\'alignRight\')\"\n                     ng-show=\"buttonVis.alignRight\"\n                     class=\"item aright\">\n                    <i class=\"fa fa-align-right\"></i>\n                </div>\n            </div>\n\n            <div class=\"group\" ng-show=\"buttonVis.undo || buttonVis.redo\">\n                <div title=\'Undo\'\n                     ng-click=\"action(\'undo\')\"\n                     ng-show=\"buttonVis.undo\"\n                     class=\"item\">\n                    <i class=\"fa fa-undo\"></i>\n                </div>\n                <div title=\'Redo\'\n                     ng-click=\"action(\'redo\')\"\n                     ng-show=\"buttonVis.redo\"\n                     class=\"item\">\n                    <i class=\"fa fa-repeat\"></i>\n                </div>\n            </div>\n        </div>\n\n        <div class=\'angular-squire-wrapper\' ng-style=\'{width: width, height: height}\'>\n            <div class=\'placeholder\'>\n                <div ng-show=\'showPlaceholder()\'>{{ placeholder }}</div>\n            </div>\n        </div>\n    </div>\n    <ng-transclude></ng-transclude>\n</div>\n");}]);