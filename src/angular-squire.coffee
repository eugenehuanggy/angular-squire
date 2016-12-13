canRequire = module? and module.exports

if canRequire
    SQ = require('squire-rte')
    try
        DOMPurify = require('dompurify')
    catch
        DOMPurify = null

    module.exports = 'angular-squire'
else
    SQ = window.Squire
    DOMPurify = window.DOMPurify or null

if typeof SQ != "function"
    throw new Error("angular-squire requires squire-rte script to be loaded before it." +
            "Get it from https://github.com/neilj/Squire")

matches = window.Element.prototype.matches ||
    window.Element.prototype.webkitMatchesSelector ||
    window.Element.prototype.mozMatchesSelector ||
    window.Element.prototype.msMatchesSelector ||
    window.Element.prototype.oMatchesSelector

fakeEl = angular.element()

closest = (el, selector) ->
    if el[0].nodeName == "HTML"
        return fakeEl
    else if el[0].nodeType == 3
        return closest(angular.element(el[0].parentNode), selector)
    else if matches.apply(el[0], [selector])
        return el
    else
        return closest(el.parent(), selector)



(if canRequire then require('angular') else window.angular)
    .module("angular-squire", [])
    .directive("squire", ['squireService', (squireService) ->
        return {
            restrict: 'E'
            require: "ngModel"
            scope:
                height: '@'
                width: '@'
                body: '='
                purifyPaste: '='
                placeholder: '@'
                editorClass: '@'
                buttons: '@'
                theme: '=' # currently only supports 'dark' or not setting it
                chromeOnHoverAndFocus: '=' # If true, only show squire toolbar and border on focus and hover
                heightWrapContent: '=' # Overrides the height settings and makes editor wrap contents
                focusExpand: '=?'
            replace: true
            transclude: true
            templateUrl: "angular-squire-main-template.html"

            controller: ['$scope' ,($scope) ->
                buttons = {}
                if $scope.buttons
                    buttons = $scope.$eval($scope.buttons) or {}
                $scope.buttonVis = Object.assign({}, squireService.getButtonDefaults(), buttons)

                editorVisible = true
                $scope.isEditorVisible = ->
                    return editorVisible

                $scope.editorVisibility = @editorVisibility = (vis) ->
                    if arguments.length == 1
                        if editorVisible != vis
                            $scope.editor?.focus()
                        editorVisible = vis
                    return editorVisible

                return
            ]

            link: (scope, element, attrs, ngModel) ->
                LINK_DEFAULT = "http://"

                HEADER_CLASS = 'h4'

                themeClass = if attrs.theme then 'angular-squire-theme-'+attrs.theme else ''

                setActive = () ->
                    isChildElement = element[0].contains(document.activeElement) or element[0] == document.activeElement
                    hasDirtyElements = element[0].getElementsByClassName('ng-dirty').length > 0 or element[0].classList.contains('ng-dirty')
                    if (isChildElement or hasDirtyElements)
                        if (!element[0].classList.contains('input-focus'))
                            element[0].classList.add("input-focus")
                     else
                        element[0].classList.remove("input-focus")


                if scope.focusExpand
                    element[0].classList.add("input-focus-expanding")
                    element[0].addEventListener('blur', setActive, true)
                    element[0].addEventListener('focus', setActive, true)

                editor = scope.editor = null
                scope.data =
                    link: LINK_DEFAULT

                updateModel = (value) ->
                    scope.$evalAsync(->
                        ngModel.$setViewValue(value)
                        if ngModel.$isEmpty(value)
                            element.removeClass('squire-has-value')
                            if scope.focusExpand
                                element[0].classList.remove("ng-dirty")
                        else
                            element.addClass('squire-has-value')
                    )

                ngModel.$render = ->
                    editor?.setHTML(ngModel.$viewValue || '')

                ngModel.$isEmpty = (value) ->
                    if angular.isString(value)
                        return angular.element("<div>"+value+"</div>").text().trim().length == 0
                    else
                        return not value

                hasVisibleElements = () ->
                    return ngModel.$viewValue?.match(/<(ul|ol)>|(&nbsp;)/g)

                getLinkAtCursor = ->
                    return LINK_DEFAULT if not editor
                    return closest(angular.element(editor.getSelection()
                        .commonAncestorContainer), "a")
                        .attr("href")

                scope.canRemoveLink = ->
                    href = getLinkAtCursor()
                    return href and href != LINK_DEFAULT

                scope.canAddLink = ->
                    return scope.data.link and scope.data.link != LINK_DEFAULT

                scope.$on('$destroy', ->
                    editor?.destroy()
                )
                scope.showPlaceholder = ->
                    # show placeholder if model is empty (i.e. no valid string value)
                    # and no visible elements are rendering - e.g. list bullets or spaces were added in
                    return ngModel.$isEmpty(ngModel.$viewValue) && !hasVisibleElements();

                scope.popoverHide = (e, name) ->
                    hide = ->
                        closest(angular.element(e.target), ".popover-visible")
                            .removeClass("popover-visible")

                        scope.action(name)

                    if e.keyCode
                        if e.keyCode == 13
                            hide()
                            e.preventDefault()
                    else
                        hide()


                scope.popoverShow = (e) ->
                    linkElement = angular.element(e.currentTarget)

                    if closest(angular.element(e.target), ".squire-popover").length
                        return
                    if linkElement.hasClass("popover-visible")
                        return

                    linkElement.addClass("popover-visible")
                    if />A\b/.test(editor.getPath()) or editor.hasFormat('A')
                        scope.data.link = getLinkAtCursor()
                    else
                        scope.data.link = LINK_DEFAULT
                    popover = angular.element(element[0].querySelector(".squire-popover input")).focus()
                    popover.css(left: -1 * (popover.width() / 2) + linkElement.width() / 2  + 2)
                    return


                menubar = angular.element(element[0].querySelector('.menu'))
                haveInteraction = false


                ngModel.$setPristine()

                editor = scope.editor = new SQ(element[0].querySelector('.angular-squire-wrapper'), {
                    blockTag: 'P'
                })

                initialContent = scope.body || ngModel.$viewValue

                if initialContent
                    editor.setHTML(initialContent)
                    updateModel(initialContent)
                    haveInteraction = true



                element.addClass(themeClass)


                editor.addEventListener("input", ->
                    if haveInteraction
                        html = editor.getHTML()
                        updateModel(html)
                )

                if DOMPurify and scope.purifyPaste
                    if not DOMPurify.addedHrefTargetHook
                        DOMPurify.addedHrefTargetHook = true #dont add a zillion of these
                        DOMPurify.addHook('afterSanitizeAttributes', (node) ->
                            # set all elements owning target to target=_blank
                            if 'target' in node
                                node.setAttribute('target', '_blank')
                        )

                    if typeof scope.purifyPaste == 'boolean'
                        opts =
                            RETURN_DOM_FRAGMENT: true
                            FORBID_ATTR: ['style']
                            FORBID_TAGS: ['style', 'script', 'blink', 'pre', 'code']
                            ALLOW_DATA_ATTR: false
                            SAFE_FOR_TEMPLATES: true
                            SAFE_FOR_JQUERY: true
                    else
                        # assume that the options are coming in from that scope binding
                        opts = scope.purifyPaste
                        opts.RETURN_DOM_FRAGMENT = true

                    editor.addEventListener('willPaste', (event) ->
                        div = document.createElement('div');
                        div.appendChild(event.fragment);
                        event.fragment = DOMPurify.sanitize(div.innerHTML, opts);
                        return
                    )

                editor.addEventListener("focus", ->
                    element.addClass('focus').triggerHandler('focus')
                    scope.editorVisibility(true)
                    haveInteraction = true
                )
                editor.addEventListener("blur", ->
                    element.removeClass('focus').triggerHandler('blur')
                    if ngModel.$pristine and not ngModel.$isEmpty(ngModel.$viewValue)
                        ngModel.$setTouched()
                    haveInteraction = true
                )
                editor.addEventListener("pathChange", ->

                    p = editor.getPath()

                    if />A\b/.test(p) or editor.hasFormat('A')
                        angular.element(element[0].querySelector('.add-link')).addClass('active')
                    else
                        angular.element(element[0].querySelector('.add-link')).removeClass('active')

                    menubar.attr("class", "menu "+
                        p.replace(/>|\.|div/ig, ' ')
                        .replace(RegExp(HEADER_CLASS, 'g'), 'size')
                        .toLowerCase())
                )

                #gimme some shortcuts
                editor.alignRight = -> editor.setTextAlignment("right")
                editor.alignCenter = -> editor.setTextAlignment("center")
                editor.alignLeft = -> editor.setTextAlignment("left")
                editor.alignJustify = -> editor.setTextAlignment("justify")

                editor.makeHeading = () ->
                    create = not menubar.hasClass('size')
                    editor.forEachBlock((block) ->
                        if create
                            angular.element(block).addClass(HEADER_CLASS)
                        else
                            angular.element(block).removeClass(HEADER_CLASS)
                    , true)
                    return editor.focus()

                SQ::testPresenceinSelection = (name, action, format, validation) ->
                    p = @getPath()
                    test = (validation.test(p) | @hasFormat(format))
                    return name is action and test


                scope.action = (action) ->
                    return unless editor

                    test =
                        value: action
                        testBold: editor.testPresenceinSelection("bold",
                            action, "B", (/>B\b/))
                        testItalic: editor.testPresenceinSelection("italic",
                            action, "I", (/>I\b/))
                        testUnderline: editor.testPresenceinSelection("underline",
                            action, "U", (/>U\b/))
                        testOrderedList: editor.testPresenceinSelection("makeOrderedList",
                            action, "OL", (/>OL\b/))
                        testUnorderedList: editor.testPresenceinSelection("makeUnorderedList",
                            action, "UL", (/>UL\b/))
                        testLink: editor.testPresenceinSelection("removeLink",
                            action, "A", (/>A\b/))
                        testQuote: editor.testPresenceinSelection("increaseQuoteLevel",
                            action, "blockquote", (/>blockquote\b/))
                        isNotValue: (a) ->
                            a is action and @value isnt ""


                    if test.testBold or test.testItalic or test.testUnderline or
                    test.testOrderedList or test.testUnorderedList or test.testQuote or
                    test.testLink
                        editor.removeBold()  if test.testBold
                        editor.removeItalic()  if test.testItalic
                        editor.removeUnderline()  if test.testUnderline
                        editor.removeList()  if test.testOrderedList
                        editor.removeList()  if test.testUnorderedList
                        editor.decreaseQuoteLevel()  if test.testQuote
                        if test.testLink
                            editor.removeLink()
                            editor.focus()
                    else if test.isNotValue("removeLink") then
                        # these will trigger popover, dont do anything
                    else if action == 'makeLink'
                        return unless scope.canAddLink()
                        node = closest(angular.element(editor.getSelection().commonAncestorContainer), "a")[0]
                        if node
                            range = document.createRange()
                            range.selectNodeContents(node)
                            selection = window.getSelection()
                            selection.removeAllRanges()
                            selection.addRange(range)
                        if scope.data.link.match(/^\s*?javascript:/i)
                            linky = LINK_DEFAULT
                        else
                            linky = scope.data.link

                        editor.makeLink(linky, {
                            target: '_blank',
                            title: linky,
                            rel: "nofollow"
                        })
                        scope.data.link = LINK_DEFAULT
                        editor.focus()
                    else
                        editor[action]()
                        editor.focus()
        }
    ]).directive("squireCover", ->
        return {
            restrict: 'E'
            replace: true
            transclude: true
            require: "^squire"
            template: """<ng-transclude ng-show="isCoverVisible()"
                             ng-click='hideCover()'
                             class="angular-squire-cover">
                         </ng-transclude>"""
            link: (scope, element, attrs, editorCtrl) ->
                showingCover = true
                scope.isCoverVisible = ->
                    return showingCover
                scope.hideCover = ->
                    showingCover = false
                    editorCtrl.editorVisibility(true)

                editorCtrl.editorVisibility(not showingCover)
                scope.$watch(->
                    editorCtrl.editorVisibility()
                , (val) ->
                    showingCover = not val
                )
        }
    ).directive("squireControls", ->
        return {
            restrict: 'E'
            scope: false
            replace: true
            transclude: true
            require: "^squire"
            template: """<ng-transclude ng-show="isControlsVisible()"
                             class="angular-squire-controls">
                         </ng-transclude>"""
            link: (scope, element, attrs, editorCtrl) ->
                scope.isControlsVisible = ->
                    return editorCtrl.editorVisibility()

        }
    ).provider("squireService", [() ->

        @buttonDefaults =
            bold: true
            italic: true
            underline: true
            link: true
            ol: true
            ul: true
            quote: false
            header: false
            alignRight: false
            alignLeft: false
            alignCenter: false
            undo: false
            redo: false

        obj =
            setButtonDefaults: (obj) =>
                @buttonDefaults = obj
            getButtonDefaults: =>
                return @buttonDefaults

        @$get = ->
            return obj

        return @
    ])
