/**
 * @param {Array.<{data:object[], key:string, url: string, title:string, width:string, maxSuggestions:number}>} optionsArr 
 * - array of options objects
 * @description - must pass path to json file (or object) and template and width and height for the drop-downs
 */
$.fn.multiAutoSuggest = function (optionsArr) {
    var self = this,
        suggestionsDiv = this.after('<div style="display:none" class="multi-auto-suggest">').next('div');

    if (!Array.isArray(optionsArr))
        throw new Error('$.fn.multiAutoSuggest requires an array of options objects');

    else
        $.each(optionsArr, function (idx, options) {
            if (options.data)
                buildAutoSuggest(data, options);
            else
                $.ajax({
                    url: options.url,
                    success: function (data) {
                        buildAutoSuggest(data, options);
                    }
                });
        });

    function buildAutoSuggest(data, options) {
        if (!options.key) {
            throw new Error('You did not supply a key - what is the name of the \
property you want to autoSuggest from?');
        }

        options.width = options.width || '300px';
        options.maxSuggestions = options.maxSuggestions || 10;

        var dictionary = $.map(data, function (el, idx) {
            return el[options.key];
        }),
        suggestionDiv = $('<div style="width: '+options.width+';">');

        suggestionsDiv.append(suggestionDiv);

        self.on('keyup', function (event) {
            var val = self.val(),
                suggestions;

            if (val.length < 3 || val.length > 10)
                return suggestionsDiv.hide();

            if (!options.prevVal 
            || options.prevVal.slice(0, 3) !== val.slice(0, 3)) {
                suggestions = options.suggestions = $.grep(dictionary, function (word) {
                    var re = new RegExp(val, 'i');
                    return re.test(word);
                });
            }
            else {
                suggestions = $.grep(options.suggestions, function (word) {
                    var re = new RegExp(val, 'i');
                    return re.test(word);
                });
            }

            autoSuggest(val, suggestions, suggestionDiv, options);

            options.prevVal = val;

            suggestionsDiv.show();
        });

        suggestionDiv.on('click', 'li', function (event) {
            var $li = $(event.currentTarget);
            self.val($li.text());
            suggestionsDiv.hide();
        });
    }

    function autoSuggest(val, suggestions, suggestionDiv, options) {
        suggestions.sort(function (a, b) {
            var val0 = val[0].toLowerCase();

            a = a.toLowerCase();
            b = b.toLowerCase();

            if (b[0] === val0
            &&  a[0] === val0)
                return a < b ? -1 : a > b ? 1 : 0;
            else if (a[0] === val0)
                return -1;
            else if (b[0] === val0)
                return 1;
            else
                return a < b ? -1 : a > b ? 1 : 0;
        });

        var suggestionsHtml = options.title ? '<h4>'+options.title+'</h4><hr />' : '';

        suggestionsHtml += '<ul>' + $.map(suggestions, function (suggestion) {
            return '<li>' + suggestion + '</li>';
        }).slice(0, options.maxSuggestions).join('') + '</ul>';

        suggestionDiv.html(suggestionsHtml);
    }
};
