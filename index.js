! function() {
    /**
     *  Initialize
     */
    var vm = new Mux({
            deep: true,
            props: {
                isClick: false,
                number: 10,
                clazz: 'small',
                comment: {
                    title: 'hello world'
                },
                users: [{
                    name: 'switer'
                }],
                btnText: 'click me to change numbers',
                items: [1, 2, 3]
            }
        })
        /**
         *  Event methods
         */
    var methods = {
        click: function() {
            vm.number = 1000
            vm.clazz = 'large'
            vm.comment.title = 'show me the code'
            vm.users[0].name = 'guankaishe'
            vm.isClick = true
            vm.btnText = 'disabled'
            vm.items.push(4)
        }
    }

    /**
     *  binding
     */

    function binding(con, vm) {
        $(con).find('[z-repeat]').each(function(index, el) {
            var $el = $(el)
            var $parent = $el.parent()
            $el.remove()
            var depName = $el.attr('z-repeat').toString()

            function update(next) {
                $parent.html('')
                next.forEach(function(item, index) {
                    var $subEl = $(el.cloneNode())
                    removeDeclare($subEl, 'z-repeat')
                    var subVM = new Mux({
                        props: {
                            $index: index,
                            $value: item,
                            $parentVM: vm,
                        }
                    })
                    $parent.append($subEl)
                    binding($parent, subVM)
                })
            }
            vm.$watch(depName, update)
            update(vm.$get(depName))

        })
        $(con).find('[z-html]').each(function(index, el) {
            var $el = $(el)
            var depName = $el.attr('z-html').toString()

            function update(next) {
                $el.html(next)
            }
            vm.$watch(depName, update)
            update(vm.$get(depName))
            removeDeclare($el, 'z-html')
        })
        $(con).find('[z-class]').each(function(index, el) {
            var $el = $(el)
            var exp = $el.attr('z-class').toString()
            var depName = exp.split(':')[1].trim()
            var className = exp.split(':')[0].trim()

            function update(next) {
                if (!next) {
                    $el.removeClass(className)
                } else {
                    $el.addClass(className)
                }
            }
            vm.$watch(depName, update)
            update(vm.$get(depName))
            removeDeclare($el, 'z-class')
        })
        $(con).find('[z-on]').each(function(index, el) {
            var $el = $(el)
            var exp = $el.attr('z-on').toString()
            var depName = exp.split(':')[1].trim()
            var evtType = exp.split(':')[0].trim()
            $el.on(evtType, methods[depName])
            removeDeclare($el, 'z-on')
        })
        $(con).find('[z-attr]').each(function(index, el) {
            var $el = $(el)
            var exp = $el.attr('z-attr').toString()
            var depName = exp.split(':')[1].trim()
            var attrName = exp.split(':')[0].trim()

            function update(next) {
                if (!next) {
                    $el.removeAttr(attrName)
                } else {
                    $el.attr(attrName, next)
                }
            }
            vm.$watch(depName, update)
            update(vm.$get(depName))
            removeDeclare($el, 'z-attr')
        })
    }

    binding(document.body, vm)

    function removeDeclare($el, name) {
        $el.removeAttr(name)
    }

}()
