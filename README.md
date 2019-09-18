# bus-mall
Code Fellows 201 Bus-Mall Project

Link to deployed page: https://leokuhorev.github.io/bus-mall/

FEATURES:

- users are given certain amount of votes (stored in *VOTES* variable in app.js) that they need to spend by clicking on the item they like the most;
- amount of items per page can be changed in the dropdown;
- no item matches the ones besides it or the ones that were shown immediately before (console logs dynamically changing array (depending on item per page value) with unique indexes for each item);
- after users run out of votes the app shows them their:
    - favorite item/items (based on votes/views ratio);
    - chart that shows only items that user voted for with corresponding number of views, votes and rating. The favorite item/items bar has different color so that it can be easily distinguished;
    - if user wants to see the list of the items they voted for, there's a button for that;
- number of votes left, items per page, votes and views count are stored in local storage and are retrieved when user refreshes the page or closes the browser completely. Date from local storage will be cleared when user fully completes the survey (all 25 votes are spent);

TOOLS USED:
- chart.js API
- local storage


---------------------------------
CREDITS:

[Bus image](https://publicdomainvectors.org/)

[Bus icon by Icons8](https://icons8.com/icon/119440/bus)

[Flexbox](https://www.w3schools.com/css/css3_flexbox.asp)

[array.includes() method](https://www.w3schools.com/jsref/jsref_includes_array.asp)

[array.apply() method](https://stackoverflow.com/questions/21255138/how-does-the-math-max-apply-work)

[array.map() method](https://www.w3schools.com/jsref/jsref_map.asp)

[maximum value of objects property in array](https://stackoverflow.com/questions/4020796/finding-the-max-value-of-an-attribute-in-an-array-of-objects)

[toFixed() method](https://www.w3schools.com/jsref/jsref_tofixed.asp)

[scrollIntoView() method](https://www.w3schools.com/jsref/met_element_scrollintoview.asp)

[Capitalize first letter of a string](https://joshtronic.com/2016/02/14/how-to-capitalize-the-first-letter-in-a-string-in-javascript/)

[Replace all occurences of a string ](https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string)

[Remove space between html inline elements](https://stackoverflow.com/questions/5078239/how-do-i-remove-the-space-between-inline-block-elements)