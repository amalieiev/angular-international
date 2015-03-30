/**
 * Created by artem.malieiev on 3/27/2015.
 */
(function () {
    'use strict';
    angular.module('amalieiev.international', []).provider('$international', [function () {
        var translations = {},
            parts = [],
            sync = false,
            templateUrl = '/i18n/{lang}/{part}.json',
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
            return templateUrl.replace('{lang}', lang).replace('{part}', part);
        }

        /**
         *
         * @param {string} lang
         */
        function loadParts(lang) {
            angular.forEach(parts, function (part) {
                if (sync) {
                    angular.extend(translations, getSync(getUrl(lang, part)));
                } else {
                    $httpService.get(getUrl(lang, part), {cache: true}).then(function (response) {
                        angular.extend(translations, response.data);
                    });
                }
            });
        }

        function getSync(url) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            xhr.send(null);
            if (xhr.status === 200) {
                return JSON.parse(xhr.responseText);
            }
        }

        return {
            config: function (config) {
                if (config.preferredLanguage) {
                    preferredLanguage = config.preferredLanguage;
                }
                if (config.templateUrl) {
                    templateUrl = config.templateUrl;
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
                loadParts(preferredLanguage);
                return {
                    use: loadParts,
                    translations: translations
                };
            }]
        };
    }]);
}());
