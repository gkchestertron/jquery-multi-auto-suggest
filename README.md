#Multi Auto Suggest
This Jquery plugin allows you to easily and quickly create multiple auto-suggest dropdowns for any input by calling a simple function and passing in an array of options objects - one for each dropdown. This repo includes an example page and minimal css file.

##Usage
```
$('input').multiAutoSuggest([
    {
        title: 'Resources', 
        url: 'names.json', 
        key: 'ResourceName' 
    }, 
    {
        title: 'Needs', 
        url:'needs.json', 
        key: 'Name'
    }
]);
```

##Options
- title: title for the dropdown
- url: url to fetch json data from - could be a json file or json api endpoint
- data: if you don't have an endpoint, you can just pass in an array of strings to use as suggestions (in this case you would neither need url nor key)
- key: the key in the object in the json array to use for the auto suggest: i.e. if the objects look like this: { value: 'The thing you are searching for' }, then the key would be 'value'.
- width: the width of the auto suggest - should be a valid css width value
- maxSuggestions: max number of suggestions to display - defaults to 10
