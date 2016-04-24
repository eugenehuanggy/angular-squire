/**
* @preserve angular-squire - angularjs directive for squire rich text editor
* @version v2.1.0
* @license MIT
*
* angular-squire includes squire-rte which is Copyright © by Neil Jenkins. MIT Licensed.
**/
(function() {
  var ngular;

  ngular = (typeof module !== "undefined" && module !== null) && module.exports ? require('angular') : window.angular;

  ngular.module("angular-squire").run([
    "$templateCache", function($templateCache) {
      $templateCache.put('angular-squire-icon-attachment', "<svg version=\"1.1\"  xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\nviewBox=\"0 0 125 125\" style=\"enable-background:new 0 0 125 125;\" xml:space=\"preserve\">\n<g>\n<g>\n<path  d=\"M54.3,34.1c5.2-5.2,10.3-10.4,15.6-15.4c3.8-3.6,8.5-5.5,13.7-6.1c11.8-1.6,23.2,4.9,27.9,15.9\nc1.8,4.1,2.4,8.4,2,12.9c-0.6,6.3-3.2,11.8-7.7,16.3C99.5,63.8,93.3,70.1,87,76.3c-4.1,4-8.9,6.6-14.6,7.4\nc-10.8,1.7-21.2-3.3-26.6-12.2c-0.2-0.4-0.3-0.7,0.1-1c2.7-2.7,5.4-5.4,8.1-8.1c0.4-0.4,0.9-0.7,1.5-1.1c0.1,0.3,0.2,0.5,0.3,0.6\nc1.9,5.2,5.7,8.2,11.2,8.8c4.1,0.5,7.7-0.8,10.6-3.7C84,60.8,90.4,54.4,96.7,48c3.7-3.8,4.7-8.4,3-13.4c-1.6-5-5.2-8-10.3-8.9\nc-4.4-0.8-8.3,0.4-11.6,3.5c-2.2,2.1-4.3,4.3-6.4,6.4c-0.3,0.3-0.5,0.3-0.8,0.2c-4.2-1.6-8.6-2.2-13.2-2\nC56.4,33.9,55.4,34,54.3,34.1z\"/>\n<path  d=\"M81.7,53.4c-0.2,0.2-0.3,0.4-0.5,0.5c-2.7,2.7-5.4,5.4-8.2,8.1c-0.4,0.4-0.9,0.7-1.4,1.1\nc-0.1-0.3-0.2-0.5-0.2-0.7c-2-5.2-5.7-8.2-11.2-8.8c-4-0.5-7.6,0.7-10.5,3.6C43.3,63.7,36.8,70,30.5,76.5c-3.7,3.8-4.6,8.4-3,13.4\nc1.6,4.9,5.1,7.9,10.3,8.9c4.5,0.8,8.4-0.4,11.6-3.5c2.2-2.1,4.3-4.2,6.4-6.4c0.3-0.3,0.6-0.4,1-0.2c4.2,1.5,8.5,2.2,12.9,1.9\nc1-0.1,2-0.1,3.1-0.2c-0.1,0.1-0.1,0.2-0.2,0.3c-4.7,4.7-9.4,9.5-14.3,14.2c-4,3.9-8.8,6.2-14.3,7c-13.8,2-26.7-6.7-29.7-20.4\nc-2-9,0.2-17.2,6.5-23.9c6.5-6.8,13.2-13.4,19.9-20c4-3.9,8.9-6.2,14.4-6.9c9.1-1.1,16.9,1.6,23.2,8.3\nC79.6,50.4,80.6,51.9,81.7,53.4z\"/>\n</g>\n</g>\n</svg>");
      $templateCache.put('angular-squire-icon-bold', "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\nviewBox=\"0 0 125 125\" style=\"enable-background:new 0 0 125 125;\" xml:space=\"preserve\">\n<g>\n<path  d=\"M100.7,37.7c0,3.1-0.4,5.8-1.3,8.1c-0.8,2.3-2,4.3-3.6,6c-1.6,1.7-3.4,3.1-5.6,4.3c-2.2,1.2-4.6,2.2-7.2,3v0.7\nc3.2,0.8,6.2,1.9,8.9,3.4c2.7,1.4,5,3.2,6.9,5.3c1.9,2.1,3.4,4.5,4.5,7.2c1.1,2.7,1.6,5.8,1.6,9.2c0,9.2-3.4,16.1-10.1,20.6\nc-6.7,4.5-16.7,6.8-30,6.8H19.7v-7.5h5.7c1,0,2-0.1,2.9-0.3c0.9-0.2,1.7-0.6,2.3-1.3c0.6-0.6,1.2-1.5,1.5-2.7\nc0.4-1.2,0.6-2.8,0.6-4.8V28.6c0-1.9-0.2-3.4-0.6-4.5c-0.4-1.2-0.9-2.1-1.6-2.7c-0.7-0.6-1.4-1.1-2.3-1.3c-0.9-0.3-1.8-0.4-2.8-0.4\nh-5.7v-7.4h40.9c13.3,0,23.3,2.1,30,6.2S100.7,29,100.7,37.7z M54.8,55.7h5.3c3.3,0,6-0.3,8.2-1c2.2-0.7,3.9-1.7,5.2-3.2\nc1.3-1.4,2.2-3.3,2.8-5.6c0.5-2.3,0.8-5,0.8-8.2c0-3.2-0.3-5.9-0.9-8c-0.6-2.1-1.6-3.9-3-5.2c-1.4-1.3-3.1-2.3-5.3-2.8\nc-2.2-0.6-4.9-0.9-8-0.9h-5.1V55.7z M54.8,103.7h9.3c3.1,0,5.7-0.3,7.9-1c2.2-0.7,4-1.8,5.3-3.3c1.4-1.5,2.4-3.5,3-6\nc0.6-2.5,0.9-5.5,0.9-9c0-3.4-0.3-6.4-0.8-8.9c-0.5-2.5-1.5-4.6-2.8-6.3c-1.3-1.6-3.1-2.9-5.2-3.7c-2.1-0.8-4.8-1.2-8.1-1.2h-9.6\nV103.7z\"/>\n</g>\n</svg>");
      $templateCache.put('angular-squire-icon-italic', "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\nviewBox=\"0 0 125 125\" style=\"enable-background:new 0 0 125 125;\" xml:space=\"preserve\">\n<g>\n<path  d=\"M27.9,112.3l1.5-7.5h1.8c1.5,0,2.9-0.1,4.3-0.3c1.4-0.2,2.7-0.6,3.8-1.2c1.1-0.6,2.1-1.4,3-2.5\nc0.8-1.1,1.4-2.6,1.8-4.4l14.6-68.8c0.2-0.5,0.3-1.1,0.4-1.7c0.1-0.6,0.2-1.1,0.2-1.5c0-1-0.3-1.8-0.8-2.5\nc-0.5-0.6-1.2-1.1-2.1-1.5c-0.9-0.3-2-0.6-3.2-0.7c-1.3-0.1-2.6-0.2-4.1-0.2h-1.8l1.5-7.4h48.4l-1.6,7.4h-1.8c-1.6,0-3,0.1-4.5,0.3\ns-2.7,0.6-3.9,1.2c-1.2,0.6-2.2,1.5-3.1,2.6c-0.9,1.1-1.5,2.6-1.8,4.4L66.1,96.9c-0.1,0.5-0.2,1.1-0.3,1.7\nc-0.1,0.6-0.2,1.1-0.2,1.5c0,1,0.3,1.8,0.8,2.4c0.5,0.6,1.2,1.1,2.1,1.4c0.9,0.3,2,0.6,3.2,0.7c1.3,0.1,2.6,0.2,4.1,0.2h1.8\nl-1.6,7.5H27.9z\"/>\n</g>\n</svg>");
      $templateCache.put('angular-squire-icon-ul', "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\nviewBox=\"0 0 125 125\" style=\"enable-background:new 0 0 125 125;\" xml:space=\"preserve\">\n<g>\n<rect x=\"38.6\" y=\"29.3\"  width=\"73.9\" height=\"12.3\"/>\n    <rect x=\"38.6\" y=\"56\"  width=\"73.9\" height=\"12.3\"/>\n    <rect x=\"38.6\" y=\"82.6\"  width=\"73.9\" height=\"12.3\"/>\n    <circle  cx=\"21.5\" cy=\"35.5\" r=\"8.9\"/>\n    <circle  cx=\"21.5\" cy=\"62.2\" r=\"8.9\"/>\n    <circle  cx=\"21.5\" cy=\"88.8\" r=\"8.9\"/>\n    </g>\n    </svg>");
      $templateCache.put('angular-squire-icon-ol', "<svg version=\"1.1\"  xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\nviewBox=\"0 0 125 125\" style=\"enable-background:new 0 0 125 125;\" xml:space=\"preserve\">\n<g>\n<g>\n<g>\n<path  d=\"M18.1,87.5h1.2c0.3,0,0.7,0,1-0.1c0.3,0,0.6-0.1,0.9-0.3c0.3-0.1,0.5-0.3,0.6-0.6c0.2-0.2,0.2-0.6,0.2-1\nc0-0.5-0.2-0.9-0.6-1.3c-0.4-0.3-0.9-0.5-1.5-0.5c-0.6,0-1,0.2-1.4,0.5c-0.4,0.3-0.6,0.7-0.7,1.1l-3.9-0.8\nc0.2-0.7,0.5-1.4,0.9-1.9c0.4-0.5,0.8-0.9,1.4-1.2c0.5-0.3,1.1-0.6,1.7-0.7c0.6-0.2,1.3-0.2,2-0.2c0.7,0,1.5,0.1,2.2,0.3\nc0.7,0.2,1.3,0.5,1.8,0.9c0.5,0.4,0.9,0.9,1.2,1.5c0.3,0.6,0.5,1.3,0.5,2.1c0,0.9-0.2,1.7-0.7,2.4c-0.5,0.7-1.2,1.1-2.1,1.3V89\nc0.5,0.1,1,0.2,1.3,0.5c0.4,0.2,0.7,0.5,1,0.9c0.3,0.3,0.5,0.7,0.6,1.2c0.1,0.4,0.2,0.9,0.2,1.4c0,0.8-0.2,1.6-0.5,2.2\nc-0.3,0.6-0.8,1.2-1.3,1.6c-0.5,0.4-1.2,0.7-1.9,0.9c-0.7,0.2-1.5,0.3-2.3,0.3c-1.5,0-2.8-0.3-3.9-1c-1.1-0.7-1.8-1.8-2.2-3.3\nl3.8-0.9c0.1,0.6,0.4,1.1,0.8,1.4c0.4,0.3,1,0.5,1.7,0.5c0.8,0,1.4-0.2,1.7-0.6c0.4-0.4,0.6-0.9,0.6-1.6c0-0.5-0.1-0.8-0.3-1.1\nc-0.2-0.3-0.5-0.5-0.8-0.6c-0.3-0.1-0.7-0.2-1.1-0.2c-0.4,0-0.8,0-1.2,0h-0.8V87.5z\"/>\n</g>\n</g>\n<rect x=\"37.4\" y=\"28.3\"  width=\"75.8\" height=\"12.6\"/>\n    <rect x=\"37.4\" y=\"55.7\"  width=\"75.8\" height=\"12.6\"/>\n    <rect x=\"37.4\" y=\"83\"  width=\"75.8\" height=\"12.6\"/>\n    <g>\n    <path  d=\"M18.7,30l-3.5,3.1l-2.1-2.4l5.7-4.8h3.4v17.4h-3.5V30z\"/>\n    </g>\n    <g>\n    <path  d=\"M13.8,66.8l6.7-6c0.3-0.3,0.7-0.7,1-1c0.3-0.4,0.5-0.8,0.5-1.4c0-0.6-0.2-1-0.6-1.4c-0.4-0.3-0.9-0.5-1.5-0.5\nc-0.7,0-1.2,0.2-1.6,0.6c-0.4,0.4-0.6,0.9-0.6,1.5L14,58.5c0-0.9,0.2-1.7,0.6-2.3c0.3-0.7,0.7-1.2,1.3-1.6c0.5-0.4,1.2-0.8,1.9-1\nc0.7-0.2,1.5-0.3,2.3-0.3c0.8,0,1.5,0.1,2.2,0.3c0.7,0.2,1.3,0.5,1.8,1c0.5,0.4,0.9,1,1.2,1.6c0.3,0.6,0.4,1.4,0.4,2.2\nc0,0.5-0.1,1-0.2,1.5c-0.1,0.4-0.3,0.8-0.5,1.2c-0.2,0.4-0.4,0.7-0.7,1c-0.3,0.3-0.6,0.6-0.9,0.9l-5.2,4.5h7.6v3.2h-12V66.8z\"/>\n</g>\n</g>\n</svg>");
      return $templateCache.put('angular-squire-icon-underline', "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\nviewBox=\"0 0 125 125\" style=\"enable-background:new 0 0 125 125;\" xml:space=\"preserve\">\n<g>\n<path d=\"M106.6,18.8h-5.3c-0.8,0-1.6,0.1-2.4,0.3c-0.8,0.2-1.4,0.6-2,1.1c-0.6,0.6-1,1.4-1.3,2.4\nc-0.3,1-0.5,2.4-0.5,4.2v47.9c0,4.1-0.6,7.8-1.8,11.1c-1.2,3.3-3,6.1-5.5,8.3c-2.5,2.3-5.7,4-9.6,5.2c-3.9,1.2-8.5,1.8-13.9,1.8\nc-5.4,0-10.1-0.5-14.4-1.5c-4.2-1-7.8-2.6-10.7-4.9c-2.9-2.2-5.1-5.1-6.7-8.7c-1.5-3.5-2.3-7.8-2.3-12.9v-47c0-1.6-0.2-2.9-0.5-3.9\nc-0.3-1-0.8-1.7-1.4-2.2c-0.6-0.5-1.2-0.9-2-1c-0.7-0.2-1.5-0.3-2.4-0.3h-5.3v-6.5h42.4v6.5H56c-0.8,0-1.6,0.1-2.4,0.3\nc-0.8,0.2-1.4,0.6-2,1.1c-0.6,0.6-1,1.4-1.3,2.4c-0.3,1-0.5,2.4-0.5,4.2v47.5c0,3.4,0.4,6.3,1.3,8.7c0.9,2.3,2.1,4.2,3.7,5.6\nc1.6,1.4,3.5,2.4,5.8,3.1c2.2,0.6,4.8,0.9,7.6,0.9c2.7,0,5.2-0.3,7.4-1c2.2-0.7,4.1-1.8,5.6-3.3c1.5-1.5,2.7-3.4,3.6-5.6\nc0.8-2.3,1.3-5,1.3-8.1V26.3c0-1.6-0.2-2.9-0.5-3.9c-0.3-1-0.8-1.7-1.3-2.2c-0.6-0.5-1.3-0.9-2-1c-0.8-0.2-1.6-0.3-2.4-0.3h-5.2\nv-6.5h32.2V18.8z\"/>\n<path  d=\"M16.8,112.3v-6.1h91.8v6.1H16.8z\"/>\n    </g>\n    </svg>");
    }
  ]);

}).call(this);

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
          buttons: '@',
          theme: '='
        },
        replace: true,
        transclude: true,
        templateUrl: "/modules/angular-squire/editor.html",

        /* @ngInject */
        controller: ["$scope", function($scope) {
          var buttons, editorVisible;
          buttons = {};
          if ($scope.buttons) {
            buttons = $scope.$eval($scope.buttons) || {};
          }
          $scope.buttonVis = Object.assign({}, squireService.getButtonDefaults(), buttons);
          editorVisible = true;
          $scope.isEditorVisible = function() {
            return editorVisible;
          };
          $scope.editorVisibility = this.editorVisibility = function(vis) {
            var ref;
            if (arguments.length === 1) {
              if (editorVisible !== vis) {
                if ((ref = $scope.editor) != null) {
                  ref.focus();
                }
              }
              editorVisible = vis;
            }
            return editorVisible;
          };
        }],
        link: function(scope, element, attrs, ngModel) {
          var HEADER_CLASS, LINK_DEFAULT, editor, getLinkAtCursor, haveInteraction, initialContent, menubar, themeClass, updateModel;
          LINK_DEFAULT = "http://";
          HEADER_CLASS = 'h4';
          themeClass = attrs.theme ? 'angular-squire-theme-' + attrs.theme : '';
          editor = scope.editor = null;
          scope.data = {
            link: LINK_DEFAULT
          };
          updateModel = function(value) {
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
          menubar = element.find('.menu');
          haveInteraction = false;
          ngModel.$setPristine();
          editor = scope.editor = new SQ(element.find('.angular-squire-wrapper')[0], {
            blockTag: 'P'
          });
          initialContent = scope.body || ngModel.$viewValue;
          if (initialContent) {
            editor.setHTML(initialContent);
            updateModel(initialContent);
            haveInteraction = true;
          }
          element.addClass(themeClass);
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
            }
            return haveInteraction = true;
          });
          editor.addEventListener("pathChange", function() {
            var p;
            p = editor.getPath();
            if (/>A\b/.test(p) || editor.hasFormat('A')) {
              element.find('.add-link').addClass('active');
            } else {
              element.find('.add-link').removeClass('active');
            }
            return menubar.attr("class", "menu " + p.replace(/>|\.|div/ig, ' ').replace(RegExp(HEADER_CLASS, 'g'), 'size').toLowerCase());
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
          editor.makeHeading = function() {
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
                range = document.createRange();
                range.selectNodeContents(node);
                selection = window.getSelection();
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
      var obj;
      this.buttonDefaults = {
        bold: true,
        italic: true,
        underline: true,
        link: true,
        ol: true,
        ul: true,
        quote: false,
        header: false,
        alignRight: false,
        alignLeft: false,
        alignCenter: false,
        undo: false,
        redo: false
      };
      obj = {
        setButtonDefaults: (function(_this) {
          return function(obj) {
            return _this.buttonDefaults = obj;
          };
        })(this),
        getButtonDefaults: (function(_this) {
          return function() {
            return _this.buttonDefaults;
          };
        })(this)
      };
      this.$get = function() {
        return obj;
      };
      return this;
    }
  ]);

}).call(this);

