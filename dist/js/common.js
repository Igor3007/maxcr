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

            this.renderMenu()
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

}); //dcl