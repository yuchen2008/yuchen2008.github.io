
// +function ($) {
//     'use strict';

//     // MODAL CLASS DEFINITION
//     // ======================

//     var Modal = function (element, options) {
//         this.options        = options
//         this.$body          = $(document.body)
//         this.$element       = $(element)
//         this.$backdrop      =
//             this.isShown        = null
//         this.scrollbarWidth = 0

//         if (this.options.remote) {
//             this.$element
//                 .find('.modal-content')
//                 .load(this.options.remote, $.proxy(function () {
//                     this.$element.trigger('loaded.bs.modal')
//                 }, this))
//         }
//     }

//     Modal.VERSION  = '3.3.0'

//     Modal.TRANSITION_DURATION = 300
//     Modal.BACKDROP_TRANSITION_DURATION = 150

//     Modal.DEFAULTS = {
//         backdrop: true,
//         keyboard: true,
//         show: true
//     }

//     Modal.prototype.toggle = function (_relatedTarget) {
//         return this.isShown ? this.hide() : this.show(_relatedTarget)
//     }

//     Modal.prototype.show = function (_relatedTarget) {
//         var that = this
//         var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

//         this.$element.trigger(e)

//         if (this.isShown || e.isDefaultPrevented()) return

//         this.isShown = true

//         this.checkScrollbar()
//         this.$body.addClass('modal-open')

//         this.setScrollbar()
//         this.escape()

//         this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

//         this.backdrop(function () {
//             var transition = $.support.transition && that.$element.hasClass('fade')

//             if (!that.$element.parent().length) {
//                 that.$element.appendTo(that.$body) // don't move modals dom position
//             }

//             that.$element
//                 .show()
//                 .scrollTop(0)

//             if (transition) {
//                 that.$element[0].offsetWidth // force reflow
//             }

//             that.$element
//                 .addClass('in')
//                 .attr('aria-hidden', false)

//             that.enforceFocus()

//             var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

//             transition ?
//                 that.$element.find('.modal-dialog') // wait for modal to slide in
//                     .one('bsTransitionEnd', function () {
//                         that.$element.trigger('focus').trigger(e)
//                     })
//                     .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
//                 that.$element.trigger('focus').trigger(e)
//         })
//     }

//     Modal.prototype.hide = function (e) {
//         if (e) e.preventDefault()

//         e = $.Event('hide.bs.modal')

//         this.$element.trigger(e)

//         if (!this.isShown || e.isDefaultPrevented()) return

//         this.isShown = false

//         this.escape()

//         $(document).off('focusin.bs.modal')

//         this.$element
//             .removeClass('in')
//             .attr('aria-hidden', true)
//             .off('click.dismiss.bs.modal')

//         $.support.transition && this.$element.hasClass('fade') ?
//             this.$element
//                 .one('bsTransitionEnd', $.proxy(this.hideModal, this))
//                 .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
//             this.hideModal()
//     }

//     Modal.prototype.enforceFocus = function () {
//         $(document)
//             .off('focusin.bs.modal') // guard against infinite focus loop
//             .on('focusin.bs.modal', $.proxy(function (e) {
//                 if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
//                     this.$element.trigger('focus')
//                 }
//             }, this))
//     }

//     Modal.prototype.escape = function () {
//         if (this.isShown && this.options.keyboard) {
//             this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
//                 e.which == 27 && this.hide()
//             }, this))
//         } else if (!this.isShown) {
//             this.$element.off('keydown.dismiss.bs.modal')
//         }
//     }

//     Modal.prototype.hideModal = function () {
//         var that = this
//         this.$element.hide()
//         this.backdrop(function () {
//             that.$body.removeClass('modal-open')
//             that.resetScrollbar()
//             that.$element.trigger('hidden.bs.modal')
//         })
//     }

//     Modal.prototype.removeBackdrop = function () {
//         this.$backdrop && this.$backdrop.remove()
//         this.$backdrop = null
//     }

//     Modal.prototype.backdrop = function (callback) {
//         var that = this
//         var animate = this.$element.hasClass('fade') ? 'fade' : ''

//         if (this.isShown && this.options.backdrop) {
//             var doAnimate = $.support.transition && animate

//             this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
//                 .prependTo(this.$element)
//                 .on('click.dismiss.bs.modal', $.proxy(function (e) {
//                     if (e.target !== e.currentTarget) return
//                     this.options.backdrop == 'static'
//                         ? this.$element[0].focus.call(this.$element[0])
//                         : this.hide.call(this)
//                 }, this))

//             if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

//             this.$backdrop.addClass('in')

//             if (!callback) return

//             doAnimate ?
//                 this.$backdrop
//                     .one('bsTransitionEnd', callback)
//                     .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
//                 callback()

//         } else if (!this.isShown && this.$backdrop) {
//             this.$backdrop.removeClass('in')

//             var callbackRemove = function () {
//                 that.removeBackdrop()
//                 callback && callback()
//             }
//             $.support.transition && this.$element.hasClass('fade') ?
//                 this.$backdrop
//                     .one('bsTransitionEnd', callbackRemove)
//                     .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
//                 callbackRemove()

