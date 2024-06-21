document.addEventListener('DOMContentLoaded', function (event) {


    /* =================================================
    css variable
    =================================================*/

    function css_variable() {
        let vh = window.innerHeight * 0.01;
        let hgtheader = document.querySelector('.header') ? document.querySelector('.header').clientHeight : 64
        let hgtheadertop = document.querySelector('.header-top') ? document.querySelector('.header-top').clientHeight : 41

        document.documentElement.style.setProperty('--vh', vh + 'px');
        document.documentElement.style.setProperty('--hgt-header', hgtheader + 'px');
        document.documentElement.style.setProperty('--hgt-header-top', hgtheadertop + 'px');
    }

    window.addEventListener('load', css_variable)
    window.addEventListener('resize', css_variable)

    /* =================================================
    smooth scroll
    ================================================= */

    window.scrollToTargetAdjusted = function (params) {

        let element = typeof params.elem == 'string' ? document.querySelector(params.elem) : params.elem
        let headerOffset = 15;
        let elementPosition = element.getBoundingClientRect().top + window.scrollY

        console.log(elementPosition)

        let offsetPosition = elementPosition - headerOffset - params.offset;



        window.scrollTo({
            top: Number(offsetPosition),
            behavior: "smooth"
        });
    }

    /* =================================================
    preloader
    ================================================= */

    class Preloader {

        constructor() {
            this.$el = this.init()
            this.state = false
        }

        init() {
            const el = document.createElement('div')
            el.classList.add('loading')
            el.innerHTML = '<div class="indeterminate"></div>';
            document.body.append(el)
            return el;
        }

        load() {

            this.state = true;

            setTimeout(() => {
                if (this.state) this.$el.classList.add('load')
            }, 300)
        }

        stop() {

            this.state = false;

            setTimeout(() => {
                if (this.$el.classList.contains('load'))
                    this.$el.classList.remove('load')
            }, 200)
        }

    }

    window.preloader = new Preloader();


    /* ==============================================
    Status
    ============================================== */

    function Status() {

        this.containerElem = '#status'
        this.headerElem = '#status_header'
        this.msgElem = '#status_msg'
        this.btnElem = '#status_btn'
        this.timeOut = 10000,
            this.autoHide = true

        this.init = function () {
            let elem = document.createElement('div')
            elem.setAttribute('id', 'status')
            elem.innerHTML = '<div id="status_header"></div> <div id="status_msg"></div><div id="status_btn"></div>'
            document.body.append(elem)

            document.querySelector(this.btnElem).addEventListener('click', function () {
                this.parentNode.setAttribute('class', '')
            })
        }

        this.msg = function (_msg, _header) {
            _header = (_header ? _header : 'Отлично!')
            this.onShow('complete', _header, _msg)
            if (this.autoHide) {
                this.onHide();
            }
        }
        this.err = function (_msg, _header) {
            _header = (_header ? _header : 'Ошибка')
            this.onShow('error', _header, _msg)
            if (this.autoHide) {
                this.onHide();
            }
        }
        this.wrn = function (_msg, _header) {
            _header = (_header ? _header : 'Внимание')
            this.onShow('warning', _header, _msg)
            if (this.autoHide) {
                this.onHide();
            }
        }

        this.onShow = function (_type, _header, _msg) {
            document.querySelector(this.headerElem).innerText = _header
            document.querySelector(this.msgElem).innerText = _msg
            document.querySelector(this.containerElem).classList.add(_type)
        }

        this.onHide = function () {
            setTimeout(() => {
                document.querySelector(this.containerElem).setAttribute('class', '')
            }, this.timeOut);
        }

    }

    window.STATUS = new Status();
    const STATUS = window.STATUS;
    STATUS.init();

    /* ==============================================
    ajax request
    ============================================== */

    window.ajax = function (params, response) {

        //params Object
        //dom element
        //collback function

        window.preloader.load()

        let xhr = new XMLHttpRequest();
        xhr.open((params.type ? params.type : 'POST'), params.url)

        if (params.headers) {
            for (let key in params.headers) {
                xhr.setRequestHeader(key, params.headers[key]);
            }
        }

        if (params.responseType == 'json') {
            xhr.responseType = 'json';
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.send(JSON.stringify(params.data))
        } else {
            let formData = new FormData()
            for (key in params.data) {
                formData.append(key, params.data[key])
            }
            xhr.send(formData)
        }

        xhr.onload = function () {

            response ? response(xhr.status, xhr.response) : ''
            window.preloader.stop()
            setTimeout(function () {
                if (params.btn) {
                    params.btn.classList.remove('btn-loading')
                }
            }, 300)
        };

        xhr.onerror = function () {
            window.STATUS.err('Error: ajax request failed')
        };

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 3) {
                if (params.btn) {
                    params.btn.classList.add('btn-loading')
                }
            }
        };
    }

    /* ==================================================
    maska
    ==================================================*/
    const {
        MaskInput,
    } = Maska

    function initMaska() {
        new MaskInput("[data-maska]")
    }

    initMaska();


    /* ==================================================
    burgerMenu
    ==================================================*/

    class MainMenu {
        constructor(ctx) {
            this.$el = ctx
            this.btns = this.$el.querySelectorAll('.btn-burger')
            this.container = this.$el.querySelector('[data-menu="container"]')

            this.containerLinks = this.$el.querySelector('[data-menu="links"]')
            this.containerTop = this.$el.querySelector('[data-menu="top"]')
            this.containerContacts = this.$el.querySelector('[data-menu="contacts"]')

            this.addEvent()
        }

        toggleMenu(item) {
            item.classList.toggle('open')

            if (!item.classList.contains('open')) {
                this.closeMenu()
            } else {
                this.openMenu()
            }
        }

        openMenu() {
            this.container.classList.toggle('is-open')
            this.$el.body.classList.toggle('page-hidden')

            this.containerLinks.children.length || this.renderMenu()


        }

        closeMenu() {
            this.btns.forEach(item => {
                !item.classList.contains('open') || item.classList.remove('open')
            });

            !this.container.classList.contains('is-open') || this.container.classList.remove('is-open');
            !this.$el.body.classList.contains('page-hidden') || this.$el.body.classList.remove('page-hidden');
        }

        renderMenu() {
            this.containerLinks.innerHTML = document.querySelector('.header__links').outerHTML
            this.containerTop.innerHTML = document.querySelector('.header-top').outerHTML
            this.containerContacts.innerHTML = document.querySelector('.header-phone-wrp').outerHTML

            this.afterLoad()
        }

        afterLoad() {
            this.containerLinks.querySelectorAll('a[href="#catalog-popup"]').forEach(item => {
                item.addEventListener('click', e => {
                    window.catalogPopup.open()
                    this.closeMenu()
                })
            })

            //menu

            this.containerTop.querySelectorAll('.header-top__nav .isset-sub').forEach(item => {
                item.addEventListener('click', e => {
                    e.preventDefault()
                    item.classList.toggle('is-open')
                    item.querySelector('.sub-menu').classList.toggle('is-open')
                })
            })
        }

        addEvent() {
            this.btns.forEach(item => {
                item.addEventListener('click', e => this.toggleMenu(item))
            })
        }
    }

    if (document.querySelector('.btn-burger')) {
        window.MainMenu = new MainMenu(document)


    }

    /* ============================================
    phone header
    ============================================*/

    if (document.querySelector('.header-phone-button')) {
        document.querySelector('.header-phone-button').addEventListener('click', e => {
            document.querySelector('.header-phone-wrp').classList.toggle('is-open')
        })
    }

    /* =========================================
    first block
    =========================================*/

    if (document.querySelector('.first-block__slide')) {
        document.querySelectorAll('.first-block__slide').forEach(slide => {
            slide.addEventListener('mouseenter', (e) => {
                if (document.body.clientWidth > 992) {
                    document.querySelector('.first-block__bg').innerHTML = slide.querySelector('.fb-slide__image').innerHTML
                }
            })
        })
    }

    /* ========================================
    slider
    ========================================*/


    if (document.querySelector('[data-slider="product"]')) {
        var splide = new Splide('[data-slider="product"]', {

            arrows: true,
            pagination: false,
            gap: 24,
            start: 0,
            perPage: 4,


            breakpoints: {
                1200: {
                    perPage: 3,
                    gap: 24,
                },
                992: {
                    perPage: 2,
                    gap: 12,
                },
                576: {
                    destroy: true,
                },

            },

        });




        splide.mount();
    }

    /* ==================================================
    get width scrollbar
    ==================================================*/

    window.getScrollBarWidth = function () {

        // Creating invisible container
        const outer = document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.overflow = 'scroll'; // forcing scrollbar to appear
        outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
        document.body.appendChild(outer);

        // Creating inner element and placing it in the container
        const inner = document.createElement('div');
        outer.appendChild(inner);

        // Calculating difference between container's full width and the child width
        const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

        // Removing temporary elements from the DOM
        outer.parentNode.removeChild(outer);

        return scrollbarWidth;

    }

    /* ==============================================
    button page scroll-top
    ============================================== */

    if (document.querySelector('.float-bar__top')) {
        const btnPageScrollTop = document.querySelector('.float-bar__top')
        const btnFloat = document.querySelector('.float-bar')
        btnPageScrollTop.addEventListener('click', e => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        })

        window.addEventListener('scroll', e => {
            if (document.documentElement.scrollTop > 400) {
                btnFloat.classList.add('is-active')
            } else {
                if (btnFloat.classList.contains('is-active')) btnFloat.classList.remove('is-active')
            }
        })
    }

    /* ===========================================
    marquee 
    ===========================================*/

    class Marquee {
        constructor(el) {
            this.$el = el
            this.containerWidth = this.$el.clientWidth
            this.trackWidth = 0
            this.deltaWidth = 0
            this.currentPosition = 0
            this.shift = 10
            this.scrollDirection = '-'

            this.init()

        }


        init() {

            this.getTrackWidth()
            this.deltaWidth = this.trackWidth - this.containerWidth
            this.run()
            this.scrollHandler()


        }

        getTrackWidth() {
            this.$el.querySelectorAll('li').forEach(li => {
                this.trackWidth += li.clientWidth
            })
        }

        run() {
            setInterval(() => {

                if (this.currentPosition < this.deltaWidth && this.scrollDirection == '-') {
                    this.currentPosition = this.currentPosition + this.shift;
                } else {
                    this.scrollDirection = '+'
                    this.currentPosition = this.currentPosition - this.shift;

                    if (this.currentPosition <= 0) {
                        this.scrollDirection = '-'
                    }
                }

                this.$el.querySelector('ul').style.transform = 'translateX(-' + this.currentPosition + 'px)'
            }, 290)
        }

        scrollHandler() {

            const checkScrollDirection = (event) => {
                this.scrollDirection = checkScrollDirectionIsUp(event) ? '+' : '-'
            }

            const checkScrollDirectionIsUp = (event) => {
                if (event.wheelDelta) {
                    return event.wheelDelta > 0;
                }
                return event.deltaY < 0;
            }

            document.body.addEventListener('wheel', checkScrollDirection);

        }


    }

    if (document.querySelector('[data-marquee]')) {
        const items = document.querySelectorAll('[data-marquee="container"]')
        items.forEach(item => new Marquee(item))
    }

    /* =======================================
    catalogPopup
    =======================================*/

    if (document.querySelector('a[href="#catalog-popup"]')) {

        class catalogPopup {
            constructor() {
                this.$el = document.querySelector('.catalog-popup')
                this.btnCatalog = document.querySelectorAll('a[href="#catalog-popup"]')
                this.btnClose = this.$el.querySelector('[data-catalog-popup="close"]')
                this.mobileBreakpoint = 993;
                this.initWindowWidth = document.body.clientWidth
                this.widthScrollbar = window.getScrollBarWidth()
                this.isiOS = window.isIOS
                this.currentUrl = window.location.pathname
                this.timer = null

                this.events()
            }

            open() {
                this.$el.classList.add('open')
                this.lockScroll(true)
                const items = this.$el.querySelector('.catalog-popup__nav').querySelectorAll('li')
                if (document.body.clientWidth > this.mobileBreakpoint && items.length) {
                    this.openSubDesctop(items[0])
                }
            }

            close() {

                this.$el.classList.add('fade-close-animation')

                setTimeout(() => {
                    this.$el.classList.remove('open')
                    this.$el.classList.remove('fade-close-animation')

                }, 400)

                this.lockScroll(false)
            }

            lockScroll(val) {
                if (val) {
                    //fix iOS body scroll
                    if (this.isiOS) {
                        document.body.style.marginTop = `-${window.scrollY}px`
                        document.documentElement.classList.add('safari-fixed')
                    } else {

                    }
                    //compensate scrollbar
                    if (this.widthScrollbar > 0) document.body.style.setProperty('margin-right', this.widthScrollbar + 'px')

                    //page overflow hidden
                    document.body.classList.add('page-hidden')

                } else {

                    //fix iOS body scroll
                    let documentBody = document.body

                    if (this.isiOS) {
                        if (document.documentElement.classList.contains('safari-fixed')) document.documentElement.classList.remove('safari-fixed')
                        const bodyMarginTop = parseInt(documentBody.style.marginTop, 10)
                        documentBody.style.marginTop = ''
                        if (bodyMarginTop || bodyMarginTop === 0) window.scrollTo(0, -bodyMarginTop)
                    }

                    //compensate scrollbar
                    document.body.style.removeProperty('margin-right', this.widthScrollbar + 'px')

                    //page overflow hidden
                    documentBody.classList.remove('page-hidden')
                }
            }

            openSubMobile(item) {

                if (item.querySelector('.sub-menu')) {

                    const template = `
                        <div class="catalog-popup__layer-title" >
                            <span class="icon-back" ></span>
                            <span class="layer-name" >${item.querySelector('a').innerText}</span>
                            <span class="icon-cross" ></span>
                        </div>
                        <div class="catalog-popup__layer-nav" ><ul>${item.querySelector('.sub-menu').innerHTML}</ul></div>
                       `;

                    const layer = document.createElement('div')
                    layer.classList.add('catalog-popup__layer')
                    layer.innerHTML = template

                    layer.querySelector('.icon-back').addEventListener('click', e => {
                        layer.remove()
                    })

                    layer.querySelector('.icon-cross').addEventListener('click', e => {
                        this.close()
                    })

                    this.liEvents(layer)

                    this.$el.querySelector('.catalog-popup__main').append(layer)


                }

            }


            getColumnMenu(menu) {
                let items = menu.querySelector('.sub-menu').children
                let result = [
                    document.createElement('ul'),
                    document.createElement('ul'),
                    document.createElement('ul'),
                ];

                let column = 0;

                Array.from(items).forEach(li => {
                    result[column].append(li)
                    column <= 1 ? column++ : column = 0
                })

                return result[0].outerHTML + result[1].outerHTML + result[2].outerHTML
            }


            openSubDesctop(item) {

                if (item.querySelector('.sub-menu')) {

                    item.classList.add('is-hover')

                    const template = `
                       <div class="catalog-popup__catig" >${item.querySelector('.category-tree--level1').innerText}</div>
                       <div class="catalog-popup__list" >${this.getColumnMenu(item.cloneNode(true))}</div>
                      `;

                    const layer = document.createElement('div')
                    layer.classList.add('catalog-popup__submenu')
                    layer.innerHTML = template

                    const subMenu = layer.querySelectorAll('.sub-menu')
                    subMenu.forEach(item => {

                        if (item.querySelectorAll('li').length > 7) {

                            item.classList.add('is-slice-list')
                            const elem = document.createElement('div')
                            elem.classList.add('sub-menu-toggle')
                            elem.innerText = 'Ещё'

                            //add event

                            elem.addEventListener('click', e => {
                                item.classList.toggle('is-open')
                                elem.classList.toggle('is-open')
                                elem.innerText = (item.classList.contains('is-open') ? 'Свернуть' : 'Ещё')
                            })

                            item.after(elem)

                        }

                    })

                    // закрывать при переходе на другую страницу
                    layer.querySelectorAll('a').forEach(link => {
                        link.addEventListener('click', e => {
                            setTimeout(() => {
                                this.close()
                            }, 300)
                        })
                    })

                    this.$el.querySelector('.catalog-popup__main').innerHTML = '';
                    this.$el.querySelector('.catalog-popup__main').append(layer)

                }

            }

            events() {

                this.btnCatalog.forEach(item => {
                    item.addEventListener('click', e => {
                        e.preventDefault()
                        this.open()
                    })
                })

                this.liEvents(this.$el.querySelector('.catalog-popup__nav'))

                this.$el.addEventListener('click', e => {


                    if (document.body.clientWidth > this.mobileBreakpoint) {
                        if (!e.target.closest('.catalog-popup__wrp') && !e.target.closest('a[href="#catalog-popup"]')) {
                            this.close()
                        }
                    }
                })


                this.btnClose.addEventListener('click', e => {
                    this.close()
                })


            }



            debounce(method, delay, e) {
                clearTimeout(this.timer);
                this.timer = setTimeout(function () {
                    method(e);
                }, delay);
            }

            liEvents(container) {
                const items = container.querySelectorAll('li')




                items.forEach(item => {

                    const keyupHahdler = (e) => {
                        items.forEach(item => {
                            if (item.classList.contains('is-hover')) {
                                item.classList.remove('is-hover')
                            }
                        })


                        if (document.body.clientWidth > this.mobileBreakpoint) {
                            this.openSubDesctop(item)
                        } else {
                            this.openSubMobile(item)
                        }
                    }

                    item.addEventListener((document.body.clientWidth > this.mobileBreakpoint ? 'mouseenter' : 'click'), e => this.debounce(keyupHahdler, 200, e))
                })
            }
        }

        if (document.querySelector('.catalog-popup')) {
            window.catalogPopup = new catalogPopup()
        }


    }

    /* =================================================
     popups
     =================================================*/

    function popupSuccess() {

        const instansePopup = new afLightbox({
            mobileInBottom: true
        })

        instansePopup.open(`
           <div class="popup-thanks" >
                <h2> Спасибо! </h2>
                <p>Мы свяжемся с вами в ближайшее время!</p>
           </div> `, false)

    }

    if (document.querySelector('[data-modal]')) {
        const items = document.querySelectorAll('[data-modal]')

        items.forEach(item => {
            item.addEventListener('click', e => {

                window.ajax({
                    type: 'GET',
                    url: item.dataset.modal
                }, (status, response) => {

                    const instansePopup = new afLightbox({
                        mobileInBottom: true
                    })

                    instansePopup.open(response, (instanse) => {
                        initMaska()

                        if (instanse.querySelector('form')) {
                            const form = instanse.querySelector('form')

                            form.addEventListener('submit', e => {

                                e.preventDefault()

                                const formData = new FormData(e.target)
                                let params = {}
                                let btn = form.querySelector('.btn')

                                for (let [name, value] of formData) {
                                    params[name] = value
                                }

                                btn.classList.add('btn-loading')

                                window.ajax({
                                    type: 'POST',
                                    url: form.getAttribute('action'),
                                    data: params

                                }, (status, response) => {

                                    if (status == 200) {
                                        popupSuccess();
                                        !btn.classList.contains('btn-loading') || btn.classList.remove('btn-loading')
                                        instansePopup.close()
                                    }


                                })
                            })
                        }

                        if (item.dataset.title) {
                            instanse.querySelector('.popup-form__title').innerHTML = item.dataset.title
                        }

                        if (item.dataset.desc) {
                            instanse.querySelector('.popup-form__desc').innerHTML = item.dataset.desc
                        }
                    })
                })

            })
        })
    }

}); //dcl