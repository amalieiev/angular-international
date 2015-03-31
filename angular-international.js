/**
 * Created by artem.malieiev on 3/27/2015.
 */
(function (angular, window) {
    'use strict';
    angular.module('amalieiev.international', []).provider('$international', [function () {
        var translations = {},
            translationsCache = {},
            parts = [],
            settings = {
                sync: false,
                baseLocale: null,
                preferredLocale: 'en',
                urlTemplate: '/i18n/{locale}/{part}.json'
            },
            $httpService;

        function getUrl(locale, part) {
            return settings.urlTemplate.replace('{locale}', locale).replace('{part}', part);
        }

        function getSync(url) {
            var xhr;
            if (translationsCache[url]) {
                return translationsCache[url];
            }
            xhr = new window.XMLHttpRequest();
            xhr.open('GET', url, false);
            xhr.send(null);
            translationsCache[url] = JSON.parse(xhr.responseText);
            return translationsCache[url];
        }

        function loadParts(locale) {
            angular.forEach(parts, function (part) {
                if (settings.sync) {
                    angular.extend(translations, getSync(getUrl(locale, part)));
                } else {
                    $httpService.get(getUrl(locale, part), {cache: true}).then(function (response) {
                        angular.extend(translations, response.data);
                    });
                }
            });
        }

        return {
            config: function (config) {
                if (config.baseLocale) {
                    settings.baseLocale = config.baseLocale;
                }
                if (config.preferredLocale) {
                    settings.preferredLocale = config.preferredLocale;
                }
                if (config.urlTemplate) {
                    settings.urlTemplate = config.urlTemplate;
                }
                if (config.sync) {
                    settings.sync = config.sync;
                }
            },
            addPart: function (part) {
                parts.push(part);
            },
            $get: ['$http', function ($http) {
                $httpService = $http;
                if (settings.baseLocale) {
                    loadParts(settings.baseLocale);
                }
                if (settings.baseLocale !== settings.preferredLocale) {
                    loadParts(settings.preferredLocale);
                }
                return {
                    use: loadParts,
                    locale: translations
                };
            }]
        };
    }]);
}(angular, window));