//         } else if (callback) {
//             callback()
//         }
//     }

//     Modal.prototype.checkScrollbar = function () {
//         this.scrollbarWidth = this.measureScrollbar()
//     }

//     Modal.prototype.setScrollbar = function () {
//         var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
//         if (this.scrollbarWidth) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
//     }

//     Modal.prototype.resetScrollbar = function () {
//         this.$body.css('padding-right', '')
//     }

//     Modal.prototype.measureScrollbar = function () { // thx walsh
//         if (document.body.clientWidth >= window.innerWidth) return 0
//         var scrollDiv = document.createElement('div')
//         scrollDiv.className = 'modal-scrollbar-measure'
//         this.$body.append(scrollDiv)
//         var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
//         this.$body[0].removeChild(scrollDiv)
//         return scrollbarWidth
//     }

//     // MODAL PLUGIN DEFINITION
//     // =======================

//     function Plugin(option, _relatedTarget) {
//         return this.each(function () {
//             var $this   = $(this)
//             var data    = $this.data('bs.modal')
//             var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

//             if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
//             if (typeof option == 'string') data[option](_relatedTarget)
//             else if (options.show) data.show(_relatedTarget)
//         })
//     }

//     var old = $.fn.modal

//     $.fn.modal             = Plugin
//     $.fn.modal.Constructor = Modal


//     // MODAL NO CONFLICT
//     // =================

//     $.fn.modal.noConflict = function () {
//         $.fn.modal = old
//         return this
//     }


//     // MODAL DATA-API
//     // ==============

//     $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
//         var $this   = $(this)
//         var href    = $this.attr('href')
//         var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
//         var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

//         if ($this.is('a')) e.preventDefault()

//         $target.one('show.bs.modal', function (showEvent) {
//             if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
//             $target.one('hidden.bs.modal', function () {
//                 $this.is(':visible') && $this.trigger('focus')
//             })
//         })
//         Plugin.call($target, option, this)
//     })

// }(jQuery);
function adjustDialog(id){
    //console.log($('#'+id));
    //$('#'+id).on('show.bs.modal', function () {
    $(id).on('show.bs.modal', function () {
    var $this = $(this);
        var $modal_dialog = $this.find('.modal-dialog');
        // 关键代码，如没将modal设置为 block，则$modala_dialog.height() 为零
        $this.css('display', 'block');
        $modal_dialog.css({'margin-top': Math.max(0, ($(window).height() - $modal_dialog.height()) / 2)});
    });
}

function makecodes(id,strContent){
    jQuery('#code'+id).html("");
    jQuery('#code'+id).qrcode({
        render  : "canvas",
        //render  : "table",
        width   : 150,
        height  : 150,
        typeNumber  : -1,
        text    : strContent
    });
}
function Alertcode(id,strTitle, strContent) {
    var str = '<div class="modal fade modalbg" id=modal'+id+'><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> <span class="modal-title" >' + strTitle + '</span> </div> <div class="modal-body"><div class=" codeimg "  id=code'+id+'></div></div> </div> </div> </div>';
    var alertmodal = document.createElement("div");
    alertmodal.innerHTML = str;
    if(document.getElementById("modal"+id))
    {
        makecodes(id,strContent);
        $('#modal'+id).modal('show');
    }
    else{
        document.body.appendChild(alertmodal);
        makecodes(id,strContent);
        adjustDialog('#modal'+id);
        $('#modal'+id).modal('show');
    }
}
function sAlert(id, strContent) {
    var str = '<div id=modal'+id+'  class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-body" style="word-break: break-all;">' + strContent + '</div><div class="modal-footer" style="border: none;background: #fff;"><button class="btn btn-primary" data-dismiss="modal" aria-hidden="true">Confirm</button></div></div>';

    if(document.getElementById("divmodal"))
    {
        var alertmodal = document.createElement("div");
        alertmodal.id = 'divmodal';
        alertmodal.innerHTML = str;
        $("#divmodal").html("");
        $("#divmodal").html(str);
        adjustDialog('#modal'+id);
        $('#modal'+id).modal('show');
    }
    else{
        var alertmodal = document.createElement("div");
        alertmodal.id = 'divmodal';
        alertmodal.innerHTML = str;
        document.body.appendChild(alertmodal);
        adjustDialog('#modal'+id);
        $('#modal'+id).modal('show');
    }
}

function Alertcheck(id,strTitle, strContent) {
    var str = '<div class="modal fade modalbg modalsubmitcheck" id=modal'+id+' ><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> <span class="modal-title" >' + strTitle + '</span> </div> <div class="modal-body">' + strContent + '</div>' +
        ' <div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">取消</button> <button type="button" onclick="document.forms[0].submit();" class="btn btn-danger" >确定</button></div></div> </div> </div>';
    var alertmodal = document.createElement("div");
    alertmodal.innerHTML = str;
    if(document.getElementById("modal"+id))
    {
        $('#modal'+id).modal('show');
    }
    else{
        document.body.appendChild(alertmodal);
        adjustDialog('#modal'+id);
        $('#modal'+id).modal('show');
    }
}





