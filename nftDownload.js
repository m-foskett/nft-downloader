import fetch from 'cross-fetch';

const download = function (data) {

    // Create a blob, passing the data with type
    const blob = new Blob([data], { type: 'text/csv' });

    // Creating an object for downloading url
    const url = window.URL.createObjectURL(blob)

    // Creating an anchor(a) tag of HTML
    const a = document.createElement('a')

    // Passing the blob downloading url
    a.setAttribute('href', url)

    // Setting the anchor tag attribute for downloading
    // and passing the download file name
    a.setAttribute('download', 'download.csv');

    // Performing a download with click
    a.click()
}

const objectToCsv = function (data) {

    const csvRows = [];

    /* Get headers as every csv data format
    has header (head means column name)
    so objects key is nothing but column name
    for csv data using Object.key() function.
    We fetch key of object as column name for
    csv */
    const headers = Object.keys(data[0]);

    /* Using push() method we push fetched
       data into csvRows[] array */
    csvRows.push(headers.join(','));

    // Loop to get value of each objects key
    for (const row of data) {
        const values = headers.map(header => {
            const val = row[header]
            return `${val}`;
        });

        // To add, sepearater between each value
        csvRows.push(values.join(','));
    }

    /* To add new line for each objects values
       and this return statement array csvRows
       to this function.*/
    return csvRows.join('\n');
};

const options = {method: 'GET',};
let data = null;
let image_urls = null;
let traits = null;
let names = null;
let extractedTraits = null;
let nfts = [];
let headers = null;
let values = [];
// const slug = ''
(async () => {
    try {
        const response = await fetch('https://testnets-api.opensea.io/api/v1/assets?limit=15&collection=moving-test', options);
        data = await response.json()

        if (data != null) {
            image_urls = data.assets.map(function(asset){
                return asset.image_url;
            });
            names = data.assets.map(function(asset){
                return asset.name;
            });
            traits = data.assets.map(function(asset){
                return asset.traits.map(function(trait) {
                    return {trait_type: trait.trait_type, value: trait.value}
                })
            })
            for (var i=0; i< traits.length; i++){
                headers = traits[i].map(({trait_type}) => trait_type);
                values.push(traits[i].map(({value}) => value));
            }
            // For each asset
            for(var i=0; i < names.length; i++){
                // Create an empty object
                var obj = {};
                // Create a name key/value pair
                obj['Name'] = names[i];
                // For each trait, create a key/value pair
                for (var j=0; j< headers.length; j++){
                    obj[headers[j]] = values[i][j];
                }
                // Push the new object to array of objects
                nfts.push(obj);
            }
            // console.log(nfts)
            console.log(image_urls)
            const csvdata = objectToCsv(nfts);
            // download(csvdata);
            console.log(csvdata);
        }
    }
    catch(err) {
        console.error(err)
    }
})();




