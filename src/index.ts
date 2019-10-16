import './styles/style.scss';
import * as $ from 'jquery';
import { ScrollTo } from './ts/ScrollTo';

$(function () {
    console.log('ready');
    new ScrollTo({
        target: '.js-link'
    });
});
