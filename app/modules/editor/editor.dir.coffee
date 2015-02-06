angular
    .module("angular-squire", [])
    .directive("squire", ($timeout, $templateCache, $compile) ->
        return {
            restrict: 'E'
            require: "ngModel"
            scope:
                height: '@height',
                width: '@width',
                body: '=body',
                placeholder: '@placeholder',
                editorClass: '@editorClass',
            replace: true
            transclude: true
            templateUrl: "/modules/editor/editor.html"

            ### @ngInject ###
            controller: ($scope) ->
                editorVisible = true
                $scope.isEditorVisible = ->
                    return editorVisible

                $scope.editorVisibility = @editorVisibility = (vis) ->
                    if arguments.length == 1
                        editorVisible = vis
                        if vis
                            $scope.editor?.focus()
                    else
                        return editorVisible

            link: (scope, element, attrs, ngModel) ->
                editor = scope.editor = null

                popovers = []

                LINK_DEFAULT = "http://"

                getLinkAtCursor = ->
                    return angular.element(editor.getSelection()
                        .commonAncestorContainer)
                        .closest("a")
                        .attr("href")

                scope.canRemoveLink = ->
                    href = getLinkAtCursor()
                    console.log(href)
                    return href and href != LINK_DEFAULT

                scope.canAddLink = ->
                    return scope.data.link and scope.data.link != LINK_DEFAULT

                scope.data =
                    link: LINK_DEFAULT

                # TODO: Remove this heresy
                $templateCache.get('angular-squire/popover.html') or
                $templateCache.put('angular-squire/popover.html', """
                    <div class='angular-squire-popover'>
                        <strong>Insert Link</strong>
                        <div class="form-group has-feedback">
                            <input type="text" class="form-control"
                                id='edit-link' placeholder="Link URL"
                                ng-model='data.link'
                                ng-keydown='popoverHide($event, "makeLink")'/>
                            <label for="edit-link" title="Remove Link"
                                ng-show="canRemoveLink()"
                                ng-click="action('removeLink')"
                                class="glyphicon glyphicon-remove
                                    text-danger form-control-feedback close-popover">
                            </label>
                        </div>
                        <div ng-if="!canRemoveLink()" class="btn btn-success btn-block"
                            ng-class="{disabled: !canAddLink()}"
                            ng-click="action('makeLink')">
                            Insert
                        </div>
                        <div ng-if="canRemoveLink()"class="btn btn-success btn-block"
                            ng-class="{disabled: !canAddLink()}"
                            ng-click="action('makeLink')">
                            Update
                        </div>
                    </div>
                """)

                scope.$on('$destroy', ->
                    editor?.destroy()
                )
                scope.showPlaceholder = ->
                    return angular.element('<div>'+ngModel.$viewValue+'</div>')
                        .text().trim().length == 0  #it also gets hidden via css on focus

                scope.popoverHide = (e, name) ->
                    if e.keyCode == 13
                        _.each(popovers, (p) -> p.hide())
                        scope.action(name)

                # scope.$on('tooltip.show.before',  ->
                #     return unless editor
                #     if />A\b/.test(editor.getPath()) or editor.hasFormat('A')
                #         scope.data.link = getLinkAtCursor()
                #     else
                #         scope.data.link = LINK_DEFAULT
                # )
                # scope.$on('tooltip.show', (e, tooltip) ->
                #     return unless editor
                #     tooltip.$element.find("input").focus()
                # )

                updateModel = (value) ->
                    scope.$evalAsync(->
                        ngModel.$setViewValue(value)
                    )

                updateStylesToMatch = ->
                    doc = editor.getDocument()
                    head = doc.head

                    _.each(angular.element('link'), (el) ->
                        a = doc.createElement('link')
                        a.setAttribute('href',  el.href)
                        a.setAttribute('type',  'text/css')
                        a.setAttribute('rel',  'stylesheet')
                        head.appendChild(a)
                    )
                    doc.childNodes[0].className = "angular-squire-iframe "
                    if scope.editorClass
                        doc.childNodes[0].className += scope.editorClass

                bindPopovers = ->
                    # popovers.push($popover(element.find('.add-link'), {
                    #     contentTemplate: 'angular-squire/popover.html',
                    #     autoClose: true,
                    #     html: true,
                    #     scope: scope,
                    #     placement: "bottom"
                    # }))
                    html = $templateCache.get('/modules/editor/popover.html')
                    template = $compile(html)
                    link_elem = element.find('.add-link')
                    link_elem
                        .click( () ->
                            if />A\b/.test(editor.getPath()) or editor.hasFormat('A')
                                scope.data.link = getLinkAtCursor()
                            else
                                scope.data.link = LINK_DEFAULT

                            popover = element
                                .find('.squire-popover')
                                .html(template(scope))
                                .show()

                            popover.find("input").focus()

                            popover
                                .css(left: link_elem.position().left - popover.width() / 2)

                            element.find('.squire-popover-overlay').show().click( () ->
                                popover.hide()
                                $(this).hide()
                            )
                        )



                iframe = element.find('iframe')
                menubar = element.find('.menu')

                iframeLoaded = ->
                    editor = scope.editor = new Squire(iframe[0].contentWindow.document)
                    editor.defaultBlockTag = 'P'


                    updateStylesToMatch()
                    bindPopovers()

                    editor.addEventListener("input", ->
                        updateModel(editor.getHTML())
                    )

                    editor.addEventListener("focus", ->
                        element.addClass('focus')
                        _.each(popovers, (p) ->
                            p.hide()
                        )
                        scope.editorVisibility(true)
                    )
                    editor.addEventListener("blur", ->
                        element.removeClass('focus')
                        updateModel(editor.getHTML())
                    )
                    editor.addEventListener("pathChange", ->
                        p = editor.getPath()
                        if />A\b/.test(p) or editor.hasFormat('A')
                            element.find('.add-link').addClass('active')
                        else
                            element.find('.add-link').removeClass('active')

                        menubar.attr("class", "menu "+p.replace(/>|\.|html|body|div/ig, ' ')
                            .toLowerCase())
                    )

                    #gimme some shortcuts
                    editor.alignRight = -> editor.setTextAlignment("right")
                    editor.alignCenter = -> editor.setTextAlignment("center")
                    editor.alignLeft = -> editor.setTextAlignment("left")
                    editor.alignJustify = -> editor.setTextAlignment("justify")

                    editor.makeHeading = ->
                        editor.setFontSize("2em")
                        editor.bold()
                if /WebKit\//.test(navigator.userAgent)
                    #chrome doesnt need to wait, and also doesnt fire
                    # the load event on iframes without a valid src
                    iframeLoaded()
                else
                    #firefox et al need to wait for the iframe to load before operating on it
                    iframe.on('load', iframeLoaded)

                Squire::testPresenceinSelection = (name, action, format, validation) ->
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


                    editor.removeBold()  if test.testBold
                    editor.removeItalic()  if test.testItalic
                    editor.removeUnderline()  if test.testUnderline
                    editor.removeList()  if test.testOrderedList
                    editor.removeList()  if test.testUnorderedList
                    editor.decreaseQuoteLevel()  if test.testQuote
                    if test.testLink
                        editor.removeLink()
                        element.find('.squire-popover').hide()
                        editor.focus()
                        debugger;
                    else if test.isNotValue("removeLink") then
                        # these will trigger popover, dont do anything
                    else if action == 'makeLink'
                        return unless scope.canAddLink()
                        node = angular.element(editor.getSelection().commonAncestorContainer)
                            .closest('a')[0]
                        if node
                            range = iframe[0].contentWindow.document.createRange()
                            range.selectNodeContents(node)
                            selection = iframe[0].contentWindow.getSelection()
                            selection.removeAllRanges()
                            selection.addRange(range)
                        editor.makeLink(scope.data.link, {
                            target: '_blank',
                            title: scope.data.link,
                            rel: "nofollow"
                        })
                        scope.data.link = LINK_DEFAULT
                        editor.focus()
                    else
                        editor[action]()
                        editor.focus()
        }
    ).directive("squireCover", ->
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
    )
