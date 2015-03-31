/**
 * Created by artem.malieiev on 3/27/2015.
 */
(function (angular, window) {
    'use strict';
    angular.module('amalieiev.international', []).provider('$international', [function () {
        var locale = {},
            parts = [],
            sync = false,
            urlTemplate = '/i18n/{lang}/{part}.json',
            lang = 'en',
            $httpService;

        function getUrl(lang, part) {
            return urlTemplate.replace('{lang}', lang).replace('{part}', part);
        }

        function getSync(url) {
            var xhr = new window.XMLHttpRequest();
            xhr.open('GET', url, false);
            xhr.send(null);
            return JSON.parse(xhr.responseText);
        }

        function loadParts(lang) {
            angular.forEach(parts, function (part) {
                var url = getUrl(lang, part);
                if (sync) {
                    angular.extend(locale, getSync(url));
                } else {
                    $httpService.get(url, {cache: true}).then(function (response) {
                        angular.extend(locale, response.data);
                    });
                }
            });
        }

        return {
            config: function (config) {
                if (config.lang) {
                    lang = config.lang;
                }
                if (config.urlTemplate) {
                    urlTemplate = config.urlTemplate;
                }
                if (config.sync) {
                    sync = config.sync;
                }
            },
            addPart: function (part) {
                parts.push(part);
            },
            $get: ['$http', function ($http) {
                $httpService = $http;
                loadParts(lang);
                return {
                    use: loadParts,
                    locale: locale
                };
            }]
        };
    }]);
}(angular, window));
