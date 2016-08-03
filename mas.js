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
                buildAutoSuggest(options.data, options);
            else
                $.ajax({
                    url: options.url,
                    success: function (data) {
                        buildAutoSuggest(data, options);
                    }
                });
        });

    // add suggest function to dom element
    this[0].suggest = function (suggestions) {
        if (!Array.isArray(suggestions[0]))
            suggestions = [suggestions];

        for (var i in suggestions)
            autoSuggest('', suggestions[i], $(suggestionsDiv.find('div')[i]), optionsArr[i]);

        suggestionsDiv.show();
    };

    function buildAutoSuggest(data, options) {
        if (!options.key && options.url)
            throw new Error('You did not supply a key - what is the name of the \
property you want to autoSuggest from?');

        var dictionary = !options.key ? data : $.map(data, function (el, idx) {
                var suggestion =  el[options.key];
                if (options.childKey) {
                    var children = el[options.childKey];
                    if (children && !Array.isArray(children)) {
                        children = [children];
                        suggestion += ' <ul><li>'+children.join('</li><li>')+'</li></ul>';
                    }
                }
                return suggestion;
            }),
            suggestionDiv = options.width ? $('<div style="width: '+options.width+';">') : $('<div>'),
            min = options.minChars || 3;

        options.maxSuggestions = options.maxSuggestions || 10;

        suggestionsDiv.append(suggestionDiv);

        self.on('keyup', function (event) {
            var val = '\\b'+self.val().split('.').join('\\.'),
                suggestions;

            if (val.length < min)
                return suggestionsDiv.hide();

            if (!options.prevVal 
            || options.prevVal.slice(0, min) !== val.slice(0, min)) {
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
            self.trigger('autocomplete');
            suggestionsDiv.hide();
        });

        self.on('click', function (event) {
            event.stopPropagation();
        });

        $('body').on('click', function () {
            suggestionsDiv.hide();
        });
    }

    function autoSuggest(val, suggestions, suggestionDiv, options) {
        suggestions.sort(function (a, b) {
            var val0 = val && val[0].toLowerCase() || '';

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
