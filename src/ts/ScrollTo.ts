import * as $ from 'jquery';

export interface IScrollToOptions {
    target: string | Array<String> | JQuery<HTMLElement>,
    duration?: number
}

/**
 * Smooth scrolling to anchor
 * Usage:
 * new ScrollTo({
 *     target: '.js-link'
 * })
 * new ScrollTo({
 *     target: ['.js-link', '.js-another-link']
 * })
 * new ScrollTo({
 *     target: $('.js-link')
 * })
 */
export class ScrollTo {
    options: IScrollToOptions;
    body: JQuery<HTMLElement>;

    constructor(options: IScrollToOptions) {
        this.options = options;
        this.options.duration = this.options.duration || 400;
        this.body = $('html, body');

        this.appendListeners(this.options.target);
    }

    appendListeners(target: IScrollToOptions["target"]): void {
        switch (typeof target) {
            case "string": {
                this.appendListener($(target));
                break;
            }
            case "object": {
                if (Array.isArray(target)) {
                    this.appendListener($(target.join(',')));
                } else if (target instanceof jQuery) {
                    this.appendListener(target);
                } else {
                    throw new Error('Undefined type of target');
                }
                break;
            }
            case "undefined": {
                break;
            }
            default: {
                throw new Error('Undefined type of target');
            }
        }
    }

    appendListener(target: JQuery<HTMLElement>): void {
        const self = this;

        target.on('click', function(e) {
            const clickedElement = $(this);
            const isValidHref = clickedElement.attr('href').indexOf('#') !== -1;
            const isValidDataTo = Boolean(clickedElement.attr('data-to'));

            if (!isValidDataTo && !isValidHref) throw new Error('Element not have target point. Anchor href or data-to');

            if (isValidHref) self.scroll(clickedElement.attr('href'));
            else if (isValidDataTo) self.scroll(clickedElement.attr('data-to'));
        });
    }

    scroll(to: string) {
        const $to = $(to);
        const gap = parseInt($to.attr('data-gap')) || 0;
        this.body.stop().animate({scrollTop:$to.offset().top - gap}, this.options.duration, 'swing');
    }
}
