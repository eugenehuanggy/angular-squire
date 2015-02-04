class HnEditor extends Directive('hn.components.editor')
    constructor: ($timeout, $templateCache, $popover) ->
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
            template: """
                <div class='hn-editor'>
                    <div ng-class="{'editor-hide': !isEditorVisible()}" class='editor-container'>
                        <div class="menu">
                            <div class="group">
                                <div title='Bold' ng-click="action('bold')" class="item bold">
                                    <i class="fa fa-bold"></i>
                                </div>
                                <div title='Italic' ng-click="action('italic')" class="item italic">
                                    <i class="fa fa-italic"></i>
                                </div>
                                <div title='Underline' ng-click="action('underline')"
                                    class="item underline">
                                    <i class="fa fa-underline"></i>
                                </div>
                            </div>
                            <div class="group">
                                <div title='Insert Link' class="item add-link">
                                    <i class="fa fa-link"></i>
                                </div>
                                <div title='Insert Numbered List'
                                    ng-click="action('makeOrderedList')" class="item olist">
                                    <i class="fa fa-list-ol"></i>
                                </div>
                                <div title='Insert List'
                                    ng-click="action('makeUnorderedList')" class="item ulist">
                                    <i class="fa fa-list-ul"></i>
                                </div>
                                <div title='Quote'
                                    ng-click="action('increaseQuoteLevel')" class="item quote">
                                    <i class="fa fa-quote-right"></i>
                                </div>
                            </div>

                            <div class="group">
                                <div title='Header' ng-click="action('makeHeading')"
                                    class="item header">
                                    <i class="fa fa-header"></i>
                                </div>
                                <div title='Align Left' ng-click="action('alignLeft')"
                                    class="item aleft">
                                    <i class="fa fa-align-left"></i>
                                </div>
                                <div title='Align Center' ng-click="action('alignCenter')"
                                    class="item acenter">
                                    <i class="fa fa-align-center"></i>
                                </div>
                                <div title='Align Right' ng-click="action('alignRight')"
                                    class="item aright">
                                    <i class="fa fa-align-right"></i>
                                </div>
                            </div>

                            <div class="group">
                                <div title='Undo'
                                    ng-click="action('undo')"
                                    class="item">
                                    <i class="fa fa-undo"></i>
                                </div>
                                <div title='Redo'
                                    ng-click="action('redo')"
                                    class="item">
                                    <i class="fa fa-repeat"></i>
                                </div>
                            </div>
                        </div>
                        <div class='wrapper' ng-style='{width: width, height: height}'>
                            <div class='placeholder'>
                                <div ng-show='showPlaceholder()'>{{ placeholder }}</div>
                            </div>
                            <iframe frameborder='0' border='0' marginwidth='0'
                                marginheight='0' src='about:blank'>
                            </iframe>
                        </div>
                    </div>
                    <ng-transclude></ng-transclude>
                </div>
"""
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
                    return href and href != LINK_DEFAULT

                scope.canAddLink = ->
                    return scope.data.link and scope.data.link != LINK_DEFAULT

                scope.data =
                    link: LINK_DEFAULT

                # TODO: Remove this heresy
                $templateCache.put(('hn.components.editor/hn_editor_popover.html'), """
                    <div class='hn-editor-popover'>
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

                scope.$on('tooltip.show.before',  ->
                    return unless editor
                    if />A\b/.test(editor.getPath()) or editor.hasFormat('A')
                        scope.data.link = getLinkAtCursor()
                    else
                        scope.data.link = LINK_DEFAULT
                )
                scope.$on('tooltip.show', (e, tooltip) ->
                    return unless editor
                    tooltip.$element.find("input").focus()
                )

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
                    doc.childNodes[0].className = "hn-editor-iframe "
                    if scope.editorClass
                        doc.childNodes[0].className += scope.editorClass

                bindPopovers = ->
                    popovers.push($popover(element.find('.add-link'), {
                        contentTemplate: ('hn.components.editor/hn_editor_popover.html'),
                        autoClose: true,
                        html: true,
                        scope: scope,
                        placement: "bottom"
                    }))


                iframe = element.find('iframe')
                menubar = element.find('.menu')

                iframeLoaded = ->
                    editor = scope.editor = new Squire(iframe[0].contentWindow.document)
                    editor.defaultBlockTag = 'P'

                    if scope.body
                        editor.setHTML(scope.body)

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
                        editor.focus()
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

class HnEditorCover extends Directive('hn.components.editor')
    constructor: () ->
        return {
            restrict: 'E'
            replace: true
            transclude: true
            require: "^hn-editor"
            template: """<ng-transclude ng-show="isCoverVisible()"
                             ng-click='hideCover()'
                             class="hn-editor-cover">
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

class HnEditorControls extends Directive('hn.components.editor')
    constructor: () ->
        return {
            restrict: 'E'
            scope: false
            replace: true
            transclude: true
            require: "^hn-editor"
            template: """<ng-transclude ng-show="isControlsVisible()"
                             class="hn-editor-controls">
                         </ng-transclude>"""
            link: (scope, element, attrs, editorCtrl) ->
                scope.isControlsVisible = ->
                    return editorCtrl.editorVisibility()

        }
