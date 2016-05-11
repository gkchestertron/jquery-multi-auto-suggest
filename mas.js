/**
 * @param {array[object]} optionsArr - array of options objects
 * @description - must pass path to json file (or object) and template and width and height for the drop-downs
 */
$.fn.multiAutoSuggest = function (optionsArr) {
    var self = this; // the element

    if (!Array.isArray(optionsArr))
        throw new Error('$.fn.multiAutoSuggest requires an array of options objects');

    $.each(optionsArr, function (idx, options) {
        options.offset = ???; // calculate offset from length of optionsArr
        autoSuggest(self, options);
    });

    function autoSuggest($input, options) {
        // make the thing, using the offset 
    }
};
