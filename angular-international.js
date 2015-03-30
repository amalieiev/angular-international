/**
 * Created by artem.malieiev on 3/27/2015.
 */
(function () {
    'use strict';
    angular.module('amalieiev.international', []).provider('$international', [function () {
        var translations = {},
            parts = [],
            urlTemplate = '/i18n/{lang}/{part}.json',
            preferredLanguage = 'en',
            $httpService;

        /**
         * Returns url which points on localization file for required part.
         * @param {string} lang
         * @param {string} part
         * @returns {string} url
         * @private
         * @example
         * getUrl('en', 'login');
         * '/i18n/en/login.json'
         */
        function getUrl(lang, part) {
            return urlTemplate.replace('{lang}', lang).replace('{part}', part);
        }

        /**
         *
         * @param {string} lang
         */
        function loadParts(lang) {
            angular.forEach(parts, function (part) {
                $httpService.get(getUrl(lang, part), {cache: true}).then(function (response) {
                    angular.extend(translations, response.data);
                });
            });
        }

        return {
            setPreferredLanguage: function (language) {
                preferredLanguage = language;
            },
            setUrlTemplate: function (template) {
                urlTemplate = template;
            },
            addPart: function (part) {
                parts.push(part);
            },
            $get: ['$http', function ($http) {
                $httpService = $http;
                loadParts(preferredLanguage);
                return {
                    use: loadParts,
                    translations: translations
                };
            }]
        };
    }]);
}());