angular.module("angular-squire").run(["$templateCache", function($templateCache) {$templateCache.put("/modules/angular-squire/editor.html","<div class=\'angular-squire\'>\n    <div ng-class=\"{\'editor-hide\': !isEditorVisible()}\" class=\'editor-container\'>\n        <div class=\"menu\">\n            <div title=\'Bold\'\n                 ng-click=\"action(\'bold\')\"\n                 ng-show=\"buttonVis.bold\"\n                 class=\"item bold\" ng-include=\"\'angular-squire-icon-bold\'\">\n            </div>\n            <div title=\'Italic\'\n                 ng-click=\"action(\'italic\')\"\n                 ng-show=\"buttonVis.italic\"\n                 class=\"item italic\"\n                 ng-include=\"\'angular-squire-icon-italic\'\">\n            </div>\n            <div title=\'Underline\'\n                 ng-click=\"action(\'underline\')\"\n                 ng-show=\"buttonVis.underline\"\n                 class=\"item underline\"\n                 ng-include=\"\'angular-squire-icon-underline\'\">\n            </div>\n            <div title=\'Insert Numbered List\'\n                 ng-click=\"action(\'makeOrderedList\')\"\n                 ng-show=\"buttonVis.ol\"\n                 class=\"item olist\"\n                 ng-include=\"\'angular-squire-icon-ol\'\">\n            </div>\n            <div title=\'Insert List\'\n                 ng-click=\"action(\'makeUnorderedList\')\"\n                 ng-show=\"buttonVis.ul\"\n                 class=\"item ulist\"\n                 ng-include=\"\'angular-squire-icon-ul\'\">\n            </div>\n            <div title=\'Quote\'\n                 ng-click=\"action(\'increaseQuoteLevel\')\"\n                 ng-show=\"buttonVis.quote\"\n                 class=\"item quote\">\n                <i class=\"fa fa-quote-right\"></i>\n            </div>\n            <div title=\'Insert Link\'\n                 class=\"item add-link\"\n                 ng-show=\"buttonVis.link\"\n                 ng-click=\"popoverShow($event)\">\n                <span ng-include=\"\'angular-squire-icon-attachment\'\"></span>\n                <div class=\"squire-popover\">\n                    <svg class=\"squire-arrow\">\n                        <polygon points=\"0,15 15,0 30,15\"/>\n                    </svg>\n                    <div class=\"content\">\n                        <div class=\"title\">Insert Link</div>\n                        <input type=\"text\"\n                               id=\"edit-link\"\n                               placeholder=\"Link URL\"\n                               ng-model=\"data.link\"\n                               ng-keydown=\"popoverHide($event, \'makeLink\')\" />\n                        <div class=\"button-row\">\n                            <button type=\"button\" class=\"double r\" ng-show=\"canRemoveLink()\"\n                                    ng-click=\"popoverHide($event, \'removeLink\')\">\n                                <span class=\"fa fa-remove\"></span> Remove Link\n                            </button>\n                            <button type=\"button\" class=\"double l\" ng-show=\"canRemoveLink()\"\n                                    ng-class=\"{disabled: !canAddLink()}\"\n                                    ng-click=\"popoverHide($event, \'makeLink\')\">\n                                <span class=\"fa fa-edit\"></span> Update Link\n                            </button>\n                            <button type=\"button\" ng-hide=\"canRemoveLink()\"\n                                    ng-class=\"{disabled: !canAddLink()}\"\n                                    ng-click=\"popoverHide($event, \'makeLink\')\">\n                                <span class=\"fa fa-plus\"></span> Insert Link\n                            </button>\n                        </div>\n                    </div>\n                    <div class=\"squire-popover-overlay\" ng-click=\"popoverHide($event, \'makeLink\')\"></div>\n                </div>\n            </div>\n            <div title=\'Header\'\n                 ng-click=\"action(\'makeHeading\')\"\n                 ng-show=\"buttonVis.header\"\n                 class=\"item header\">\n                <i class=\"fa fa-header\"></i>\n            </div>\n            <div title=\'Align Left\'\n                 ng-click=\"action(\'alignLeft\')\"\n                 ng-show=\"buttonVis.alignLeft\"\n                 class=\"item aleft\">\n                <i class=\"fa fa-align-left\"></i>\n            </div>\n            <div title=\'Align Center\'\n                 ng-click=\"action(\'alignCenter\')\"\n                 ng-show=\"buttonVis.alignCenter\"\n                 class=\"item acenter\">\n                <i class=\"fa fa-align-center\"></i>\n            </div>\n            <div title=\'Align Right\'\n                 ng-click=\"action(\'alignRight\')\"\n                 ng-show=\"buttonVis.alignRight\"\n                 class=\"item aright\">\n                <i class=\"fa fa-align-right\"></i>\n            </div>\n            <div title=\'Undo\'\n                 ng-click=\"action(\'undo\')\"\n                 ng-show=\"buttonVis.undo\"\n                 class=\"item\">\n                <i class=\"fa fa-undo\"></i>\n            </div>\n            <div title=\'Redo\'\n                 ng-click=\"action(\'redo\')\"\n                 ng-show=\"buttonVis.redo\"\n                 class=\"item\">\n                <i class=\"fa fa-repeat\"></i>\n            </div>\n        </div>\n\n        <div class=\'angular-squire-wrapper\' ng-style=\'{width: width, height: height}\'>\n            <div class=\'placeholder\'>\n                <div ng-show=\'showPlaceholder()\'>{{ placeholder }}</div>\n            </div>\n        </div>\n    </div>\n    <ng-transclude></ng-transclude>\n</div>\n");}]);